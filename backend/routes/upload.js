var express = require("express");

var fileUpload = require("express-fileupload"); // req.files
var fs = require("fs");

var app = express();

var Usuario = require("../models/usuarios");
var Medico = require("../models/medico");
var Hospital = require("../models/hospital");

app.use(fileUpload());

app.put("/:tipo/:id", (req, res, next) => {
  var tipo = req.params.tipo;
  var id = req.params.id;

  // Tipos de colección
  var tiposValidos = ["hospitales", "medicos", "usuarios"];
  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      mesaje: "Tipo de colección no valida",
      errors: {
        message: "Tipo de colección no valida ",
      },
    });
  }

  if (!req.files) {
    return res.status(400).json({
      ok: false,
      mesaje: "No seleccionó nada",
      errors: { message: "Debe de seleccionar una imagen" },
    });
  }

  // Obtener nombre del archivo
  var archivo = req.files.imagen;
  var nombreCortado = archivo.name.split(".");
  var extensionArchivo = nombreCortado[nombreCortado.length - 1];

  // Solo estas extensiones aceptamos
  var extensionesValidas = ["png", "jpg", "gif", "jpeg"];
  if (extensionesValidas.indexOf(extensionArchivo) < 0) {
    return res.status(400).json({
      ok: false,
      mesaje: "Extension no válida",
      errors: {
        message: "Las extensiones válidas son " + extensionesValidas.join(" "),
      },
    });
  }

  //Nombre de archivos personalizado
  var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

  //Mover el archivo del temporal a un path
  var path = `./uploads/${tipo}/${nombreArchivo}`;

  archivo.mv(path, (err) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mesaje: "Error al mover",
        errors: err,
      });
    }

    // Asignar img a tipo
    subirTipo(tipo, id, nombreArchivo, res);
  });
});

function subirTipo(tipo, id, nombreArchivo, res) {
  if (tipo === "usuarios") {
    Usuario.findById(id, (err, usuario) => {
      if (!usuario) {
        return res.status(500).json({
          ok: false,
          mesaje: "id no existe",
          errors: err,
        });
      }

      var pathViejo = "./uploads/usuarios/" + usuario.img;

      // Elimina la img anterior
      if (fs.existsSync(pathViejo)) {
        fs.unlink(pathViejo, (err) => {
          if (err) {
            return res.status(500).json({
              ok: false,
              mesaje: "Error al borrar img vieja",
              errors: err,
            });
          }
        });
      }

      usuario.img = nombreArchivo;

      usuario.save((err, usuActualizado) => {
        usuActualizado.password = ":)";

        return res.status(200).json({
          ok: true,
          mensaje: "Img de usuario actualizada",
          usuario: usuActualizado,
        });
      });
    });
  }

  if (tipo === "medicos") {
    Medico.findById(id, (err, medico) => {
      if (!medico) {
        return res.status(500).json({
          ok: false,
          mesaje: "id no existe",
          errors: err,
        });
      }

      var pathViejo = "./uploads/medicos/" + medico.img;

      // Elimina la img anterior
      if (fs.existsSync(pathViejo)) {
        fs.unlink(pathViejo, (err) => {
          if (err) {
            return res.status(500).json({
              ok: false,
              mesaje: "Error al borrar img vieja",
              errors: err,
            });
          }
        });
      }

      medico.img = nombreArchivo;

      medico.save((err, medActualizado) => {
        return res.status(200).json({
          ok: true,
          mensaje: "Img de medico actualizada",
          medico: medActualizado,
        });
      });
    });
  }

  if (tipo === "hospitales") {
    Hospital.findById(id, (err, hospital) => {
      if (!hospital) {
        return res.status(500).json({
          ok: false,
          mesaje: "id no existe",
          errors: err,
        });
      }
      var pathViejo = "./uploads/hospitales/" + hospital.img;

      // Elimina la img anterior
      if (fs.existsSync(pathViejo)) {
        fs.unlink(pathViejo, (err) => {
          if (err) {
            return res.status(500).json({
              ok: false,
              mesaje: "Error al borrar img vieja",
              errors: err,
            });
          }
        });
      }

      hospital.img = nombreArchivo;

      hospital.save((err, hosActualizado) => {
        return res.status(200).json({
          ok: true,
          mensaje: "Img de hospital actualizada",
          hospital: hosActualizado,
        });
      });
    });
  }
}

module.exports = app;
