const express=require('express');
const router=express.Router();
const postcontroller=require('../controllers/post_controller');
console.log('Router loaded');
router.get('/post',postcontroller.post);

module.exports=router;