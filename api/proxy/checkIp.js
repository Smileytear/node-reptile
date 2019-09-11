const superAgent = require('superagent')
require('superagent-proxy')(superAgent)
const useragent_list = require('../../public/useragent_list.js')

async function checkIp(obj, target = "https://www.baidu.com/") {
    return new Promise((resolve, reject) => {
        let useragent = useragent_list[parseInt(Math.random() * useragent_list.length)]
        superAgent
            .get(target)
            .set('User-Agent', useragent)
            .proxy(`${obj.protocol}://${obj.ip}:${obj.port}`)
            .timeout(10000) // 设置超时时间10000ms，超过未返回则认为改代理无效
            .end((err, res) => {
                if (err) {
                    resolve([obj, false, err])
                    return
                }
                resolve([obj, true])
            })
    })
}

module.exports = checkIp