const express =require('express');
const router=express.Router();
const mysql=require('mysql');
const multer=require('multer');
const path=require('path');
const storage=multer.diskStorage({
destination:(req,file,cb)=>{
  cb(null,'/public/books_covers')
},
filename:(req,file,cb)=>{
  console.log("this is fiel"+file);
  cb(null,path.extname(file.originalname))
}

});
const upload=multer({storage:storage});


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
    let covs=["g1.webp","g2.jpg","g3.jpg","g4.webp","g5.webp","g6.jpg","g7.jpg","g8.jpg","g9.jpg","g10.jpg","g11.jpg","g12.jpg","g13.jpg",];
    console.log(covs);
    res.render('books/new',{authors:a,covs:covs});
   })
})
//creater author
router.post('/', upload.single('cover'),async (req,res)=>{
  upload.single('cover');
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

router.get('/:id',async (req,res)=>{
  try{ 
  let id= String(req.params.id);
  console.log("wow");
  con.query(`select * from  books where title="${id}"`,(err,ress,file)=>{
   let a=ress;
   if(a[0]==null)
   res.redirect('/books');
   else{
   con.query(`select * from authors where id=${a[0].author_id}`,(err,ress2,file)=>{
    res.render(`books/show`,{info:a[0],author:ress2[0]});
   })
  }
  });
  }
  catch{
    res.redirect('/');
  }
   
})
router.get('/:id/edit',async(req,res)=>{
  
  con.query(`select* from books where title="${String(req.params.id)}";`,(err,ress,file)=>{
    con.query(`select * from authors;`,(err,ress2,file)=>{
      let covs=["g1.webp","g2.jpg","g3.jpg","g4.webp","g5.webp","g6.jpg","g7.jpg","g8.jpg","g9.jpg","g10.jpg","g11.jpg","g12.jpg","g13.jpg",];
      res.render('books/edit',{book:ress[0],authors:ress2,covs:covs});
    })
  })
})
router.put('/:id',async(req,res)=>{
  console.log(req.params.id);
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
  await con.query(`update  books set
  title="${t}",descritopn="${desc}",publishDate="${d}",page_count=${pc},cover_img="${cover}",author_id=${a} 
  where title="${req.params.id}";`,(err,ress,file)=>{
    console.log(err);
    res.redirect('books');
  })
 
}
})

router.delete('/:id',async (req,res)=>{
  let id=req.params.id;
await con.query(`delete from books where title="${id}";`,(err,ress,file)=>{
      if(err){
       console.log(req.body);
        console.log(err);
         res.redirect('/books');
       }
       else{
     res.redirect(`/books`);
       }
      })
})

module.exports=router;