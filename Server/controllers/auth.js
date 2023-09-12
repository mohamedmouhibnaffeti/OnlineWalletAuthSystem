const mysql = require('mysql2')
const dotenv = require('dotenv')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const createError = require('http-errors')

dotenv.config({path: './.env'})

const maxAge = 60 * 3 * 24
const create_token = (id) =>{
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn : maxAge
    })
}

const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
})

module.exports.Clientregister = (req, res, next)=>{
    const {phone, name, amount, verified, password, confirmPassword} = req.body
    db.query(`SELECT name FROM client WHERE phone = ? UNION SELECT name FROM vendor WHERE phone = ?`, [phone,phone], async (err, results)=>{
        if(err){
            return next(createError.InternalServerError(err))
        }
        if(results.length > 0){
            return next(createError.Conflict('Phone Number Already Exists in Database'))
        }
        if(password !== confirmPassword){
            return next(createError.BadRequest('Password and Confirm Password do not match'))
        }
        const salt = await bcrypt.genSalt()
        let hashedpassword = await bcrypt.hash(password, salt)
        db.query('INSERT INTO client SET ?', {phone: phone, name: name, amount: amount, verified: verified, password: hashedpassword}, (err, result)=>{
            if(err){
                return next(createError.InternalServerError(err))
            }else{
                const token = create_token(result.phone)
                res.cookie('jwt', token, { maxAge: maxAge})
                res.status(201).json('User Created')
            }
        })
    })
}

module.exports.Vendorregister = (req, res, next)=>{
    const {phone, name, amount, verified, password, confirmPassword, location, available} = req.body
    db.query(`SELECT name FROM client WHERE phone = ? UNION SELECT name FROM vendor WHERE phone = ?`, [phone,phone], async (err, results)=>{ 
        if(err){
            return next(createError.InternalServerError(err))
        }
        if(results.length > 0){
            return next(createError.Conflict('Phone Number Already Exists in Database'))        
        }
        if(password !== confirmPassword){
            return next(createError.BadRequest('Password and Confirm Password do not match'))
        }
        const salt = await bcrypt.genSalt()
        let hashedpassword = await bcrypt.hash(password, salt)
        db.query('INSERT INTO vendor SET ?', {phone: phone, name: name, amount: amount, verified: verified, password: hashedpassword, location: location, available: available}, (err, result)=>{
            if(err){
                return next(createError.InternalServerError(err))
            }else{
                const token = create_token(result.phone)
                res.cookie('jwt', token, { maxAge: maxAge})
                res.status(201).json('User Created')
            }
        })
    })
}

module.exports.login = (req, res, next)=>{
    const {phone, password} = req.body
    db.query('SELECT name, phone, amount, verified, password, NULL AS location, NULL AS available FROM client WHERE phone=? UNION SELECT * FROM vendor WHERE phone=?', [phone,phone], async (err, [User])=>{
        if(err){
            return next(createError.InternalServerError(err))
        }
        if(!User){
            return next(createError.NotFound('Phone number does not exist in database'))
        }
        if(User){
            try{
                const auth = await bcrypt.compare(password, User.password)
                if(!auth){
                    return next(createError.BadRequest('Wrong Password'))
                }
                const token = create_token(User.phone)
                res.cookie('jwt', token, { maxAge: maxAge})
                res.status(200).json({jwt : token})
            }catch(err){
                return next(createError.InternalServerError(err))
            }
        }
    })
}

module.exports.logout = (req, res) =>{
    res.cookie('jwt', '', {maxAge : 1})
    res.send('Logged out')
}