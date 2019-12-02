let axios = require('axios')

let source = [
    {name: 'ES6', description: '好用灵活', color: ''},
    {name: 'react', description: '好用灵活', color: ''},
    {name: 'TCP/IP', description: '好用灵活', color: ''}
]

source.forEach(item => {
    add(item)
})

function add (params) {
    axios.post('http://localhost:3000/add/classify', params)
        .then(res => {
            console.log('---------------------------')
            console.log(res.data)
        })
}
