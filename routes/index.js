const express =require('express');
const router=express.Router();

router.get('^/$|home(.html)?',(req,res)=>{
   res.render("index");
})


module.exports=router;