const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const app = express()
const PORT = process.env.PORT || 3001

app.use(cookieParser())


app.use(cors({
  origin: ["http://localhost:5173", "https://zvio-shop-client.vercel.app"],
  credentials: true
}))
app.use(express.json())



const adminRoutes = require("./routes/Admin")
app.use("/admin", adminRoutes)
const productRoutes = require("./routes/Products")
app.use("/products", productRoutes)






const db = require("./models")
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`server running on port:${PORT}`)
  })
})
