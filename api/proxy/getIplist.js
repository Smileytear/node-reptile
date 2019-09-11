const superAgent = require('superagent')
require('superagent-proxy')(superAgent)
const cheerio = require('cheerio')
const log = require('tracer').colorConsole()
const useragent_list = require('../../public/useragent_list.js')

/* 西刺代理 */
async function getXiCiIpList(page) {
    return new Promise(async (resolve, reject) => {
        const useragent = useragent_list[parseInt(Math.random() * useragent_list.length)]
        superAgent
            .get('https://www.xicidaili.com/wt/' + page)
            .set("User-Agent", useragent)
            .end((err, res) => {
                if (err) {
                    log.error(err)
                    resolve({
                        ipArr: [],
                        error: true
                    })
                    return
                }
                const $ = cheerio.load(res.text)
                let ipList = $('#ip_list tr')
                let i = 1
                let length = ipList.length;
                let ipArr = []
                for (i; i < length; i++) {
                    let value = ipList.eq(i)
                    ipArr.push({
                        ip: value.find("td").eq(1).html(),
                        port: value.find("td").eq(2).html(),
                        address: value.find("td").eq(3).find("a").html() ? value.find("td").find("a").html().trim() : "",
                        status: value.find("td").eq(4).html() ? value.find("td").eq(4).html().trim() : "",
                        protocol: value.find("td").eq(5).html() ? value.find("td").eq(5).html().toLowerCase() : "",
                        from: "西刺代理",
                        fromHref: "http://www.xicidaili.com/wt/",
                        responseTime: value.find("td").eq(6).find(".bar").attr("title") ? value.find("td").eq(6).find(".bar").attr("title").trim() : ""
                    })
                }
                // let allPage = $('.pagination>a').eq(-2).html()
                resolve({
                    ipArr,
                    error: false
                })
            })
    })
}

/* 快代理 */
async function getKuaiIpList(page) {
    return new Promise(async (resolve, reject) => {
        let useragent = useragent_list[parseInt(Math.random() * useragent_list.length)]
        superAgent
            .get("https://www.kuaidaili.com/free/inha/" + page)
            .set("User-Agent", useragent)
            .end((err, res) => {
                if (err) {
                    log.error(err)
                    resolve({ // 为了Promise.all 不进入catch状态
                        ipArr: [],
                        error: true
                    })
                    return
                }
                const $ = cheerio.load(res.text)
                let ipList = $('table>tbody>tr');
                let i = 1,
                    length = ipList.length;
                let ipArr = [];
                for (i; i < length; i++) {
                    let value = ipList.eq(i);
                    ipArr.push({
                        ip: value.find("td").eq(0).html(),
                        port: value.find("td").eq(1).html(),
                        address: value.find("td").eq(4).html() ? value.find("td").eq(4).html().trim() : "",
                        status: value.find("td").eq(2).html() ? value.find("td").eq(2).html().trim() : "",
                        protocol: value.find("td").eq(3).html() ? value.find("td").eq(3).html().toLowerCase() : "",
                        from: "快代理",
                        fromHref: "https://www.kuaidaili.com/free/inha/",
                        responseTime: value.find("td").eq(5).html() ? value.find("td").eq(5).html().trim() : ""
                    });
                }

                // let allPage = $("#listnav>ul>li").eq(-2).find("a").html();
                resolve({
                    ipArr,
                    error: false
                });
            })
    })
}

/* 开心代理 */
async function getKaiXinIpList(page) {
    let useragent = useragent_list[parseInt(Math.random() * useragent_list.length)]
    return new Promise((resolve, reject) => {
        superAgent
            .get("http://www.kxdaili.com/dailiip/1/" + page + ".html")
            .set("User-Agent", useragent)
            .end((err, res) => {
                if (err) {
                    log.error(err)
                    resolve({ // 为了Promise.all 不进入catch状态
                        ipArr: [],
                        error: true
                    })
                    return
                }
                const $ = cheerio.load(res.text)
                let ipList = $('.active>tbody>tr');
                let i = 1,
                    length = ipList.length;
                let ipArr = [];
                for (i; i < length; i++) {
                    let value = ipList.eq(i);
                    ipArr.push({
                        ip: value.find("td").eq(0).html(),
                        port: value.find("td").eq(1).html(),
                        address: value.find("td").eq(5).html() ? value.find("td").eq(5).html().trim() : "",
                        status: value.find("td").eq(2).html() ? value.find("td").eq(2).html().trim() : "",
                        protocol: "http",
                        from: "开心代理",
                        fromHref: "http://ip.kxdaili.com",
                        responseTime: value.find("td").eq(4).html() ? value.find("td").eq(4).html().trim() : ""
                    });
                }

                // let allPage = $("#listnav>ul>li>a").eq(-1).html();
                resolve({
                    ipArr,
                    error: false
                });
            })
    })
}

module.exports = async (page) => {
    return new Promise((resolve, reject) => {
        Promise.all([
            getKaiXinIpList(page),
            getKuaiIpList(page),
            getXiCiIpList(page)
        ]).then((data) => {
            // let allPage = 100;
            let ipArr = []
            data.forEach((value, index) => {
                // if (!value.error && allPage > value.allPage) {
                //     allPage = value.allPage
                // }
                ipArr = ipArr.concat(value.ipArr)
            })
            // if (!allPage) allPage = 3
            // resolve({
            //     ipArr,
            //     allPage
            // })
            resolve(ipArr)
        }).catch(err => {
            log.error(err);
            resolve(false)
        })
    })
}