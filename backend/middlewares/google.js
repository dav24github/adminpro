var GoogleStrategy = require("passport-google-oauth20").Strategy;
const Usuario = require("../models/usuarios");

var jwt = require("jsonwebtoken");

var SEED = require("../config/config").SEED;

const GOOGLE_CLIENT_ID = require("../config/config").GOOGLE_CLIENT_ID;
const GOOGLE_SECRET = require("../config/config").GOOGLE_SECRET;

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_SECRET,
        callbackURL: "http://localhost:3000/login/google/callback",
      },
      (accessToken, resfreshToken, profile, done) => {
        console.log(accessToken);
        console.log(resfreshToken);
        console.log(profile);
        // Find if a user exists with this email or not
        Usuario.findOne({ email: profile.emails[0].value }).then((usuario) => {
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

              return done(null, {
                usuario: usuario,
                token: token,
                id: usuario._id,
              });
            }
          } else {
            // El usuario no existe
            var usuario = new Usuario({
              nombre: profile.displayName,
              email: profile.emails[0].value,
              password: ":)",
              img: profile.photos[0].value,
              google: true,
            });

            usuario.save(function (err, usuario) {
              var token = jwt.sign({ usuario: usuario }, SEED, {
                expiresIn: 14400,
              });

              return done(null, {
                usuario: usuario,
                token: token,
                id: usuario._id,
              });
            });
          }
        });
      }
    )
  );

  passport.serializeUser(function (data, done) {
    done(null, data);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });
};
