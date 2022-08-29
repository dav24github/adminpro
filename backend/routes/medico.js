var express = require("express");

var mdAutentication = require("../middlewares/autenticacion");
const medico = require("../models/medico");

var app = express();

var Medico = require("../models/medico");

// ====================================
// Obtener todos los medicos
// ====================================
app.get("/", (req, res, next) => {
  var desde = req.query.desde || 0;
  desde = Number(desde);

  Medico.find({})
    .skip(desde)
    // .limit(4)
    .populate("usuario", "nombre email")
    .populate("hospital")
    .exec((err, medicos) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mesaje: "Error cargando medicos",
        });
      }

      Medico.count({}, (err, conteo) => {
        res.status(200).json({
          ok: true,
          medicos: medicos,
          total: conteo,
        });
      });
    });
});

// ====================================
// Obtener medico
// ====================================
app.get("/:id", (req, res, next) => {
  var id = req.params.id;

  Medico.findById(id)
    .populate("usuario", "nombre email img")
    .populate("hospital")
    .exec((err, medico) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mesaje: "Error burcar medico",
          errors: err,
        });
      }

      if (!medico) {
        return res.status(400).json({
          ok: false,
          mesaje: "El medico con el id " + id + " no existe",
          errors: { message: "No existe un medico con ese ID" },
        });
      }

      res.status(200).json({
        ok: true,
        medico: medico,
      });
    });
});
app.get("/:id", (res, req) => {});

// ====================================
// Crear medico
// ====================================
app.post("/", mdAutentication.verificarToken, (req, res, next) => {
  var body = req.body;

  var medico = new Medico({
    nombre: body.nombre,
    img: body.img,
    usuario: req.usuario._id,
    hospital: body.hospital,
  });

  medico.save((err, medGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al crear medico",
        errors: err,
      });
    }

    res.status(201).json({
      ok: true,
      medico: medGuardado,
      usuarioToken: req.usuario,
    });
  });
});

// ====================================
// Actualizar medico
// ====================================
app.put("/:id", mdAutentication.verificarToken, (req, res, next) => {
  var id = req.params.id;
  var body = req.body;

  Medico.findById(id, (err, medico) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error cargando medico",
        errors: err,
      });
    }

    if (!medico) {
      return res.status(400).json({
        ok: false,
        mesaje: "El medico con el id " + id + " no existe",
        errors: { message: "No existe un medico con ese ID" },
      });
    }

    medico.nombre = body.nombre;
    medico.img = body.img;
    medico.usuario = req.usuario._id;
    medico.hospital = body.hospital;

    medico.save((err, medGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar medico",
          errors: err,
        });
      }

      res.status(201).json({
        ok: true,
        medico: medGuardado,
      });
    });
  });
});

// ====================================
// Borrar medico
// ====================================
app.delete("/:id", mdAutentication.verificarToken, (req, res, next) => {
  var id = req.params.id;

  Medico.findByIdAndRemove(id, (err, medBorrado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al borrar medico",
        errors: err,
      });
    }

    if (!medBorrado) {
      return res.status(500).json({
        ok: false,
        mensaje: "No existe un medico con ese id",
        errors: { message: "ERR, No existe un medico con ese id" },
      });
    }

    res.status(200).json({
      ok: true,
      medico: medBorrado,
    });
  });
});

module.exports = app;
