const express = require('express')
const router = express.Router()
const CheckLogin = require('../auth/CheckLogin')

router.get('/', CheckLogin, (req, res) => {
    res.redirect('/login')
})
router.get('/newfeed', CheckLogin, (req, res) => {
    res.render('newfeed')
})

module.exports = router