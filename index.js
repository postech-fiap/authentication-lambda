const jwt = require('jsonwebtoken')
const mysql = require('mysql2/promise');

const jwtSecret = process.env.JWT_SECRET

const generateToken = (id) => {
    const payload = { id }
    const options = { expiresIn: '20m' }
    return jwt.sign(payload, jwtSecret, options)
}

exports.handler = async function(event, context) {
    const cpf = event?.cpf

    if (!cpf) {
        return generateToken(null)
    }

    const connection = await mysql.createConnection({
        host: process.env.RDS_HOSTNAME,
        port: process.env.RDS_PORT,
        user: process.env.RDS_USERNAME,
        password: process.env.RDS_PASSWORD,
        database: process.env.RDS_DATABASE
    })

    const [rows] = await connection.execute('SELECT * FROM `cliente` WHERE `cpf` = ?', [cpf]);

    if (rows.length == 0) {
        throw 'User not found' 
    }

    const id = rows[0].id

    return generateToken(id)
}
