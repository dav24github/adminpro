var express = require("express");
var bcrypt = require("bcryptjs");

var mdAutentication = require("../middlewares/autenticacion");

var app = express();

var Usuario = require("../models/usuarios");

// ====================================
// Obtener todos los usuarios
// ====================================
app.get("/", (req, res, next) => {
  var desde = req.query.desde || 0;
  desde = Number(desde);

  Usuario.find({}, "nombre email img role google")
    .skip(desde)
    .limit(4)
    .exec((err, usuarios) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error cargando usuario",
          errors: err,
        });
      }

      Usuario.count({}, (err, conteo) => {
        res.status(200).json({
          ok: true,
          usuarios: usuarios,
          total: conteo,
        });
      });
    });
});

// ====================================
// Actualizar usuario
// ====================================
app.put(
  "/:id",
  [
    mdAutentication.verificarToken,
    mdAutentication.verificarADMIN__MismoUsuario,
  ],
  (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error cargando usuario",
          errors: err,
        });
      }

      if (!usuario) {
        return res.status(400).json({
          ok: false,
          mesaje: "El usuario con el id " + id + " no existe",
          errors: { message: "No existe un usuario con ese ID" },
        });
      }

      usuario.nombre = body.nombre;
      usuario.email = body.email;
      usuario.role = body.role;

      usuario.save((err, usuGuardado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            mensaje: "Error al actualizar usuario",
            errors: err,
          });
        }

        // We do not return pass
        usuGuardado.password = ";)";

        res.status(201).json({
          ok: true,
          usuario: usuGuardado,
        });
      });
    });
  }
);

// ====================================
// Crear un nuevo usuario
// ====================================
app.post("/", (req, res) => {
  var body = req.body;

  var usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    img: body.img,
    role: body.role,
  });

  usuario.save((err, usuGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al crear usuario",
        errors: err,
      });
    }

    res.status(201).json({
      ok: true,
      usuario: usuGuardado,
      usuarioToken: req.usuario,
    });
  });
});

// ====================================
// Borrar usuario
// ====================================
app.delete(
  "/:id",
  [
    mdAutentication.verificarToken,
    mdAutentication.verificarADMIN__MismoUsuario,
  ],
  (req, res) => {
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuBorrado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al borrar usuario",
          errors: err,
        });
      }

      if (!usuBorrado) {
        return res.status(500).json({
          ok: false,
          mensaje: "No existe un usuario con ese id",
          errors: { message: "ERR, No existe un usuario con ese id" },
        });
      }

      res.status(200).json({
        ok: true,
        usuario: usuBorrado,
      });
    });
  }
);

module.exports = app;
