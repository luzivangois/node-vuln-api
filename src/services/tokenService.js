const jwt = require('jsonwebtoken');

const SECRET_KEY = '0123456789012345678901234567890101234567890123456789012345678901';
const EXPIRATION_TIME = '10m';

exports.generateToken = (user) => {
    return jwt.sign(
        { id: user._id, sub: user.login, isAdmin: user.isAdmin },
        SECRET_KEY,
        { expiresIn: EXPIRATION_TIME }
    );
};

exports.verifyToken = (token) => {
    try {
        return jwt.decode(token, SECRET_KEY);
    } catch (err) {
        throw new Error('Token inválido ou expirado');
    }
};