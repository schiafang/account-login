const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const login = require('./login.js')
const app = express()
const port = 3000

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.render('index')
})
app.post('/', (req, res) => {
  const result = login(req.body.email, req.body.password)
  if (result.includes('Welcom')) {
    res.render('success-page', { result })
  } else {
    res.render('index', { result })
  }
})

app.listen(port, () => {
  console.log(`This server is listening on http://localhost:${port}`)
})