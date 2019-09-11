const path = require('path')
const config = require('config-lite')(path.join(__dirname, '../../'))
const redis = require('redis')

const client = redis.createClient({
    port: config.redis.RDS_PORT,
    host: config.redis.RDS_HOST,
    password: config.redis.RDS_PWD,
    db: 1 // 选择数据库1
})

client.on('error', function(err) {
    console.log(`Error ${err}`)
})

client.on('ready', function() {
    console.log(`redis ok`)
})

let redisData = {

}