const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    collation: { locale: "en", strength: 2 },
  },
  email: {
    type: String,
    required: true,
    collation: { locale: "en", strength: 2 },
  },
  password: {
    type: String,
    required: true,
    collation: { locale: "en", strength: 2 },
  },
  role: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const UserModel = mongoose.model("UserModel", userSchema);

module.exports = UserModel;
