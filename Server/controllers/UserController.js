const mysql = require('mysql2')
const dotenv = require('dotenv')
dotenv.config({path: './.env'})

const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
})

module.exports.getclients = (req, res) =>{
    db.query('SELECT * FROM client', (err, clients)=>{
        if(err){
            return res.send(err)
        }
        return res.json({clients : clients})
    })
}

module.exports.getvendors = (req, res) =>{
    db.query('SELECT * FROM vendor', (err, vendors)=>{
        if(err){
            return res.send(err)
        }
        return res.json({clients : vendors})
    })
}