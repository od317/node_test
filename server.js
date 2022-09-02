const express=require('express');
const app=express();
const expresslay=require('express-ejs-layouts');
const mysql=require("mysql");
const indexr=require('./routes/index')
const authrouter=require('./routes/authors')
const booksrouter=require('./routes/books')
const bodyparser=require('body-parser');


const con= mysql.createConnection({
    host:"sql6.freesqldatabase.com",
    user:"sql6516510",
    password:"HpQe9ARfGn",
    database:"sql6516510"
});

app.set(`view engine`,'ejs');
app.set('views',__dirname+'/views');
app.set('layout','layouts/layout');
app.use(expresslay)
app.use(express.static("public"))
app.use(bodyparser.urlencoded({limit:"10mb",extended:false}));
app.use('/',indexr);
app.use('/authors',authrouter);
app.use(`/books`,booksrouter);
app.listen(process.env.PORT||3000);