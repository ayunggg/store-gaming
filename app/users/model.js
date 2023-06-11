const mongoose = require("mongoose")

let userSchema = mongoose.Schema({
  email: {
    type: String,
    require: [true, "Email Tidak Boleh Kosong"],
  },
  name: {
    type: String,
    require: [true, "Nama Tidak Boleh Kosong"],
  },
  password: {
    type: String,
    require: [true, "Password Tidak Boleh Kosong"],
  },
  phoneNumber: {
    type: String,
    require: [true, "Nomor Handphone Tidak Boleh Kosong"],
  },

  role: {
    type: String,
    enum: ["admin", "user"],
    default: "admin",
  },
  status: {
    type: String,
    enum: ["Y", "N"],
    default: "Y",
  },
}, {
    timestamp: true,
})

module.exports = mongoose.model("User", userSchema)
