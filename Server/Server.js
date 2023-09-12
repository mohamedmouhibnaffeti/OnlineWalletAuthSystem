const express = require('express')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const { requireAuth, checkUser } = require('./middleware/authmiddleware') 
const AuthRouter = require('./routes/AuthRoutes')
const TransactionRouter = require('./routes/TransactionsRoutes')
const UserRouter = require('./routes/UserRoutes')
const createError = require('http-errors')
const morgan = require('morgan')

dotenv.config({path: './.env'})
const app = express()
app.use(express.json())
app.use(cookieParser())

app.use(morgan('dev'))

app.get('/username', requireAuth, checkUser,(req, res) =>{
    res.json({cookie : req.cookies,
              user: res.locals.user})
})

app.get('/cookies', (req, res)=>{
    res.send(req.cookies)
})

app.use('/auth', AuthRouter)
app.use('/transactions', TransactionRouter)
app.use('/users', UserRouter)

app.use(async(req, res, next)=>{
    next(createError.NotFound())
})
app.use((err, req, res, next)=>{
    res.status(err.status || 500)
    res.send({
        error: {
            status : err.status || 500,
            message : err.message
        }
    })
})

app.listen(3000, console.log('server running on : http://localhost:3000'))