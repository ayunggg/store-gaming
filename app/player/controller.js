const Player = require("./model")
const Voucher = require("../voucher/model")
const Category = require("../category/model")
const Bank = require("../bank/model")
const Payment = require("../payment/model")
const Nominal = require("../nominal/model")
const Transaction = require("../transaction/model")

const path = require("path")
const fs = require("fs")
const config = require("../../config")

module.exports = {
  landingPage: async (req, res) => {
    try {
      const voucher = await Voucher.find()
        .select("_id name status category thumbnail")
        .populate("category")

      voucher
        ? res.status(200).json({ datas: voucher })
        : res.status(404).json({ message: "Data Tidak Ditemukan" })
    } catch (err) {
      res.status(500).json({
        message: err.message || "Terjadi Kesalah Pada Server",
      })
    }
  },
  detailPage: async (req, res) => {
    try {
      const voucher = await Voucher.findOne()
        .populate("category")
        .populate("nominals")
        .populate("user", "_id name phoneNumber")

      voucher
        ? res.status(200).json({ datas: voucher })
        : res.status(404).json({ message: "Data Tidak Ditemukan" })
    } catch (err) {
      res.status(500).json({
        message: err.message || "Terjadi Kesalah Pada Server",
      })
    }
  },
  category: async (req, res) => {
    try {
      const category = await Category.find()
      category
        ? res.status(200).json({ datas: category })
        : res.status(404).json({ message: "Data Tidak Ditemukan" })
    } catch (err) {
      res.status(500).json({
        message: err.message || "Terjadi Kesalah Pada Server",
      })
    }
  },

  checkout: async (req, res) => {
    try {
      const { accountUser, name, nominal, voucher, payment, bank } = req.body

      const resVoucher = await Voucher.findOne({
        _id: voucher,
      })
        .select("name category _id thumbnail user")
        .populate("category")
        .populate("user")

      if (!resVoucher)
        return res.status(404).json({ message: "Voucher Tidak Di Temukan" })

      const resNominal = await Nominal.findOne({ _id: nominal })

      if (!resNominal)
        return res.status(404).json({ message: "Nominal Tidak Di Temukan" })

      const resPayment = await Payment.findOne({ _id: payment })

      if (!resPayment)
        return res.status(404).json({ message: "Payment Tidak Di Temukan" })

      const resBank = await Bank.findOne({ _id: bank })

      if (!resBank)
        return res.status(404).json({ message: "Payment Tidak Di Temukan" })

      let tax = (10 / 100) * resNominal._doc.price
      let value = resNominal._doc.price - tax
      const payload = {
        historyVoucherTopup: {
          gameName: resVoucher._doc.name,
          category: resVoucher._doc.category.name,
          thumbnail: resVoucher._doc.category.thumbnail,
          coinName: resNominal._doc.coinName,
          coinQuantity: resNominal._doc.coinQuantity,
          price: resNominal._doc.price,
        },
        historyPayment: {
          name: resBank._doc.name,
          type: resPayment._doc.type,
          bankName: resBank._doc.bankName,
          noRekening: resBank._doc.noRekening,
        },
        name: name,
        accountUser: accountUser,
        tax: tax,
        value: value,
        player: req.player._id,
        voucherTopup: resVoucher._doc._id,
        historyUser: {
          name: resVoucher._doc.user.name,
          phoneNumber: resVoucher._doc.user.phoneNumber,
        },
        category: resVoucher._doc.category.map((cat) => cat._id),
        user: resVoucher._doc.user._id,
      }

      const transaction = new Transaction(payload)
      await transaction.save()

      res.status(201).json({
        datas: payload,
      })
    } catch (err) {
      res.status(500).json({
        message: err.message || "Terjadi Kesalah Pada Server",
      })
    }
  },

  history: async (req, res) => {
    try {
      const { status = "" } = req.query
      let criteria = {}

      if (status.length) {
        criteria = {
          ...criteria,
          status: { $regex: `${status}`, $options: "i" },
        }
      }

      if (req.player._id) {
        criteria = {
          ...criteria,
          player: req.player._id,
        }
      }

      const history = await Transaction.find(criteria)

      let total = Transaction.aggregate([
        { $match: criteria },
        {
          $group: {
            _id: null,
            value: { $sum: "$value" },
          },
        },
      ])

      res.status(200).json({
        history: history.length ? history : "Tidak Ada Transaksi",
        total: total.length ? total[0].value : 0,
      })
    } catch (err) {
      res.status(500).json({
        message: err.message || "Terjadi Kesalah Pada Server",
      })
    }
  },

  historyDetail: async (req, res) => {
    try {
      const { id } = req.params

      const detail = await Transaction.findOne({
        _id: id,
      })

      if (!detail)
        return res.status(404).json({
          message: "Data History Tidak Di Temukan.",
        })

      res.status(200).json({
        datas: detail,
      })
    } catch (err) {
      res.status(500).json({
        message: err.message || "Terjadi Kesalah Pada Server",
      })
    }
  },

  dashboard: async (req, res) => {
    try {
      const count = await Transaction.aggregate([
        { $match: { player: req.player._id } },
        {
          $group: {
            _id: "$category",
            value: { $sum: "$value" },
          },
        },
      ])

      const category = await Category.find()

      category.forEach((category) => {
        count.forEach((count) => {
          if (count._id.toString() === category._id.toString()) {
            count.name = category.name
          }
        })
      })

      res.status(200).json({
        datas: count,
      })
    } catch (err) {
      res.status(500).json({
        message: err.message || "Terjadi Kesalah Pada Server",
      })
    }
  },

  profile: async (req, res) => {
    try {
      const player = {
        id: req.player._id,
        username: req.player.username,
        email: req.player.email,
        name: req.player.name,
        avatar: req.player.avatar,
        phoneNumber: req.player.phoneNumber,
      }

      res.status(200).json({
        datas: player,
      })
    } catch (err) {
      res.status(500).json({
        message: err.message || "Terjadi Kesalah Pada Server",
      })
    }
  },

  editProfile: async (req, res, next) => {
    try {
      const { name = "", phoneNumber = "" } = req.body

      const payload = {}

      if (name.length) payload.name = name
      if (phoneNumber.length) payload.phoneNumber = phoneNumber

      if (req.file) {
        let tmp_path = req.file.path
        let originExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ]
        let filename = req.file.filename + "." + originExt
        let target_path = path.resolve(
          config.rootPath,
          `public/uploads/${filename}`
        )

        const src = fs.createReadStream(tmp_path)
        const dest = fs.createWriteStream(target_path)

        src.pipe(dest)

        src.on("end", async () => {
          let player = await Player.findOne({ _id: req.player._id })
          let currentImage = `${config.rootPath}/public/uploads/${player.avatar}`

          if (fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage)
          }

          player = await Player.findOneAndUpdate(
            {
              _id: req.player._id,
            },
            { ...payload, avatar: filename },
            { new: true, runValidators: true }
          )

          res.status(201).json({
            datas: {
              id: player.id,
              name: player.name,
              phoneNumber: player.phoneNumber,
              avatar: player.avatar,
            },
          })
        })
      } else {
        const player = await Player.findOneAndUpdate(
          {
            _id: req.player._id,
          },
          payload,
          { new: true, runValidators: true }
        )

        res.status(201).json({
          datas: {
            id: player.id,
            name: player.name,
            phoneNumber: player.phoneNumber,
            avatar: player.avatar,
          },
        })
      }
    } catch (err) {
      err && err.name === "ValidationError"
        ? res.status(422).json({
            error: 1,
            message: err.message,
            fields: err.errors,
          })
        : next(err)
    }
  },
}
