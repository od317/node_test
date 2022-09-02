const express =require('express');
const router=express.Router();
const mysql=require('mysql');


const con= mysql.createConnection({
    host:"sql6.freesqldatabase.com",
    user:"sql6516510",
    password:"HpQe9ARfGn",
    database:"sql6516510"
});


//all authors route
router.get('/',(req,res)=>{
    let a;  
    if(req.query.name!=null && req.query.name!==' ')
      {
        con.query(`select * from authors where name like "%${req.query.name}%";`,(err,ress,file)=>{
            a=ress;
            res.render("authors/index",{authors:a});
          }) 
           
      }
    else{
    con.query("select * from authors;",(err,ress,file)=>{
     a=ress;
     res.render("authors/index",{authors:a});
   }) 
}
})

// new author route
router.get('/new',(req,res)=>{
    res.render('authors/new');
})
//creater author
router.post('/',(req,res)=>{
    let s=String(req.body.name);
    con.query(`insert into authors(name) values("${s}");`,(err,ress,file)=>{
       if(err){
          res.render('authors/new',{
            errormas:"error you idot"
          })
       }
       else{
        res.redirect('authors/new');
       }
    })
});

module.exports=router;