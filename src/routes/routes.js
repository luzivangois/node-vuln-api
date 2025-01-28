const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const fileController = require('../controllers/fileController')

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/userid/:id', userController.userId)
router.get('/allusers', userController.allUsers)
router.put('/updatepass/:id', userController.updatePass)
router.delete('/deluser/:id', userController.deleteUser)
router.post('/upload', fileController.uploadFile)
router.get('/read/:filename', fileController.readFile)

module.exports = router