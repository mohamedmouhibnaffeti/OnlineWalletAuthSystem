const {Router} = require('express')
const UserController = require('../controllers/UserController')

const router = Router()

router.get('/allvendors', UserController.getvendors)
router.get('/allclients', UserController.getclients)

module.exports = router