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
//create author
router.post('/',(req,res)=>{
    let s=String(req.body.name);
    con.query(`insert into authors(name) values("${s}");`,(err,ress,file)=>{
       if(err){
        console.log(req.body);
          res.render('authors/new',{
            errormas:"error you idot"
          })
       }
       else{
        res.redirect('authors');
       }
    })
});

router.get('/:id',(req,res)=>{
  con.query(`select * from  authors where id=${req.params.id}`,(err,ress,file)=>{
  con.query(`select * from  books where author_id=${req.params.id};`,(err,ress2,file)=>{
    console.log(ress2);
    res.render('authors/show',{author:ress[0],books:ress2});
  }) 
  })
})

router.get('/:id/edit',async (req,res)=>{
  let id=req.params.id;
  con.query(`select * from authors where id=${id}`,(err,ress,file)=>{
    let a=ress;
    console.log(err);
    if(err){
     res.redirect("/authors");
    }
    else{
      
      res.render('authors/edit',{author:a});
    }
  })

})

router.put('/:id',(req,res)=>{
  let s=String(req.body.name);
  let id=req.params.id;
    con.query(`update  authors set name="${s}" where id=${id};`,(err,ress,file)=>{
       if(err){
        console.log(req.body);
        console.log(err);
          res.render('authors/new',{
            errormas:"error you idot"
          })
       }
       else{
        res.redirect(`/authors/${id}`);
       }
    })
})

router.delete('/:id',async (req,res)=>{
  let id=req.params.id;
 await con.query(`delete from books where author_id=${id};`,(err,ress,file)=>{})
  await   con.query(`delete from authors where id=${id};`,(err,ress,file)=>{
       if(err){
        console.log(req.body);
        console.log(err);
          res.redirect('/authors');
       }
       else{
        res.redirect(`/authors`);
       }
    })
})



module.exports=router;