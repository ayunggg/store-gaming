const Player = require("../player/model")
const path = require("path")
const fs = require("fs")
const config = require("../../config")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

module.exports = {
  signUp: async (req, res, next) => {
    try {
      const payload = req.body
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
          try {
            const player = new Player({
              ...payload,
              avatar: filename,
            })
            await player.save()

            delete player._doc.password

            res.status(201).json({
              datas: player,
            })
          } catch (err) {
            err && err.name === "ValidationError"
              ? res.status(422).json({
                  error: 1,
                  message: err.message,
                  fields: err.errors,
                })
              : next(err)
          }
        })
      } else {
        let player = new Player(payload)
        await player.save()

        delete player._doc.password

        res.status(201).json({
          datas: player,
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
  signIn: async (req, res, next) => {
    try {
      const { email, password } = req.body
      const player = await Player.findOne({
        email: email,
      })

      if (player) {
        const checkPassword = bcrypt.compare(password, player.password)
        if (checkPassword) {
          const token = jwt.sign(
            {
              player: {
                id: player._id,
                username: player.username,
                email: player.email,
                name: player.name,
                phoneNumber: player.phoneNumber,
                avatar: player.avatar,
              },
            },
            config.jwtKey
          )

          res.status(200).json({
            datas: token,
          })
        } else {
          res.status(403).json({
            message: "Password Salah",
          })
        }
      } else {
        res.status(403).json({
          message: "Email Tidak Ditemukan",
        })
      }
    } catch (err) {
      res.status(500).json({
        error: 1,
        message: err.message,
        fields: err.errors,
      })
      next(err)
    }
  },
}
