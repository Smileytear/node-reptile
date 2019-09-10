const path = require('path')
const config = require('config-lite')(path.join(__dirname, '../'))
const chalk = require('chalk')

const mysql = require('mysql')

let options = {
    connectionLimit: 10,
    host: config.host,
    user: config.user,
    port: config.port,
    password: config.password,
    database: config.database
}
const pool = mysql.createPool(options)

pool.on('acquire', function(connection) {
    console.log(chalk.blue(`Connection is acquired, ${connection.threadId}`));
});

pool.on('connection', function(connection) {
    console.log(chalk.blue(`mysql is connection...`))
})

pool.on('release', function(connection) {
    console.log('Connection is released', connection.threadId);
});

const query = (sql) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                return reject(err)
            } else {
                connection.query(sql, (error, results, fields) => {
                    connection.release()

                    if (error) {
                        return reject(error)
                    }
                    resolve(results)
                })
            }
        })
    })
}

module.exports = query