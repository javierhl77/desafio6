const express = require("express");
const router = express.Router();

const Usermodel = require("../models/user.model.js")

const { createHash } = require("../utils/hashbcript.js");
const passport = require("passport");


//Post para generar un ususario y almacenarlo en mongodb:

router.post("/", async (req, res) => {
    const {first_name,email, password, age} = req.body;
    try {
        //Verificar si el correo ya esta registrado
        const existeUsuario = await Usermodel.findOne({email:email});
        if(existeUsuario) {
            return res.status(400).send({error: "El email ya esta registrado"});
        }
        //Si no lo encuentra, creamos el nuevo usuario: 
        const nuevoUsuario = await Usermodel.create({
            first_name,
            email,
            password: createHash(password), //ocultar la contraseña
            age
        }); 
        //Almacenamos la info del usuario en la session:
        req.session.login = true; 
        req.session.user = {...nuevoUsuario._doc};
        res.redirect("/profile");
    } catch (error) {
        console.log("Error al crear el usuario:", error);
        res.status(500).send({error: "Error al guardar el usuario nuevo"});
    }
});

//router.post("/", passport.authenticate("register", {failureRedirect: "/failedregister"}), async (req, res) => {
  //  if(!req.user) return res.status(400).send({status:"error"});

    //req.session.user = {
      //  first_name: req.user.first_name,
        //age: req.user.age,
   //     email:req.user.email
    //};

//    req.session.login = true;

  //  res.redirect("/profile");
//})

router.get("/failedregister", (req, res) => {
    res.send({error: "Registro fallido!"});
})


module.exports = router;