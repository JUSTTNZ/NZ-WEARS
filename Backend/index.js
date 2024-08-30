require("dotenv").config();
const PORT = process.env.PORT || 4000;
require("express-async-errors");
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const connectToDatabase = require("./database/connect");
const authController = require("./controllers/user.controller");

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
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    })
})

app.post("/auth/signup", authController.signup);


app.post('/addproduct', async (req, res) => {
    let products = await Product.find({});
    let id;
    if (products.length > 0) {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1;
    }
    else {
        id = 1;
    }
    const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    })
    console.log(product);
    await product.save();
    console.log('saved');
    res.json({
        success: true,
        name: req.body.name,
    })
})

//creating API for deleting product

app.post('/removeproduct', async (req, res) => {
    await Product.findOneAndDelete({ id: req.body.id });
    console.log('Removed');
    res.json({
        success: true,
        name: req.body.name
    })
})

// Creating API for getting all products
app.get('/allproducts', async (req, res) => {
    let products = await Product.find({});
    console.log("All product Fetched");
    res.send(products);
})



// creating endpoint for registering the user 
app.post('/signup', async (req, res) => {

    let check = await Users.findOne({ email: req.body.email });
    if (check) {
        return res.status(400).json({ success: false, errors: "existing user found with same email address" })
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
    }

    const user = new Users({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: cart,
    })

    await user.save();

    const data = {
        user: {
            id: user.id
        }
    }

    const token = jwt.sign(data, 'secret_ecom');
    res.json({ success: true, token })
})

// user login 
app.post('/login', async (req, res) => {
    let user = await Users.findOne({ email: req.body.email });
    if (user) {
        const passCompare = req.body.password === user.password;
        if (passCompare) {
            const data = {
                user: {
                    id: user.id
                }
            }
            const token = jwt.sign(data, 'secret_ecom');
            res.json({ success: true, token });
        }
        else {
            res.json({ success: false, errors: "Wrong Password" })
        }
    }
    else {
        res.json({ success: false, errors: "Wrong Email id" })
    }
})



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