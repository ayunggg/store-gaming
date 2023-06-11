const mongoose = require("mongoose")

let transactionSchema = mongoose.Schema(
  {
    historyVoucherTopup: {
      gameName: { type: String, require: [true, "Nama Game Harus Di Isi"] },
      category: { type: String, require: [true, "Nama Kategori Harus Di Isi"] },
      thumbnail: { type: String },
      coinName: { type: String, require: [true, "Nama Koin Harus Di Isi"] },
      coinQuantity: {
        type: String,
        require: [true, "Jumlah Coin Harus Di Isi"],
      },
      price: { type: Number },
    },
    historyPayment: {
      name: { type: String, require: [true, "Nama Harus Diisi"] },
      type: { type: String, require: [true, "Tipe Pembayaran Harus Diisi"] },
      bankName: { type: String, require: [true, "Nama Bank Harus Diisi"] },
      noRekening: {
        type: String,
        require: [true, "Nomor Rekening Harus Diisi"],
      },
    },
    name: {
      type: String,
      require: [true, "Nama Harus Diisi"],
      maxLength: [225, "Panjang Nama Harus Antara 3 - 225 Karakter"],
      minLength: [3, "Panjang Nama Harus Antara 3 - 225 Karakter"],
    },
    accountUser: {
      type: String,
      require: [true, "Nama Akun Harus Diisi"],
      maxLength: [225, "Panjang Nama Harus Antara 3 - 225 Karakter"],
      minLength: [3, "Panjang Nama Harus Antara 3 - 225 Karakter"],
    },
    tax: {
      type: Number,
      default: 0,
    },
    value: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },
    historyUser: {
      name: { type: String, require: [true, "Nama User Harus Diisi"] },
      phoneNumber: {
        type: Number,
        require: [true, "Nomor Handphone Harus Diisi"],
        maxLength: [13, "Panjang Nomor Harus Antara 9 - 13 Karakter"],
        minLength: [9, "Panjang Nomor Harus Antara 9 - 13 Karakter"],
      },
    },
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
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

module.exports = mongoose.model("Transaction", transactionSchema)
