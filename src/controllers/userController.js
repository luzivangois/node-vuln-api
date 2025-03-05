const User = require('../models/user');
const tokenService = require('../services/tokenService');

exports.register = async (req, res) => {
  const { name, login, password, isAdmin } = req.body;

  try {
    const user = new User({ name, login, password, isAdmin });
    await user.save();

    res.status(201).send({ message: 'Usuário registrado com sucesso!' });
  } catch (err) {
    res.status(500).send({ message: 'Erro ao registrar o usuário.' });
  }
};

exports.login = async (req, res) => {
  const { login, password } = req.body;

  try {
    const user = await User.findOne({ login, password });

    if (!user) {
      return res.status(404).send({ message: 'Usuário não encontrado ou senha incorreta.' });
    }

    const token = tokenService.generateToken(user);
    res.send({
      message: 'Login Realizado com Sucesso',
      id: user._id,
      login: user.login,
      token: token,
    });
  } catch (err) {
    res.status(500).send({ message: 'Erro ao buscar o usuário.' });
  }
};

exports.userId = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).send({ message: 'Usuário não encontrado!' });
    }

    res.status(200).send({
      message: 'Usuário encontrado com Sucesso!',
      id: user._id,
      name: user.name,
      login: user.login,
      password: user.password,
      isAdmin: user.isAdmin,
    });
  } catch (err) {
    res.status(500).send({ message: 'Erro ao buscar usuários!' });
  }
};

exports.allUsers = async (req, res) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).send({ message: 'Necessário Autenticação' });
  }

  try {
    const decoded = tokenService.verifyToken(token);
    const users = await User.find({}, 'id name login isAdmin');
    res.status(200).send(users);
  } catch (err) {
    res.status(401).send({ message: 'Token inválido ou expirado' });
  }
};

exports.updatePass = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).send({ message: 'Usuário não encontrado!' });
    }

    user.password = password;
    await user.save();

    res.status(200).send({ message: 'Senha atualizada com sucesso!' });
  } catch (err) {
    res.status(500).send({ message: 'Erro ao atualizar a senha do usuário.' });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).send({ message: 'Token não fornecido!' });
  }

  const token = auth.split(' ')[1];

  try {
    const decoded = tokenService.verifyToken(token);

    if (!decoded.isAdmin) {
      return res.status(403).send({ message: 'Acesso negado! Apenas administradores podem deletar usuários.' });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).send({ message: 'Usuário não encontrado!' });
    }

    await user.deleteOne();

    res.status(204).send({ message: 'Usuário deletado com sucesso!' });
  } catch (err) {
    if (err.message === 'Token inválido ou expirado') {
      return res.status(401).send({ message: 'Token inválido ou expirado!' });
    }
    console.error(err);
    res.status(500).send({ message: 'Erro ao deletar usuário.' });
  }
};