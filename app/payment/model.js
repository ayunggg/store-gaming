const mongoose = require("mongoose")

let paymentSchema = mongoose.Schema(
  {
    type: {
      type: String,
      require: [true, "Nama Koin Tidak Boleh Kosong"],
    },
    banks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bank",
      },
    ],
    status: {
      type: String,
      enum: ["Y", "N"],
      default: "Y",
    },
  },
  {
    timestamp: true,
  }
)

module.exports = mongoose.model("Payment", paymentSchema)
