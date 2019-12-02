/* 博客爬虫，网站：http://www.dengzhr.com */
let axios = require('axios')
let cheerio = require('cheerio')
const mysql = require('mysql')

// 连接数据库
let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'blog',
  dateStrings:true
})

connection.connect()

// http://www.dengzhr.com/category/node-js  nodejs 模块
// http://www.dengzhr.com/category/js js模块
// http://www.dengzhr.com/category/js/page/3
// http://www.dengzhr.com/category/js/page/2
let des = []
axios.get('http://www.dengzhr.com/category/js/page/3')
  .then(res => {
    let $ = cheerio.load(res.data, {decodeEntities: false})
    let hrefs = []
    $('.read-more').each((index, item) => {
      hrefs.push($(item).attr('href'))
    })
    $('.abstract.article-body').each((index, item) => {
      let text = $(item).html()
      des.push(text)
    })
    hrefs.forEach((item, index) => {
      saveData(item, index)
    })
  })

function saveData (url, i) {
  axios.get(url)
    .then(res => {
      let $ = cheerio.load(res.data, {decodeEntities: false})
      $('h1,h2,h3,h4,h5,h6').each((index, item) => {
        $(item).html(`<a id="${'_' + index}"></a>${$(item).html()}`)
      })
      let article = {
        title: $('h3.title').text(),
        description: des[i],
        views: 0,
        classify: '1',
        tag: '2',
        content: $('#articleBody').html(),
        type: 1
      }
      connection.query('INSERT INTO article SET ?', article, (err, result) => {
        if (err) return console.log(err)
        console.log(result)
      })
      // console.log($('#articleBody').html())
    })
}
