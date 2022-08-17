var express = require("express");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

var SEED = require("../config/config").SEED;

var app = express();

var Usuario = require("../models/usuarios");

var passport = require("passport");

require("../middlewares/google")(passport);

// ====================================
// Autenticación de Google
// ====================================
app.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    return res.json({
      user: req.user,
    });
  }
);

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
      token: token,
      id: usuarioDB._id,
    });
  });
});

module.exports = app;
