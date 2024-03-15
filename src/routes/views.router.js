
const express = require("express");
const router = express.Router();

const ProductManager = require("../controllers/product-manager-db");
const productManager = new ProductManager();

// Ruta para el formulario de login
router.get("/login", (req, res) => {
    if (req.session.login) {
        return res.redirect("bienvenido");
    }
    res.render("login");
});

// Ruta para el formulario de registro
router.get("/register", (req, res) => {
    if (req.session.login) {
        return res.redirect("/bienvenido");
    }
    res.render("register");
});

// Ruta para la vista de perfil
router.get("/bienvenido", async (req, res) => {

    if (!req.session.login) {
        return res.redirect("/login");
    }
    
    const { page = 1, limit = 2 } = req.query;
        
    const productos = await productManager.getProducts({
       page: parseInt(page),
       limit: parseInt(limit)
    });

    const nuevoArray = productos.docs.map(producto => {
        const { _id, ...rest } = producto.toObject();
        return rest;
     });

    //console.log(nuevoArray);



    

    res.render(
        "bienvenido", 
         {  
            user: req.session.user,
            productos: nuevoArray,
            hasPrevPage: productos.hasPrevPage,
            hasNextPage: productos.hasNextPage,
            prevPage: productos.prevPage,
            nextPage: productos.nextPage,
            currentPage: productos.page,
            totalPages: productos.totalPages
        }
        
        );
});

module.exports = router;