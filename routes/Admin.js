const express = require("express")
const router = express.Router()
const {sign} = require("jsonwebtoken")
const {Products} = require("../models")
const verifyAdmin = require("../middleware/verifyAdmin")
require("dotenv").config()


// admin signin
router.post("/signin", async (req, res) => {
  try{
    const {password} = req.body

    if(password !== process.env.ADMIN_PASSWORD){
      return res.status(401).json({error: "არასწორი პაროლი"})
    }

    const token = sign({ admin: true }, process.env.JWT_SECRET, { expiresIn: "7d"})
    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
    })

    res.json({ message: "წარმატებით შეხვედით" })
  } catch(err){
    res.status(500).json({error: err.message})
  }
})


// admin loggedIn
router.get("/verify", verifyAdmin, async (req, res) => {
  try{
    res.status(200).json({ admin: true })
  } catch(err){
    res.status(500).json({ error: err.message })
  }
})


// admin logout
router.delete("/logout", verifyAdmin, async (req, res) => {
  try{
    res.clearCookie("adminToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
    })
    res.json({ message: "თქვენ გამოხვედით სისტემიდან" })
  } catch(err){
    res.status(500).json({ error: err.message })
  }
})


//add a product
router.post("/", verifyAdmin, async (req, res) => {
  try{
    let { name, brand, price, amperage, image, warranty, voltage } = req.body

    if(!name || !brand || price === null || price === undefined){
      return res.status(400).json({error: "დასახელება, ბრენდი და ფასი აუცილებელია"})
    }

    if(warranty === 0){
      warranty = null
    }

    const newProduct = await Products.create({ 
      name: name.trim(), 
      brand: brand.trim(), 
      price, 
      amperage, 
      image, 
      warranty,
      voltage
    })

    res.status(201).json({message: "პროდუქტი წარმატებით შეიქმნა", product: newProduct})

  } catch(err){
    if(err.name === "SequelizeValidationError"){
      return res.status(400).json({error: err.errors[0]?.message || err.message})
    }
    res.status(500).json({error: err.message})
  }
})


//edit a product
router.patch("/edit-product/:productId", verifyAdmin, async (req, res) => {
  try{
    const {productId} = req.params

    const product = await Products.findByPk(productId)
    if(!product){
      return res.status(404).json({error: "პროდუქტი არ მოიძებნა"})
    }

    const allowedFields = ["name", "brand", "price", "amperage", "image", "warranty", "voltage"]
    const updates = {}

    for (const field of allowedFields){
      if(req.body[field] !== undefined){
        updates[field] = req.body[field]
      }
    }
    await product.update(updates)

    res.status(200).json(product)
  } catch(err){
    if(err.name === "SequelizeValidationError"){
      return res.status(400).json({error: err.message})
    }
    res.status(500).json({error: err.message})
  }
} )

//delete a product
router.delete("/:productId", verifyAdmin, async (req, res) => {
  try{
    const {productId} = req.params

    const product = await Products.findByPk(productId)
    if(!product){
      return res.status(404).json({error: "პროდუქტი არ მოიძებნა"})
    }

    await product.destroy()

    res.status(200).json({message: "პროდუქტი წარმატებით წაიშალა"})
  } catch(err){
    res.status(500).json({error: err.message})
  }
})




module.exports = router