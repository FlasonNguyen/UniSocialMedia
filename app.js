const express = require('express')
const passport = require('passport')
const mongoose = require('mongoose')
const db = require('./db')
require('dotenv').config()

const app = express()

app.use(express.json())

//--------------------------------GOOGLE LOGIN-----------------------------------

app.use(passport.initialize())
app.use(passport.session())

require('./googleoauth2')

app.use('/auth/google', require('./route/google'))


//--------------------------------GOOGLE LOGIN-----------------------------------

app.use('/', require('./route/index'))
app.use('/login',require('./route/login'))


app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({extended: false}))

app.listen(8080, () => console.log('http://localhost:8080'))