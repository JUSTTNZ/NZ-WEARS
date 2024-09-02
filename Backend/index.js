require("dotenv").config();
const PORT = process.env.PORT || 4000;
//this package helps catch async errors thrown in request handlers.
require("express-async-errors");
const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const connectToDatabase = require("./database/connect");
const authController = require("./controllers/user.controller");
const productController = require("./controllers/product.controller");
const errorHandler = require("./middlewares/errorHandler");
const notFound = require("./middlewares/notFound");

app.use(express.json());
app.use(cors());


//API Creation

app.get('/', (req, res) => {
    res.send('Express App is running')
})

// Image Storage Engine

const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({ storage })

//Creating Upload Endpoint for image
app.use('/images', express.static('upload/images'))

app.post('/upload', upload.single('product'), (req, res) => {
    res.status(200).json({
        success: true,
        image_url: `http://localhost:${PORT}/images/${req.file.filename}`
    })
})

//authentication endpoints
app.post("/auth/register", authController.register);
app.post("/auth/login", authController.login);

//add product
app.post("/products", productController.addProduct);

//delete product
app.delete("/products/:productId", productController.deleteProduct);

//get all products
app.get("/products", productController.getAllProducts)


//notFound middleware
app.use(notFound);
//errorHandler middleware
app.use(errorHandler);

const startServer = async () => {
    try {
        await connectToDatabase(process.env.MONGO_CONNECTION_STRING);
        console.log("CONNECTED TO DATABASE SUCCESSFULLY")
        app.listen(PORT, () => {
            console.log(`server running on port: ${PORT}.Press Ctrl+C to terminate.`)
        })
    } catch (error) {
        console.error("Error: ", error);
        process.exit(1);
    }
}

startServer();