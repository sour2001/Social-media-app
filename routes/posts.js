const express=require('express');
const router=express.Router();
//we use passport beacuse if a person know the field of our form then he can create a post without signing in by creating a form on home page without sign-in 
const passport=require('passport');
const postController=require('../controllers/post_controller');
router.post('/create',passport.checkAuthentication,postController.create);
router.get('/destroy/:id',passport.checkAuthentication,postController.destroy);
module.exports=router;


