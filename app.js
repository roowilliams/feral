require('dotenv').config()
const express = require('express')
const path = require('path')
const app = express()
const port = 3000

app.set('view engine', 'pug')

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
  res.render('index', {
    meta: { data: { description: 'desc', title: 'yolo' } }
  })
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
