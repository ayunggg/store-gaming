const Bank = require("./model")

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage")
      const alertStatus = req.flash("alertStatus")

      const alert = {
        message: alertMessage,
        status: alertStatus,
      }

      const bank = await Bank.find()
      res.render("admin/bank/view_bank", {
        bank,
        alert,
        name: req.session.user.name,
        title: "Halaman Bank",
      })
    } catch (err) {
      req.flash("alertMessage", `${err.message}`)
      req.flash("alertStatus", "danger")
      res.redirect("/bank")
    }
  },
  viewCreate: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage")
      const alertStatus = req.flash("alertStatus")

      const alert = {
        message: alertMessage,
        status: alertStatus,
      }
      res.render("admin/bank/create", {
        alert,
        name: req.session.user.name,
        title: "Halaman Tambah Bank",
      })
    } catch (err) {
      req.flash("alertMessage", `${err.message}`)
      req.flash("alertStatus", "danger")
      res.redirect("/bank")
    }
  },

  actionCreate: async (req, res) => {
    try {
      const { name, bankName, noRekening } = req.body

      const noRek = await Bank.findOne({
        noRekening: noRekening,
      })

      if (noRek) {
        let datasName = await Bank.findOne({
          bankName: bankName,
        })
        if (!datasName) {
          let bank = await Bank({ name, bankName, noRekening })
          await bank.save()
          req.flash("alertMessage", "Berhasil Tambah Bank")
          req.flash("alertStatus", "success")

          res.redirect("/bank")
        } else {
          req.flash("alertMessage", "Duplicate Entry")
          req.flash("alertStatus", "danger")
          res.redirect(`/bank/create`)
        }
      } else {
        let bank = await Bank({ name, bankName, noRekening })
        await bank.save()
        req.flash("alertMessage", "Berhasil Tambah Bank")
        req.flash("alertStatus", "success")

        res.redirect("/bank")
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`)
      req.flash("alertStatus", "danger")
      res.redirect("/bank")
    }
  },

  viewEdit: async (req, res) => {
    try {
      const { id } = req.params

      const alertMessage = req.flash("alertMessage")
      const alertStatus = req.flash("alertStatus")

      const alert = {
        message: alertMessage,
        status: alertStatus,
      }
      const bank = await Bank.findOne({ _id: id })

      res.render("admin/bank/edit", {
        bank,
        alert,
        name: req.session.user.name,
        title: "Halaman Edit Bank",
      })
    } catch (err) {
      req.flash("alertMessage", `${err.message}`)
      req.flash("alertStatus", "danger")
      res.redirect("/bank")
    }
  },

  actionEdit: async (req, res) => {
    try {
      const { id } = req.params
      const { name, bankName, noRekening } = req.body
      let datasBank = await Bank.findOne({
        noRekening: noRekening,
        _id: { $ne: id },
      })
      if (datasBank) {
        console.log("no rekening sama")
        let datasName = await Bank.findOne({
          bankName: bankName,

          _id: { $ne: id },
        })
        if (!datasName) {
          await Bank.findOneAndUpdate(
            {
              _id: id,
            },
            { name, bankName, noRekening }
          )
          req.flash("alertMessage", "Berhasil Edit Bank")
          req.flash("alertStatus", "success")

          res.redirect("/bank")
        } else {
          req.flash("alertMessage", "Duplicate Entry")
          req.flash("alertStatus", "danger")
          res.redirect(`/bank/edit/${id}`)
        }
      } else {
        console.log("no rekening berbeda")
        await Bank.findOneAndUpdate(
          {
            _id: id,
          },
          { name, bankName, noRekening }
        )
        req.flash("alertMessage", "Berhasil Edit Bank")
        req.flash("alertStatus", "success")
        res.redirect("/bank")
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`)
      req.flash("alertStatus", "danger")
      res.redirect("/bank")
    }
  },

  actionDelete: async (req, res) => {
    try {
      const { id } = req.params

      await Bank.findOneAndDelete({
        _id: id,
      })

      req.flash("alertMessage", "Berhasil Delete Bank")
      req.flash("alertStatus", "success")

      res.redirect("/bank")
    } catch (err) {
      req.flash("alertMessage", `${err.message}`)
      req.flash("alertStatus", "danger")
      res.redirect("/bank")
    }
  },
}
