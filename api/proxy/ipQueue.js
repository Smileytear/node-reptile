const async = require('async')

const ipQueue = async.queue(function(obj, cb) {

}, 500)