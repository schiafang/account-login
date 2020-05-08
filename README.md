# Account Login


### Overvies
#### Simple login page
- [x] use test account and password to sign in page

**Add cookie to keep logged in**
- [x] keep logged in before close page
- [x] or click sign-out icon to log out 

<br>

![index](https://i.imgur.com/nRibfzf.png)

![welcome](https://i.imgur.com/O2NqxtG.png)

![home](https://i.imgur.com/xjFVHj4.png)


## Prerequisites
[Node.js](https://nodejs.org/en/) (v10.15.0)


## Installation

[Download](https://github.com/schiafang/account-login/archive/master.zip) or **clone** repository to your local computer.
```
$ git clone https://github.com/schiafang/account-login.git
```
**Install** express
```
$ npm i express
```
**Execute** node app.js
```
$ npm start  
```

or execute nodemon app.js
```
$ npm run dev 
```

`The server listening on localhost:3000` will show on terminal when server connect success.

**Browse** [http://localhost:3000](http://localhost:3000) 

## Start 
You can use email and password below to test the web:


```
email: tony@stark.com
password: iamironman
```
or more
```
captain@hotmail.com
icandothisallday

peter@parker.com
enajyram

natasha@gamil.com
*parol#@$!

nick@shield.com
password
```


<br></br>
<br></br>
<br></br>




# NOTE: Cookie and Session

<dl><dd></dd></dl>
<font color="#707070">
由於 HTTP 是無狀態協議，HTTP 不會紀錄傳送數據，用戶端每一次發送的請求和數據都是獨立的，伺服器端無法識別是否為同一用戶端傳來的請求。為了能紀錄用戶端的狀態，伺服器端透過傳送 session 之類的方式來儲存在用戶端的 cookie 中，用戶再度發送請求時，伺服器端可以透過 session 中的資訊辨別使用者。</font>
<br></br>

```plaintext
cookie 用戶端用來保存伺服器傳來的資料
session 伺服器端用來記錄、辨識、追蹤用戶狀態的方式
```

### Cookie 用途

1. 管理記錄 session ( 帳號登入、購物車 )
2. 追蹤使用者行為，紀錄分析使用者的喜好 ( 數據分析 )
3. 紀錄使用者的個人喜好設定 ( 版面設定、佈景主題 )

### Cookie 的作用方式
伺服器端發送 **Set-Cookie** 的指令給用戶端，用戶端會將指令中的名稱與值儲存在 cookie 中，當中可以註明時效、網域、路徑等內容。當用戶端再次發送請求時，cookie 會隨著請求傳給伺服器端。

#### 設置 cookie
```javascript
Set-Cookie: name=value // 可加入其他參數例如 ;expires=date
```
#### 在 Exprees 中設置 cookie
```javascript
res.cookie(name, value, [, options])
// options example:
{ domain: '.example.com', path: '/', secure: true })
// 只在網域 example.com 有效，只在/路徑使用此 cookie，只在 https 中使用

// domain：cookie指定的網域名下有效
// path: 指定路徑下有效
// maxAge: 幾毫秒後到期
// expires: cookie過期時間，未設置或 0 則在關閉網頁失效
// httpOnly: 只能從 web server 訪問
// secure：只能被 HTTPS 使用
// signed: 設置簽章 
```
*如果要使用 signed cookie，需要下載 [cookie-parser](https://www.npmjs.com/package/cookie-parser) 模組

清除 cookie
```javascript
res.clearCookie(name [, options])
```

### 安全性
由於 cookie 存放於用戶端，可從瀏覽器修改或被網路攻擊竊取資訊，不適合儲存重要資訊。 cookie 中的空間也有限，只能儲存小量片段資料，若資料量多時也會影響傳輸資料的速度。

所以可透過其他方式加強 cookie 使用上的安全性，例如使用 session，產生一組獨特的 ID 來辨識用戶端，並把重要資訊儲存於伺服器端中。


## Session 

### 傳送流程

用戶端發送請求 (request)

伺服器比對用戶 sessionID (verify NO)

伺服器回應一般入口(不含用戶資料的介面) (resposne)

用戶填寫表單(登入)或操作頁面資料(購物車)，瀏覽器將資料與請求傳給伺服器端 (request)

伺服器端比對用戶資料狀態，建立一組 sessionID (verify YES)

伺服器將 set-cookie 指令與 sessionID 和資料傳送給用戶端(resposne)

瀏覽器收到伺服器傳來的指令儲存 sessionID 在 cookie 中

用戶再次發送請求，瀏覽器同時帶上 cookie 中的數據資料傳送給伺服器端 (request)

伺服器端透過 sessionID 比對用戶資料狀態 (verify YES)

回傳相對應信息並更新用戶資料狀態(resposne)



### Express 中使用 express-session 
安裝 [express-session](https://github.com/expressjs/session)
```
$ npm i express-session
```
載入並建立套件至主程式
```javascript
const session = require('express-session')
app.use(session(secret:'', [options]))

// *secret:為一組字串，透過演算產生一組session ID

// options 可加入其他需要的屬性 ex:
// name：設置儲存在 cookie 中的名稱
// store：設定儲存方式
// genid：產生一個新的 sessionID 時，所使用的函數 (預設使用uid2套件)
// rolling：每次請求都重新設置一個 cookie
// resave：沒有修改 session 也會更新儲存
// saveUninitialized：強制將未初始化的 session 存回 session store
// cookie：存放 cookie 的相關設定，預設值: default: { path: '/', httpOnly: true, secure: false, maxAge: null }
```


<br>

### 保持登入狀態實作

1. 安裝設定 session 
2. 當帳號密碼送出時，透過 login.js 比對帳號密碼是否正確
3. 錯誤時 `app.post('/')` 回應重新渲染 index 頁面<br>
   並在 session 中新增一個屬性，標記為未登入狀態 `logged: false`
4. 帳號密碼正確，登入成功 `app.post('/')` 重新指向路徑到 `/welcome`，並標註登入狀態 `logged: true`
5. 當頁面指向 `/welcome` 渲染 `welcome.handlebars` 頁面
6. 建立登入後主頁面，在 welcome 頁面中導引至主頁面
7. 此時在未關閉網頁的狀態下 session 有效，登入狀態在 `logged: true`
8. 設定當處與登入狀態時返回 `http://localhost:3000`直接跳轉回登入後主頁面
9. 加入 sign-out 按鈕更改登入狀態返回登入頁面




