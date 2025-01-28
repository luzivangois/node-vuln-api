const jwt = require('jsonwebtoken')
const User = require('../models/user')

const SECRET_KEY = '0123456789012345678901234567890101234567890123456789012345678901'

exports.register = async (req, res) => {
  const { name, login, password, isAdmin } = req.body

  try {
    const user = new User({ name, login, password, isAdmin })
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
      return res.status(401).send({ message: 'Senha Incorreta!' })
    } else if (findUser) {
      const token = jwt.sign({ id: user._id, sub: user.login, isAdmin: user.isAdmin }, SECRET_KEY, { expiresIn: 600 })
      res.send({
        message: 'Login Realizado com Sucesso',
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

exports.userId = async (req, res) => {
  const { id } = req.params

  try {
    const user = await User.findById(id)

    if (!user) {
      return res.status(404).send({ message: 'Usuário não encontrado!'})
    } else {
      return res.status(200).send({
        message: 'Usuário encontrado com Sucesso!',
        id: user._id,
        login: user.login,
        password: user.password,
        isAdmin: user.isAdmin
      })    }
  } catch (err) {
    res.status(500).send({ message: 'Erro ao buscar usuários!' })
  }
}

exports.allUsers = async (req, res) => {
  const token = req.header('Authorization')

  if (!token) {
    return res.status(401).send({ message: 'Necessário Autenticação'})
  }

  try {
    const users = await User.find({}, 'id login')
    res.status(200).send(users)
  } catch (err) {
    res.status(500).send({ message: 'Erro ao buscar usuários.' })
  }
}

exports.updatePass = async (req, res) => {
  const { id } = req.params
  const { password } = req.body

  try {
    const user = await User.findById(id)

    if (!user) {
      return res.status(404).send({ message: 'Usuário não encontrado!'})
    }

    user.password = password
    await user.save()

    res.status(200).send({ message: 'Senha atualizada com sucesso!'})
  } catch (err) {
    res.status(500).send({ message: 'Erro ao atualizar a senha do usuário.'})
  }
}

exports.deleteUser = async (req, res) => {
  const { id } = req.params

  try {
    const user = await User.findById(id)

    if (!user) {
      return res.status(404).send({ message: 'Usuário não encontrado!'})
    }

    await user.deleteOne()

    res.status(204).send({ message: 'Usuário deletado com sucesso!'})
  } catch (err) {
    res.status(500).send({ message: 'Erro ao deletar usuário.'})
  }
}