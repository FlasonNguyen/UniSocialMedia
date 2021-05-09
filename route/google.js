const express = require('express')
const passport = require('passport')
const router = express.Router()

router.get('/',
  passport.authenticate('google', { scope: ['profile','email']
}));

router.get('/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    req.session._id = req.user._id
    res.redirect('/newfeed')
});

module.exports = router