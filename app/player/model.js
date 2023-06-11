const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const HASH_ROUND = 10

let playerSchema = mongoose.Schema(
  {
    email: {
      type: String,
      require: [true, "Email Tidak Boleh Kosong"],
      validate: {
        validator: async function (email) {
          const player = await this.constructor.findOne({ email })
          return !player
        },
        message: "Email already exists",
      },
    },
    name: {
      type: String,
      require: [true, "Nama Tidak Boleh Kosong"],
      maxLength: [225, "Panjang Nama Harus Antara 3 - 225 Karakter"],
      minLength: [3, "Panjang Nama Harus Antara 3 - 225 Karakter"],
    },
    password: {
      type: String,
      require: [true, "Password Tidak Boleh Kosong"],
      maxLength: [225, "Panjang Nama Harus Antara 3 - 225 Karakter"],
    },
    phoneNumber: {
      type: String,
      require: [true, "Nomor Handphone Tidak Boleh Kosong"],
      maxLength: [13, "Panjang Nomor Harus Antara 9 - 13 Karakter"],
      minLength: [9, "Panjang Nomor Harus Antara 9 - 13 Karakter"],
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["Y", "N"],
      default: "Y",
    },
    avatar: {
      type: String,
    },
    fileName: {
      type: String,
    },
    favorite: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  {
    timestamp: true,
  }
)

playerSchema.pre("save", function (next) {
  const player = this

  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(10, function (saltError, salt) {
      if (saltError) {
        return next(saltError)
      } else {
        bcrypt.hash(player.password, salt, function (hashError, hash) {
          if (hashError) {
            return next(hashError)
          }

          player.password = hash
          next()
        })
      }
    })
  } else {
    return next()
  }
}),
  (module.exports = mongoose.model("Player", playerSchema))
