const express =require('express');
const router=express.Router();
const mysql=require('mysql');
const path=require('path');
const coverimagebasepath='uploads/booksCovers';
const uploadPath=path.join('public',coverimagebasepath);
const multer=require('multer');
const imageMimeTypes=['images/jpeg','images/png','images/gif']
const upload=multer({
dest:uploadPath,
fileFilter: (req,file,callback)=>{
    callback(null,imageMimeTypes.includes(file.mimetype))
}
});

const con= mysql.createConnection({
    host:"sql6.freesqldatabase.com",
    user:"sql6516510",
    password:"HpQe9ARfGn",
    database:"sql6516510"
});


//all authors route
router.get('/', async (req,res)=>{
  let a;  
    if(req.query.name!=null && req.query.name!==' ')
      {
        con.query(`select * from books where  title like "%${req.query.name}%";`,(err,ress,file)=>{
            a=ress;
            res.render("books/index",{books:a});
          }) 
           
      }
    else if(req.query.pu!=null)
    {
      con.query(`select * from books where publishDate<=${req.query.pu} ;`,(err,ress,file)=>{
        a=ress;
        res.render("books/index",{books:a});
      }) 
    }
    else if(req.query.pa!=null){
      con.query(`select * from books where publishDate>=${req.query.pa} ;`,(err,ress,file)=>{
        a=ress;
        res.render("books/index",{books:a});
      }) 
    }  
  else{  
  await con.query("select * from books order by publishDate desc;",(err,ress,file)=>{
      a=ress;  
      res.render('books/index',{books:a});
    });
  }
})

// new author route
router.get('/new',async (req,res)=>{
  await con.query("select * from authors;",(err,ress,file)=>{
    if(err)
      res.redirect('/books');
    let a=ress;
    res.render('books/new',{authors:a});
   })
})
//creater author
router.post('/',upload.single('cover'),async (req,res)=>{
  let t=String(req.body.title );
  let a=req.body.author;
  let d=String(req.body.publishDate);
  let pc=req.body.pagec;
  let cover=req.body.cover;
  
  let desc=String(req.body.desc);
  console.log("t :"+t+" a : "+a+" d : "+d+" pc : "+pc+" cover: "+cover+" dec: "+desc);
  if(t==''||a==null||cover==""||d==""){
    await con.query("select * from authors;",(err,ress,file)=>{
      if(err)
        res.redirect('/books');
      let a=ress;
      res.render('books/new',{authors:a,errormas:"error you missed somthing"});
     })
  }
  else{
  await con.query(`insert into books(title,descritopn,publishDate,page_count,cover_img,author_id) values(
     "${t}","${desc}","${d}",${pc},"${cover}",${a}
  );`,(err,ress,file)=>{
    console.log(err);
  })
  res.redirect('books');
}
});

module.exports=router;