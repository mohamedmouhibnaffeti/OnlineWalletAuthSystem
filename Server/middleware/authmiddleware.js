const jwt = require('jsonwebtoken')
const mysql = require('mysql2')
const dotenv = require('dotenv')
const createError = require('http-errors')
dotenv.config({path: './.env'})

const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
})

const requireAuth = (req, res, next) =>{
    const authHeader = req.headers.authorization
    const bearerToken = authHeader.split(' ')
    const token = bearerToken[1]
    console.log(token)
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) =>{
            if(err){
                return next(createError.Unauthorized())
            } else {
                next()
            }
        })
    }
    else{
        return next(createError.Unauthorized())
    }
}

const checkUser = (req, res, next) =>{
    const authHeader = req.headers.authorization
    const bearerToken = authHeader.split(' ')
    const token = bearerToken[1]
    console.log(token)
    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) =>{
            if(err){
                res.locals.user = null
                return next(createError.Unauthorized())
            } else { 
                db.query('SELECT name, phone, amount, verified, password, NULL AS location, NULL AS available FROM client WHERE phone=? UNION SELECT * FROM vendor WHERE phone=?', [decodedToken.id,decodedToken.id], (err, user)=>{
                    if(err){
                        return next(createError.InternalServerError(err))
                    }
                    res.locals.user = user
                    next()
                })
            }
        })
    }else {
        res.locals.user = null
        return next(createError.Unauthorized())
    }
}

module.exports = { requireAuth, checkUser }