const admin = require('./admin.js')

module.exports = app => {
    app.use('/admin', admin)
}