const jwt = require("jsonwebtoken")
require("dotenv").config()

async function verifyAdmin(req, res, next){
  try{
    const {adminToken} = req.cookies

    const decoded = jwt.verify(adminToken, process.env.JWT_SECRET)
    if(!decoded.admin){
      return res.status(403).json({message: "არხართ რეგისტრირებული"})
    }

    next()

  } catch(err){
    res.status(500).json({error: err.message})
  }
}

module.exports = verifyAdmin