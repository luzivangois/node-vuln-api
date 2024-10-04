const mongoose = require('mongoose')
const { Schema } = mongoose

mongoose.connect('mongodb://localhost:27017/database')

const userSchema = new Schema({
  name: { type: String, required: true},
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }
})

const User = mongoose.model('User', userSchema)

module.exports = User