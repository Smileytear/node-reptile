'use strict'

const crypto = require('crypto')
const formidable = require('formidable')
const timeformater = require('time-formater')
const query = require('../../mysql/mysql')

class Admin {
    constructor() {
        this.login = this.login.bind(this)
        this.register = this.register.bind(this)
        this.encryption = this.encryption.bind(this)
    }
    // 登录
    async login(req, res, next) {
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                res.send({
                    status: 0,
                    type: 'FORM_DATA_ERROR',
                    message: '表单信息错误'
                })
                return
            }
            const { username, password } = fields;
            try {
                if (!username) {
                    throw new Error('用户名参数错误')
                } else if (!password) {
                    throw new Error('密码参数错误')
                }
            } catch (err) {
                console.log(err.message, err)
                res.send({
                    status: 0,
                    type: 'GET_ERROR_PARAM',
                    message: err.message
                })
                return
            }
            const newpassword = this.encryption(password);
            try {
                const admin = await query(`select * from reptile.users where username='${username}' limit 0,1`)
                if (admin.length === 0) {
                    return res.send({
                        status: 0,
                        type: 'ERROR_ADMIN',
                        message: '用户名不存在'
                    })
                } else if (newpassword.toString() !== admin[0].password.toString()) {
                    res.send({
                        status: 0,
                        type: 'ERROR_PASSWORD',
                        message: '密码输入错误'
                    })
                } else {
                    req.session.admin_id = admin.id
                    res.send({
                        status: 1,
                        success: '登陆成功'
                    })
                }
            } catch (err) {
                res.send({
                    status: 0,
                    type: 'LOGIN_ADMIN_FAILED',
                    message: err.message
                })
            }
        })
    }
    // 注册
    async register(req, res, next) {
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                res.send({
                    status: 0,
                    type: 'FORM_DATA_ERROR',
                    message: '表单信息错误'
                })
                return
            }
            const { username, password } = fields
            try {
                if (!username) {
                    throw new Error('用户名错误')
                } else if (!password) {
                    throw new Error('密码错误')
                }
            } catch (err) {
                res.send({
                    status: 0,
                    type: 'GET_ERROR_PARAM',
                    message: err.message
                })
                return
            }
            try {
                const admin = await query(`select * from reptile.users where username='${username}'`)
                if (admin.length > 0) {
                    res.send({
                        status: 0,
                        type: 'USER_HAS_EXISTED',
                        message: '用户名已存在'
                    })
                } else {
                    const newpassword = this.encryption(password);
                    const info = await query(`insert into reptile.users(username,password,createtime,modifytime) values('${username}','${newpassword}',now(),now())`)
                    req.session.admin_id = info.insertId
                    res.send({
                        status: 1,
                        message: '注册账号成功'
                    })
                }
            } catch (err) {
                res.send({
                    status: 0,
                    type: 'REGISTER_ADMIN_FAILED',
                    message: '注册失败'
                })
            }
        })
    }
    async signout(req, res, next) {
        try {
            delete req.session.admin_id;
            res.send({
                status: 1,
                success: '退出成功'
            })
        } catch (err) {
            res.send({
                status: 0,
                message: '退出失败'
            })
        }
    }
    encryption(password) {
        const newpassword = this.Md5(this.Md5(password).substr(2, 7) + this.Md5(password))
        return newpassword
    }
    Md5(password) {
        const md5 = crypto.createHash('md5')
        return md5.update(password).digest('base64')
    }
}

module.exports = new Admin()