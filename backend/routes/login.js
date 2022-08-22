var express = require("express");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

var SEED = require("../config/config").SEED;

var app = express();

var Usuario = require("../models/usuarios");

// ====================================
// Autenticación de Google
// ====================================
app.post("/google", (req, res) => {
  var usuarioGoogle = req.body;

  Usuario.findOne({ email: usuarioGoogle.email }).then((usuario) => {
    if (usuario) {
      if (usuario.google === false) {
        return done(null, {
          mensaje: "Debe de usar su autenicación normal",
        });
      } else {
        // Esta autenticado con google
        usuario.password = ":)"; // we do not send the pass

        var token = jwt.sign({ usuario: usuario }, SEED, {
          expiresIn: 14400,
        });

        return res.status(200).json({
          usuario: usuario,
          token: token,
          id: usuario._id,
        });
      }
    } else {
      // El usuario no existe
      var usuario = new Usuario({
        nombre: usuarioGoogle.nombre,
        email: usuarioGoogle.email,
        password: ":)",
        img: usuarioGoogle.img,
        google: true,
      });

      usuario.save(function (err, usuario) {
        var token = jwt.sign({ usuario: usuario }, SEED, {
          expiresIn: 14400,
        });

        return res.status(200).json({
          usuario: usuario,
          token: token,
          id: usuario._id,
        });
      });
    }
  });
});

// =========================================
// Autenticaticación normal
// =========================================
app.post("/", (req, res) => {
  var body = req.body;

  Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar usuario",
        errors: err,
      });
    }

    if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        mensaje: "credenciales incorrectas - email",
        errors: err,
      });
    }

    if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
      return res.status(400).json({
        ok: false,
        mensaje: "credenciales incorrectas - pass",
        errors: err,
      });
    }

    // Crear un token
    usuarioDB.password = ":)"; // we do not send the pass

    var token = jwt.sign({ usuario: usuarioDB }, SEED, {
      expiresIn: 14400,
    });

    res.status(200).json({
      ok: true,
      mensaje: "Login post correcto",
      usuario: usuarioDB,
      token: token,
      id: usuarioDB._id,
    });
  });
});

module.exports = app;
