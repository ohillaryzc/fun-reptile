/*
* 图片爬取下载到本地
* 网址：https://wallhaven.cc/
* 大图片：https://w.wallhaven.cc/full/r2/wallhaven-r2qqlj.jpg
* 小图片：https://th.wallhaven.cc/small/r2/r2qqlj.jpg
*
* 大：https://w.wallhaven.cc/full/j5/wallhaven-j5y525.jpg
* 小：https://th.wallhaven.cc/small/j5/j5y525.jpg
*
* 小：https://th.wallhaven.cc/small/type/fileName
* 大：https://w.wallhaven.cc/full/type/wallhaven-fileName
* */

const fs = require('fs')
const axios = require('axios')
const cheerio = require('cheerio')

// const BASE_URL = 'https://wallhaven.cc/'
const BASE_URL = 'https://wallhaven.cc/search?q=id%3A537&categories=111&purity=010&sorting=relevance&order=desc&page=2'

// axios.get(BASE_URL)
//   .then(res => {
//     let $ = cheerio.load(res.data, {decodeEntities: false})
//     let srcArr = []
//     $('.feat-row img').each((index, item) => {
//       let smallArr = $(item).attr('src').split('/')
//       srcArr.push({
//         url: `https://w.wallhaven.cc/full/${smallArr[smallArr.length - 2]}/wallhaven-${smallArr[smallArr.length - 1]}`,
//         fileName: smallArr[smallArr.length - 1]
//       })
//     })
//     console.log(srcArr.length)
//     saveImage(srcArr)
//   })
axios.get(BASE_URL)
  .then(res => {
    let $ = cheerio.load(res.data, {decodeEntities: false})
    let srcArr = []
    $('.lazyload').each((index, item) => {
      let smallArr = $(item).data('src').split('/')
      srcArr.push({
        url: `https://w.wallhaven.cc/full/${smallArr[smallArr.length - 2]}/wallhaven-${smallArr[smallArr.length - 1]}`,
        fileName: smallArr[smallArr.length - 1]
      })
    })
    saveImage(srcArr, 0)
  })

function saveImage (arr, index) {
  if (index <= arr.length) {
    download(arr, index)
  }
}

function download (arr, index) {
  let obj = arr[index]
  axios.get(obj.url, {responseType: 'stream'})
    .then(res => {
      res.data.pipe(fs.createWriteStream(`./lol/${obj.fileName}`))
      saveImage(arr, ++index)
      console.log(index)
    })
    .catch(err => {
      console.log(obj)
      saveImage(arr, ++index)
    })
}

// download('https://th.wallhaven.cc/small/39/392lk9.jpg')
