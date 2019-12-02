let axios = require('axios')
const mysql = require('mysql')

// 连接数据库
let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'user',
  dateStrings:true
})

connection.connect()

function add (news, callback) {
  connection.query('INSERT INTO news SET ?', news, callback)
}

let page = 2
let time = 1562656541721
let keys = ['aid', 'title', 'hometext', 'thumb', 'url_show', 'inputtime']
let count = 0
function next(params) {
  count = 0
  params._csrf = params._csrf.substring(0, params._csrf.length - 2) + '%3D%3D'
  axios.get('https://www.cnbeta.com/home/more?&type=' + params.type + '&page=' + params.page + '&_csrf=' + params._csrf + '&_=' + params._, {headers: {'referer': 'https://www.cnbeta.com/'}})
    .then(res => {
      console.log('------------------------------------------------')
      console.log(res.data.state)
      console.log(res.config.url)
      let obj = {}
      let l = res.data.result.list.length
      res.data.result.list && res.data.result.list.forEach(item => {
        keys.forEach(key => {
          obj[key] = item[key]
        })
        add(obj, (err, result) => {
          if (err) return console.log(err)
          count++
          if (count === l) {
            console.log(l)
            toNext(res.data.token)
          }
        })
      })
    })
}
next({
  type: 'all',
  page,
  _csrf: 'eq1JT1s50rIOOuQKlH7E2pGfiYJkpdjnhfeS3MRj4fkbxwskAgCk5Udx0m3fEKiI9O7t7FeQiazqwPiOnQCIzA==',
  _: time})

function toNext (token) {
  if (page <= 200000) {
    page++
    time += 2
    setTimeout(() => {
      next({type: 'all', page, _csrf: token, _: time})
    }, 1000)
  }
}
