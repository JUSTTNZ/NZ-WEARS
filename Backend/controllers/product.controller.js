const Product = require("../models/product.model");

class ProductController {
    async addProduct(req, res) {
        const { name, image, category, new_price, old_price } = req.body;

        const products = await Product.find({})
        let len = products.length;

        const lastProduct = products[len - 1];
        let { id } = lastProduct

        const newProductId = id + 1;

        let newProduct = null;

        //ensures all field are provided.
        if (
            name
            &&
            image
            &&
            category
            &&
            new_price
            &&
            old_price
        ) {
            newProduct = new Product({
                id: newProductId,
                name,
                image,
                category,
                new_price,
                old_price,
            })
        } else {
            throw new Error(`"name", "image", "category", "new_price", "old_price" fields are required.`)
        }

        const savedProduct = await newProduct.save();

        res.status(200).json({ success: true, product: savedProduct });
    }

    async deleteProduct(req, res) {
        const { productId } = req.params;

        if (typeof parseInt(productId, 10) !== "number") throw new Error("provide a valid product_id");

        await Product.findOneAndDelete({ id: productId });

        res.status(200).json({ success: true, msg: "product successfully deleted." });
    }

    async getAllProducts(req, res) {
        const products = await Product.find({});
        res.status(200).json({
            success: true,
            products
        })
    }
}

module.exports = new ProductController();
