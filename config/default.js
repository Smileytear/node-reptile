'use strict'

module.exports = {
  port: parseInt(process.env.PORT, 10) || 3306,
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'reptile',
  multipleStatements: true,
  session: {
    name: '',
    secret: '',
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 365 * 24 * 60 * 60 * 1000
    }
  }
}