const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session')
const login = require('./login.js')
const app = express()
const port = 3000

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
  name: 'accoutlogin',
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))

app.listen(port, () => {
  console.log(`This server is listening on http://localhost:${port}`)
})

// 開啟localhost:3000， 如果在已登入狀態則重新指向到 /login
app.get('/', (req, res) => {
  if (req.session.logged === true) {
    res.redirect('/home')
  } else {
    res.render('index')
  }
})

// 傳送登入資料，比對資料錯誤則重新渲染首頁登入畫面並跳出提示
// 資料正確則更改 looged 狀態並且指向 /welcome
app.post('/', (req, res) => {
  const result = login(req.body.email, req.body.password)
  if (result.includes('failed')) {
    req.session.logged = false
    res.render('index', { result })
  } else {
    req.session.logged = true
    req.session.name = login(req.body.email, req.body.password)
    res.redirect('welcome')
  }
})

// 當路由指向 /welcome 時渲染 welcome 畫面
app.get('/welcome', (req, res) => {
  if (req.session.logged === true) {
    const name = req.session.name
    res.render('welcome', { name })
  }
})

// 當路由指向 /home 時為已登入狀態，並渲染登入後網頁
app.get('/home', (req, res) => {
  if (req.session.logged === true) {
    const name = req.session.name
    res.render('home', { name })
  }
})

// 登出返回登入畫面
app.get('/index', (req, res) => {
  req.session.logged = false
  res.redirect('/')
})

