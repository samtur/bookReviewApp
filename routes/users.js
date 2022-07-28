const express = require('express');
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const users = require('../controllers/users')

router.route('/register')
    .get((users.renderRegForm))
    .post(wrapAsync(users.register));

router.route('/login')
    .get((users.renderLoginForm))
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), (users.login));

// THIS VERSION OF PASSPORT IS 8.5.0 REMEMBER WHEN YOU ARE DEPLOYING TO HEROKU
router.get('/logout', (users.logout));

module.exports = router;

