const express = require('express');
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');

router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', wrapAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'You have successfully logged in!');
            res.redirect('/books');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), (req, res) => {
    req.flash('success', 'Welcome!');
    const redirectUrl = req.session.returnTo || '/books';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

// THIS VERSION OF PASSPORT IS 8.5.0 REMEMBER WHEN YOU ARE DEPLOYING TO HEROKU
router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err) }
        req.flash('success', 'Goodbye!');
        res.redirect('/books');
    });
});

module.exports = router;