var express = require("express");
var mongoose = require("mongoose");

var session = require("express-session");

var app = express();

// CORS
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

// Body Parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var appRoutes = require("./routes/app");
var usuarioRoutes = require("./routes/usuarios");
var loginRoutes = require("./routes/login");
var hospitalRoutes = require("./routes/hospital");
var medicoRoutes = require("./routes/medico");
var busquedaRoutes = require("./routes/busqueda");
var uploadRoutes = require("./routes/upload");
var imagenesRoutes = require("./routes/imagenes");

mongoose.connect(
  "mongodb://David_atlas:" +
    process.env.MONGO_ATLAS_PW +
    "@cluster0-shard-00-00.tbj07.mongodb.net:27017,cluster0-shard-00-01.tbj07.mongodb.net:27017,cluster0-shard-00-02.tbj07.mongodb.net:27017/admin-pro?ssl=true&replicaSet=atlas-vxzmm6-shard-0&authSource=admin&retryWrites=true&w=majority",
  (err, res) => {
    if (err) throw err;

    console.log("base de datos: \x1b[32m%s\x1b[0m", "online");
  }
);

//Server index config
var serveIndex = require("serve-index");
app.use(express.static(__dirname + "/")); // permite ver archivos
app.use("/uploads", serveIndex(__dirname + "/uploads"));

app.use("/usuario", usuarioRoutes);
app.use("/login", loginRoutes);
app.use("/hospital", hospitalRoutes);
app.use("/medico", medicoRoutes);
app.use("/busqueda", busquedaRoutes);
app.use("/upload", uploadRoutes);
app.use("/img", imagenesRoutes);

app.use("/", appRoutes);

app.listen(3000, () => {
  console.log("Server 3000 \x1b[32m%s\x1b[0m", "online");
});
