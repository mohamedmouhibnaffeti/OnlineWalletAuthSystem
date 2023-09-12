const {Router} = require('express')
const transactionscontroller = require('../controllers/transactionscontroller')
const router = Router()

router.get('/all', transactionscontroller.gettransactions)

module.exports = router