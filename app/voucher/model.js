const mongoose = require("mongoose")

let voucherSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Nama Game Harus Diisi"],
    },
    status: {
      type: String,
      enum: ["Y", "N"],
      default: "Y",
    },
    isFeatured: {
      type: Boolean,
      enum: [true, false],
      default: true,
    },
    thumbnail: {
      type: String,
    },
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    nominals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Nominal",
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamp: true,
  }
)

module.exports = mongoose.model("Voucher", voucherSchema)
