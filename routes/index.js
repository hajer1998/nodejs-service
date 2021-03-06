var express = require('express');
var router = express.Router();
const auth = require('../middleware/auth');
var notificationController = require('../controllers/NotificationController');
var postController = require('../controllers/PostController');
var userController = require('../controllers/UserController')
const chatController = require('../controllers/ChatController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// getAll Notes
router.get('/notifications',auth,notificationController.findAll);
// Retrieve notifications list by userId
// router.get('/notifications/:userId',auth, notificationController.findOne);

/*
Post methods
 */

router.get('/render_create_form', auth, postController.render_create_form);

router.get('/render_edit_form/:id', auth, postController.render_edit_form);

// Posts Creation Form
router.post('/create_post',auth,postController.create_post);

// Posts list
router.get('/postlist',auth, postController.posts_list);


// update post
router.post('/update_post',auth,postController.update_post);
//delete post
router.get('/delete_post/:id',auth,postController.delete_post);
//like post
router.post('/like_post/:id',auth,postController.like_post);
//unlike post
router.post('/unlike_post/:id',auth,postController.unlike_post);
/*
user methods
 */

//Log in
router.post('/signin', userController.sign_in);
//Log out
router.get('/signout', userController.sign_out);
//Sign in
router.post('/signup', userController.sign_up);

//profile
router.get('/profile/:id',auth, userController.profile);
//chat
router.get('/chat/:id', auth, chatController.render_chat_form);
//render edit profile
router.get('/render_edit_profile/:id', auth, userController.render_edit_profile);
//update profile
router.post('/updateProf',auth, userController.updateProf);
//upload profile picture
router.post('/upload', auth, userController.upload);

module.exports = router;
