const express = require('express')
const passport = require('passport')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('login')
})

//LOGIN HANDLE



module.exports = router