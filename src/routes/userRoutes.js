const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/userid/:id', userController.userId)
router.get('/allusers', userController.allUsers)
router.put('/updatepass/:id', userController.updatePass)
router.delete('/deluser/:id', userController.deleteUser)

module.exports = router