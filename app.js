const express = require('express')
// console.log(express)
const app = express()
const port = 3000
const web = require('./routers/web')
const connectdb=require('./db/connectdb')
const fileUpload = require("express-fileupload");

//view engine ejs
app.set('view engine', 'ejs')

// for image and css
app.use(express.static('public'))

//db connection
connectdb()

//for data use
app.use(express.urlencoded({extended:true}))

// cookies
const cookieparser = require('cookie-parser')
app.use(cookieparser()) 

//for msg show use
let session = require('express-session');
let flash = require('connect-flash');

app.use(session({
  secret: 'secret',
  cookie: {maxAge:60000},
  resave: false,
  saveUninitialized: false,

}));

app.use(flash());

//for file upload
app.use(fileUpload({useTempFiles: true}));

//routing load
app.use('/',web)

//server create//
app.listen(port, () => {
    console.log(`server is running localhost: ${port}`)
  })


  // mbc = model view controller//