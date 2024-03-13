

const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const FileStore = require ("session-file-store");
const exphbs = require("express-handlebars");
//const fileStore = FileStore(session);  //inicializar filestore
const app = express();

const PUERTO = 8080;

const MongoStore = require("connect-mongo");
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");
const userRouter = require("./routes/user.router.js");
const sessionRouter = require("./routes/session.router.js");
const viewsRouter = require("./routes/views.router.js");
require("./database.js")



//middleware para session

app.use(session({

  secret: "secretCoder",
  resave: true,
  saveUninitialized: true,

  //file storage:
 //store: new fileStore({path:"./src/sessions", ttl:100,retries: 1})

 //utilizando Mongo Store
 store: MongoStore.create({
    mongoUrl: "mongodb+srv://javier1977:coderhouse@cluster0.mryvwa7.mongodb.net/E-commerce?retryWrites=true&w=majority&appName=Cluster0"
 })

}))

app.use(express.json());
app.use(express.urlencoded({extended:true}));

//configurar handlebars:
//Express-Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//middleware de autenticacion:

function auth(req, res ,next){
    if(req.session.user === "lionel" && req.session.admin == true){
        return next();
    }
    return res.status(401).send("error de autorizacion")
}

////////////////////////////////////////////////////////
//Cambios passport: 
initializePassport();
app.use(passport.initialize());
app.use(passport.session());
///////////////////////////////////////////////////////////

//middleware para session.router y user.router:
app.use("/api/users", userRouter)
app.use("/api/session", sessionRouter);
app.use("/", viewsRouter);


//app.use(cookieParser());
//firmar cookies

const miclaveSecreta = "clavesecreta";
app.use(cookieParser(miclaveSecreta));

//rutas
app.get("/",(req,res) => {
    res.send("funcionado el servidor")
});

app.get("/setcookie", (req,res) => {
    res.cookie("coderCookie", "para siempre",{maxAge:30000}).send("cookie seteada");
})
app.get("/leerCookie", (req,res) => {
    res.send(req.cookies);
})

app.get("/borrarcookie",(req,res) => {
    res.clearCookie("coderCookie").send("Cookie eliminada")
})
app.get("/cookiefirmada",(req,res) => {
    res.cookie("cookieFirmada", "mensaje secreto", {signed:true}).send("cookie firmada nviada!")

});

app.get("/cookiefirm",(req,res)=>{
    const valorCookie = req.signedCookies.cookieFirmada;

    if(valorCookie){
        res.send("cookie reuperada:" + valorCookie);
    } else {
        res.send("cookie invalida");
    }
})








app.listen(PUERTO, () => {
    console.log(`escuchando e el puerto: ${PUERTO}`)
});