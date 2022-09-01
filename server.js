const express=require('express');
const app=express();
const expresslay=require('express-ejs-layouts');
const mysql=require("mysql");
const indexr=require('./routes/index')


const con= mysql.createConnection({
    host:"sql6.freesqldatabase.com",
    user:"sql6516510",
    password:"HpQe9ARfGn",
    database:"sql6516510"
});

con.query("select * from users",(err,res,fil)=>{
    console.log(res);
})

app.set(`view engine`,'ejs');
app.set('views',__dirname+'/views');
app.set('layout','layouts/layout');
app.use(expresslay)
app.use(express.static('public'))

app.use('/',indexr);

app.listen(process.env.PORT||3000);