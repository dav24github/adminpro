var mongoose = require("mongoose");
// const { ModifierFlags } = require("typescript");

var Schema = mongoose.Schema;

var rolesValidos = {
  values: ["ADMIN_ROLE", "USER_ROLE"],
  message: "{VALUE} no es un rol permitido",
};

var usuarioSchema = new Schema({
  nombre: { type: String, required: [true, "El nombre es necesario"] },
  email: {
    type: String,
    required: [true, "El correo es necesario"],
    unique: true,
  },
  password: { type: String, required: [true, "La contraseña es necesaria"] },
  img: { type: String, required: false },
  role: {
    type: String,
    required: true,
    default: "USER_ROLE",
    enum: rolesValidos,
  },
  google: { type: Boolean, required: true, default: false },
});

module.exports = mongoose.model("Usuario", usuarioSchema);
