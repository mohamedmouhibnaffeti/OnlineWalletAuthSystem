const express = require('express')
const authController = require('../controllers/auth')


const router = express.Router()

router.post('/clientregister', authController.Clientregister)
router.post('/vendorregister', authController.Vendorregister)
router.post('/login', authController.login)
router.get('/logout', authController.logout)


module.exports = router