const express = require("express");
const router = express.Router();
const CartManager = require("../service/CartManager");
const cartManager = new CartManager("./src/models/carts.json");
const ProductManager = require("../service/ProductManager");
const productManager = new ProductManager("./src/models/products.json");


// http://localhost:8080/api/carts
// Devuelve todos los carritos
router.get("/", async (req, res) => {

    try {
        const carts = await cartManager.getCarts();
        res.send({ status: "success", cart: carts });
    } catch (error) {
        res.send({ status: "error", error: "No se pudieron cargar los carritos" });
    }
})

// http://localhost:8080/api/carts/cid
// Devuelve un carrito por dado su ID
router.get("/:cid", async (req, res) => {
    const cart = await cartManager.getCartById(req.params.cid);

    if (cart) {
        res.send({ status: "Success", cart: cart });
    } else {
        res.send({ status: "Error", error: "Carrito no encontrado" });
    }
})

// http://localhost:8080/api/carts/
// Crea un carrito y lo devuelve
router.post("/", async (req, res) => {
    try {
        const cart = await cartManager.createCart();
        res.send({ status: "Success", cart: cart });
    } catch (error) {
        res.send({ status: "Error", error: "No se pudo crear el carrito" });
        console.log(error);
        return;
    }
})

// http://localhost:8080/api/carts/cid/products/pid
// Agrega un producto al carrito dado su ID de carrito y ID de producto.
router.post("/:cid/products/:pid", async (req, res) => {
    try {
        let cart = await cartManager.getCartById(req.params.cid);
        if (!cart) {
            res.send({ status: "Error", error: "Carrito no encontrado" });
            return;
        }

        const product = await productManager.getProductById(req.params.pid);
        if (!product) {
            res.send({ status: "Error", error: "Producto no encontrado" });
            return;
        }
        
        const {quantity} = req.body;
        cart = await cartManager.addProductToCart(cart, product, quantity);
        res.send({ status: "Success", cart: cart });

    } catch (error) {
        res.send({ status: "Error", error: "No se pudo agregar el producto al carrito" });
        console.log(error);
        return;
    }

});


module.exports = router;