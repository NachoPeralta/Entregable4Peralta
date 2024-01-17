const express = require("express");
const router = express.Router();
const ProductManager = require("../service/ProductManager");
const productManager = new ProductManager("./src/models/products.json");

router.get("/", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        const title = "Listado de Productos"
        res.render("index", { products, title });
    } catch (error) {
        res.send({ status: "error", error: error.message });
        console.log(error);
        return;
    }

})

router.get("/realtimeproducts", async (req, res) => {
    try {
        res.render("realTimeProducts");
    } catch (error) {
        res.send({ status: "error", error: error.message });
        console.log(error);
        return;
    }
})

module.exports = router; 