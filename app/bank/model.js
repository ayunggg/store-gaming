const mongoose = require("mongoose")

let bankSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Nama Pemilik Bank Tidak Boleh Kosong"],
    },
    bankName: {
      type: String,
      require: [true, "Nama  Bank Tidak Boleh Kosong"],
    },
    noRekening: {
      type: String,
      require: [true, "Nomor Rekening Bank Tidak Boleh Kosong"],
    },
  },
  {
    timestamp: true,
  }
)

module.exports = mongoose.model("Bank", bankSchema)
