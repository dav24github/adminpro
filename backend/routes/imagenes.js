const { expressionType } = require("@angular/compiler/src/output/output_ast");
var express = require("express");

var fs = require("fs");

var app = express();

app.get("/:tipo/:img", (req, res, next) => {
  var tipo = req.params.tipo;
  var img = req.params.img;

  var path = `./uploads/${tipo}/${img}`;

  if (!fs.existsSync(path)) {
    path = "./assets/logo_david_sinFondo.png";
  }

  var options = {
    root: "./",
  };
  res.sendFile(path, options, function (err) {
    if (err) {
      return res.status(200).json({
        ok: true,
        mensaje: "Error al enviar archivo",
        err: err,
      });
    }
  });
});

module.exports = app;
