var express = require("express");

var mdAutentication = require("../middlewares/autenticacion");
const Hospital = require("../models/hospital");

var app = express();

// ====================================
// Obtener todos los hospitales
// ====================================
app.get("/", (req, res, next) => {
  var desde = req.query.desde || 0;
  desde = Number(desde);

  Hospital.find({})
    .skip(desde)
    .limit(4)
    .populate("usuario", "nombre email")
    .exec((err, hospitales) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mesaje: "Error cargando hopitales",
        });
      }

      Hospital.count({}, (err, conteo) => {
        res.status(200).json({
          ok: true,
          hospitales: hospitales,
          total: conteo,
        });
      });
    });
});

// ====================================
// Obtener hospital por ID
// ====================================
app.get("/:id", (req, res) => {
  var id = req.params.id;

  Hospital.findById(id)
    .populate("usuario", "nombre img email")
    .exec((err, hospital) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al buscar hospital",
          errors: err,
        });
      }

      if (!hospital) {
        return res.status(500).json({
          ok: false,
          mensaje: "El hospital con el id " + id + "no existe",
          errors: { message: "No existe un hospital con ese ID" },
        });
      }

      res.status(200).json({
        ok: true,
        hospital: hospital,
      });
    });
});

// ====================================
// Crear hospital
// ====================================
app.post("/", mdAutentication.verificarToken, (req, res, next) => {
  var body = req.body;

  var hospital = new Hospital({
    nombre: body.nombre,
    img: body.img,
    usuario: req.usuario._id,
  });

  hospital.save((err, hosGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al crear usuario",
        errors: err,
      });
    }

    res.status(201).json({
      ok: true,
      hospital: hosGuardado,
      usuarioToken: req.usuario,
    });
  });
});

// ====================================
// Actualizar hospitales
// ====================================
app.put("/:id", mdAutentication.verificarToken, (req, res, next) => {
  var id = req.params.id;
  var body = req.body;

  Hospital.findById(id, (err, hospital) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error cargando hospital",
        errors: err,
      });
    }

    if (!hospital) {
      return res.status(400).json({
        ok: false,
        mesaje: "El hospital con el id " + id + " no existe",
        errors: { message: "No existe un hospital con ese ID" },
      });
    }

    hospital.nombre = body.nombre;
    hospital.img = body.img;
    hospital.usuario = req.usuario._id;

    hospital.save((err, hosGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar hospital",
          errors: err,
        });
      }

      res.status(201).json({
        ok: true,
        hospital: hosGuardado,
      });
    });
  });
});

// ====================================
// Borrar hospital
// ====================================
app.delete("/:id", mdAutentication.verificarToken, (req, res, next) => {
  var id = req.params.id;

  Hospital.findByIdAndRemove(id, (err, hosBorrado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al borrar hospital",
        errors: err,
      });
    }

    if (!hosBorrado) {
      return res.status(500).json({
        ok: false,
        mensaje: "No existe un hospital con ese id",
        errors: { message: "ERR, No existe un hospital con ese id" },
      });
    }

    res.status(200).json({
      ok: true,
      hospital: hosBorrado,
    });
  });
});

module.exports = app;
