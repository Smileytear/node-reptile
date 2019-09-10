const express = require('express')
const Admin = require('../controller/admin/admin.js')
const router = express.Router()

router.post('/login', Admin.login) // 登录
router.post('/register', Admin.register) // 注册
router.get('/signout', Admin.signout) // 账号退出

module.exports = router