const mongoose = require("mongoose")

let categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Nama Kategori Tidak Boleh Kosong"],
      unique: [true, "Nama Kategori Telah Tersedia"],
    },
  },
  {
    timestamp: true,
  }
)

module.exports = mongoose.model("Category", categorySchema)
