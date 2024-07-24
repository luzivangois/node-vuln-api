const jwt = require('jsonwebtoken')
const User = require('../models/user')

const SECRET_KEY = '0123456789012345678901234567890101234567890123456789012345678901'

exports.register = async (req, res) => {
  const { name, login, password, } = req.body

  try {
    const user = new User({ name, login, password })
    await user.save()

    res.status(201).send({ message: 'Usuário registrado com sucesso!' })
  } catch (err) {
    res.status(500).send({ message: 'Erro ao registrar o usuário.' })
  }
}

exports.login = async (req, res) => {
  const { login, password } = req.body
  const findUser = await User.findOne({
    login: login,
    password: password
  })

  try {
    const user = await User.findOne({ login })
    const pass = await User.findOne({ password })
    if (!user) {
      return res.status(404).send({ message: 'Usuário não encontrado.' })
    } else if (!pass) {
      return res.status(400).send({ message: 'Senha Incorreta!' })
    } else if (findUser) {
      const token = jwt.sign({ id: user._id, sub: user.login }, SECRET_KEY, { expiresIn: 600 })
      res.send({
        message: "Login Realizado com Sucesso",
        id: findUser._id,
        login: findUser.login,
        token: token
      })
    }else{
      res.status(500).send({ message: 'Erro ao buscar o usuário.' })
    }
  } catch (err) {
    res.status(500).send({ message: 'Erro ao buscar o usuário.' })
  }
}

exports.allUsers = async (req, res) => {
  const token = req.header('Authorization')

  if (!token) {
    return res.status(401).send({ message: "Necessário Autenticação"})
  }

  try {
    const users = await User.find({}, 'id login')
    res.status(200).send(users)
  } catch (err) {
    res.status(500).send({ message: 'Erro ao buscar usuários.' })
  }
}