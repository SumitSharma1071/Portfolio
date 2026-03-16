const express = require('express');
const router = express.Router();
const passport = require('passport');

const indexController = require('../controller/indexcontroller.js');

router.get('/', indexController.WelcomeGet);

router.get('/admin', indexController.adminPage);
router.post('/admin',  passport.authenticate('local', {
        successRedirect: '/main/project',
        failureRedirect: '/admin'
}));
router.get('/logout', indexController.adminlogout);

router.get('/main', indexController.IntroPage);

router.get('/contact', indexController.contactGet);

router.post('/contact', indexController.contactPost);

module.exports = router;