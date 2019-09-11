'use strict'

const mysql = {
    port: parseInt(process.env.PORT, 10) || 3306,
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'reptile',
    multipleStatements: true
}

const redis = {
    RDS_PORT: 6379, //服务器端口
    RDS_HOST: '127.0.0.1', //服务器ip
    RDS_PWD: '', //密码
    RDS_OPTS: {}, //设置值       //是否把连接情况打印到文件里
}

const session = {
    name: 'myReptile',
    secret: 'myReptile',
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 365 * 24 * 60 * 60 * 1000,
    }
}

module.exports = {
    mysql,
    redis,
    session
}