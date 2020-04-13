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

let count = 1
// const BASE_URL = 'https://wallhaven.cc/'
const BASE_URL = 'https://wallhaven.cc/search?q=lol&page='

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
function run (url) {
  axios.get(url)
    .then(res => {
      let $ = cheerio.load(res.data, {decodeEntities: false})
      let srcArr = []
      let span = $('.thumb-info')
      $('.lazyload').each((index, item) => {
        let smallArr = $(item).data('src').split('/')
        let obj = {
          url: `https://w.wallhaven.cc/full/${smallArr[smallArr.length - 2]}/wallhaven-${smallArr[smallArr.length - 1]}`,
          fileName: smallArr[smallArr.length - 1]
        }
        if ($(span[index]).find('.png').length) {
          let type = smallArr[smallArr.length - 1].split('.')[0] + '.png'
          obj.url = `https://w.wallhaven.cc/full/${smallArr[smallArr.length - 2]}/wallhaven-${type}`
          obj.fileName = type
        }
        srcArr.push(obj)
      })
      saveImage(srcArr, 0)
    })
}

function saveImage (arr, index) {
  if (index < arr.length) {
    download(arr, index)
  } else if (count <= 5) {
    console.log('---------------------------')
    count++
    run(BASE_URL + count)
  } else {
    console.log('finish...')
  }
}

function download (arr, index) {
  let obj = arr[index]
  axios.get(obj.url, {responseType: 'stream'})
    .then(res => {
      let ws = fs.createWriteStream(`./lol/${obj.fileName}`)
      res.data.pipe(ws)
      ws.on('finish', () => {
        saveImage(arr, ++index)
      })
      console.log(index, obj.fileName + 'download finish...')
    })
    .catch(err => {
      console.log(obj)
      saveImage(arr, ++index)
    })
}

// download('https://th.wallhaven.cc/small/39/392lk9.jpg')
run(BASE_URL + count)
