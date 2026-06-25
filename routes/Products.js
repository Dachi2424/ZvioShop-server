const express = require("express")
const router = express.Router()
const {Products} = require("../models")
const { Op } = require("sequelize")


// get all/filtered products (i have to add page limit)
router.get("/", async (req, res) => {
  try{
    const {search, brand, minPrice, maxPrice, minAmperage, maxAmperage, minWarranty, maxWarranty, page = 1, limit = 24} = req.query
    const offset = (Math.max(1, parseInt(page)) - 1) * parseInt(limit)
    const where = {}

    if(search) where.name = {[Op.like]: `%${search}%`}
    if(brand) where.brand = brand
    if(minPrice || maxPrice){
      where.price = {}
      if(minPrice) where.price[Op.gte] = parseInt(minPrice)
      if(maxPrice) where.price[Op.lte] = parseInt(maxPrice)
    }

    if(minAmperage || maxAmperage){
      where.amperage = {}
      if(minAmperage) where.amperage[Op.gte] = parseInt(minAmperage)
      if(maxAmperage) where.amperage[Op.lte] = parseInt(maxAmperage)
    }
    
    if(minWarranty || maxWarranty){
      where.warranty = {}
      if(minWarranty) where.warranty[Op.gte] = parseInt(minWarranty)
      if(maxWarranty) where.warranty[Op.lte] = parseInt(maxWarranty)
    }

    console.log(req.query)
    console.log(where)
    const {count, rows: products} = await Products.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset
    }) 

    res.status(200).json({
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit)),
      products
    })

  } catch(err){
    res.status(500).json({error: err.message})
  }
})


//get specific product
router.get("/:productId", async (req, res) => {
  try{
    const {productId} = req.params

    const product = await Products.findByPk(productId)
    if(!product){
      return res.status(404).json({error: "პროდუქტი არ მოიძებნება"})
    }

    res.status(200).json(product)
  } catch(err){
    res.status(500).json({error: err.message})
  }
})






module.exports = router