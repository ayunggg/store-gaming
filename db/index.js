const mongoose = require("mongoose")
const { urlDb } = require("../config")

mongoose
  .connect("mongodb://127.0.0.1:27017/db_topup_gimang", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("Koneksi Berhasil"))
  .catch((err) => console.error("Coult Not Connect To Mongo DB", err))

const db = mongoose.createConnection()

module.exports = db
