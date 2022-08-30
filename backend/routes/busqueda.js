var express = require("express");

var app = express();

var Hospital = require("../models/hospital");
var Medico = require("../models/medico");
var Usuario = require("../models/usuarios");

// ====================================
// Búsqueda por collection
// ====================================
app.get("/coleccion/:tabla/:busqueda", (req, res, next) => {
  var busqueda = req.params.busqueda;
  var tabla = req.params.tabla;
  var regex = new RegExp(busqueda, "i");

  var promesa;

  switch (tabla) {
    case "usuarios":
      promesa = buscarUsuario(regex);
      break;

    case "medicos":
      promesa = buscarMedicos(regex);
      break;

    case "hospitales":
      promesa = buscarHospitales(regex);
      break;

    default:
      return res.status(400).json({
        ok: false,
        mensaje: "Los tipos de búsqueda...",
        error: { message: "Tipo de tabla/collección no válido" },
      });
  }

  promesa.then((data) => {
    res.status(200).json({
      ok: true,
      [tabla]: data,
    });
  });
});

// ====================================
// Búsqueda general
// ====================================
app.get("/todo/:busqueda", (req, res, next) => {
  var busqueda = req.params.busqueda;
  var regex = new RegExp(busqueda, "i");

  Promise.all([
    buscarHospitales(regex),
    buscarMedicos(regex),
    buscarUsuario(regex),
  ]).then((repuestas) => {
    res.status(200).json({
      ok: true,
      hospitales: repuestas[0],
      medicos: repuestas[1],
      usuarios: repuestas[2],
    });
  });
});

function buscarHospitales(regex) {
  return new Promise((resolve, reject) => {
    Hospital.find({ nombre: regex })
      .populate("usuario", "nombre email img")
      .exec((err, hospitales) => {
        if (err) {
          reject("Error al caragar hospitales", err);
        } else {
          resolve(hospitales);
        }
      });
  });
}

function buscarMedicos(regex) {
  return new Promise((resolve, reject) => {
    Medico.find({ nombre: regex })
      .populate("usuario", "nombre email img")
      .populate("hospital")
      .exec((err, medicos) => {
        if (err) {
          reject("Error al caragar medicos", err);
        } else {
          resolve(medicos);
        }
      });
  });
}

function buscarUsuario(regex) {
  return new Promise((resolve, reject) => {
    Usuario.find({}, "nombre email role img")
      .or([{ nombre: regex }, { email: regex }])
      .exec((err, usuarios) => {
        if (err) {
          reject("Error al caragar usuarios", err);
        } else {
          resolve(usuarios);
        }
      });
  });
}

module.exports = app;
