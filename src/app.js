

const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const app = express();


//const cookieParser = require("cookie-parser");
//const FileStore = require ("session-file-store");
//const fileStore = FileStore(session);  //inicializar filestore


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




//rutas
app.get("/",(req,res) => {
    res.send("funcionado el servidor")
});









app.listen(PUERTO, () => {
    console.log(`escuchando e el puerto: ${PUERTO}`)
});