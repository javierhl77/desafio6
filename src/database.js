const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://javier1977:coderhouse@cluster0.mryvwa7.mongodb.net/E-commerce?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("conexion exitosa"))
  .catch( () => console.log("no hay coneccion a base de datos"))