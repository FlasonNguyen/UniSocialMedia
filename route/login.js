const express = require('express')
const router = express.Router()
const {validationResult} = require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const CheckLogin = require('../auth/CheckLogin')
const User = require('../models/User')

const loginValidator = require('./validators/loginValidator')
const registerValidator = require('./validators/registerValidator')

router.get('/', (req, res) => {
    res.render('login')
})
router.get('/register', CheckLogin, (req, res) => {
    res.render('admin')
})

//LOGIN HANDLE

router.post('/', loginValidator, (req, res) => {
    let result = validationResult(req)
    if(result.errors.length === 0) {
        let {email, password} = req.body
        let user = undefined

        User.findOne({email: email})
        .then(u => {
            if(!u) {
                throw new Error('Email không tồn tại')
            }
            user = u
            return bcrypt.compare(password, u.password)
        })
        .then(passwordMatch => {
            if(!passwordMatch) {
                return res.status(401).json({code: 3, message: 'Mật khẩu không đúng'})
            }
            const JWT_SECRET = process.env.JWT_SECRET
            jwt.sign({
                email: user.email,
                name: user.name
            },JWT_SECRET, {
                expiresIn: '1h'
            }, (err, token) => {
                if(err) throw err
                console.log(token)
                return res.render('newfeed')
            })
        })
        .catch(e => {
            return res.status(401).json({code: 2, message: 'Login thất bại' + e.message})
        })
    }else {
        let messages = result.mapped()
        let message = ''
        for(m in messages) {
            message = messages[m].msg
            break
        }
        return res.json({code: 1, message: message})
    }
})

//REGISTER HANDLE

router.post('/register', registerValidator, (req, res) => {
    let result = validationResult(req)
    if (result.errors.length === 0) {

        let {email, password, name} = req.body
        User.findOne({email: email})
        .then(acc => {
            if (acc) {
                throw new Error('Tài khoản này đã tồn tại')
            }
        })
        .then(() => bcrypt.hash(password, 10))
        .then(hashed => {

            let user = new User({
                email: email,
                password: hashed,
                name: name
            })
            return user.save();
        })
        .then(() => {
            // không cần trả về chi tiết tài khoản nữa
            return res.render('newfeed')
        })
        .catch(e => {
            return res.json({code: 2, message: 'Đăng ký tài khoản thất bại: ' +e.message})
        })
    }
    else {
        let messages = result.mapped()
        let message = ''
        for (m in messages) {
            message = messages[m].msg
            break
        }
        return res.json({code: 1, message: message})
    }
})

module.exports = router