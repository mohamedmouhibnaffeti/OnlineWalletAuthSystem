const mysql = require('mysql2')
const dotenv = require('dotenv')
dotenv.config({path: './.env'})

const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
})

module.exports.gettransactions = (req, res)=>{
    db.query('select * from transaction', (err, transaction)=>{
        if(err){
            return res.send(err)
        }
        return res.json({transactions: transaction})
    })
}