const User = require("./model")
const bcrypt = require("bcryptjs")

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage")
      const alertStatus = req.flash("alertStatus")

      const alert = {
        message: alertMessage,
        status: alertStatus,
      }

      if (req.session.user === null || req.session.user === undefined) {
        res.render("admin/sign_in/view_signin", {
          alert,
          title: "Halaman Login Admin",
        })
      } else {
        res.redirect("/dashboard")
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`)
      req.flash("alertStatus", "danger")
      res.redirect("/")
    }
  },

  actionSignIn: async (req, res) => {
    try {
      const { email, password } = req.body
      const emailCheck = await User.findOne({
        email: email,
      })

      if (emailCheck) {
        if (emailCheck.status === "Y") {
          const passwordCheck = await bcrypt.compare(
            password,
            emailCheck.password
          )
          if (passwordCheck) {
            req.session.user = {
              id: emailCheck._id,
              email: emailCheck.email,
              status: emailCheck.status,
              name: emailCheck.name,
            }
            res.redirect("/dashboard")
          } else {
            req.flash("alertMessage", `Kata Sandi Yang Anda Masukkan Salah`)
            req.flash("alertStatus", "danger")
            res.redirect("/")
          }
        } else {
          req.flash("alertMessage", `Email Anda Tidak Aktif`)
          req.flash("alertStatus", "danger")
          res.redirect("/")
        }
      } else {
        req.flash("alertMessage", `Email Tidak Ditemukan`)
        req.flash("alertStatus", "danger")
        res.redirect("/")
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`)
      req.flash("alertStatus", "danger")
      res.redirect("/")
    }
  },
  actionLogOut: (req, res) => {
    req.session.destroy()
    res.redirect("/")
  },
}
