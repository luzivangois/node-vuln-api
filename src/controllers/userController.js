const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const db = require('../models/user')

const SECRET_KEY = '0123456789012345678901234567890101234567890123456789012345678901'

exports.register = (req, res) => {
  const { name, login, password, } = req.body
  const userId = uuidv4()

  const hashedPassword = bcrypt.hashSync(password, 8)

  db.run(`INSERT INTO users (id, name, login, password) VALUES (?, ?, ?, ?)`, [userId, name, login, hashedPassword], function (err) {
    if (err) return res.status(500).send({ message: 'Erro ao registrar o usuário.' })

    res.status(201).send({ message: 'Usuário registrado com sucesso!' })
  })
}

exports.login = (req, res) => {
  const { login, password } = req.body

  db.get(`SELECT * FROM users WHERE login = ?`, [login], (err, user) => {
    if (err) return res.status(500).send({ message: 'Erro ao buscar o usuário.' })
    if (!user) return res.status(404).send({ message: 'Usuário não encontrado.' })

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) return res.status(401).send({ token: null, message: 'Senha inválida.' })

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: 86400 })

    res.status(200).send({ token: token })
  })
}

exports.allusers = (req, res) => {
    db.all(`SELECT id, login FROM users`, [], (err, rows) => {
      if (err) return res.status(500).send({ message: 'Erro ao buscar usuários.' })
  
      res.status(200).send(rows)
    })
  }