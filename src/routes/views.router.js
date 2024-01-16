const express = require("express");
const router = express.Router();
const ProductManager = require("../service/ProductManager");
const productManager = new ProductManager("./src/models/products.json");

router.get("/", (req, res) => {
    res.render("index");
})

router.get("/realtimeproducts", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.send({ status: "success", product: products });
    } catch (error) {
        res.send({ status: "error", error: error.message });
        console.log(error);
        return;
    }
})

module.exports = router; 