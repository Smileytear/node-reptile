const log = require('tracer').colorConsole()
const { sleep } = require('../../tools/common.js')
const getIpList = require('./getIplist.js')

/* 
 * 批量爬取可用IP
 * startPage     从西刺ip代理里的第几页开始爬
 * endPage       从西刺ip代理里的第几页结束
 *
 * */

async function startIpReptile(startPage = 1, endPage = 3, callback) {
    let currentPage = startPage
    let ipList = []
    for (currentPage; currentPage <= endPage; currentPage++) {
        try {
            log.info(`开始第${currentPage}页`)
            let data = await getIpList()
            log.info(`获取了第${currentPage}页的列表ip`)
            if (data) {
                ipList = [...ipList, ...data]
            }
        } catch (err) {
            log.error(`第${currentPage}页错误，错误信息：${err}`)
        }
        await sleep(3000)
    }


}