const express = require('express')
const { Result } = require('express-validator')
const { isValidObjectId } = require('mongoose')
const router = express.Router()

const Posts = require('../models/Posts')
const User = require('../models/User')
const Comments = require('../models/Comments')
const Notifications = require('../models/Notifications')



router.get('/', (req, res) => {
    if(!req.session._id) {
        res.redirect('/login')
    }
    else{
        post = undefined
        comment = undefined
        Posts.find((err, data) => {
            if(err) console.log(err)
            post = data
        })
        Comments.find((err, data) => {
            if(err) console.log(err)
            comment = data
        })
        User.findOne({_id: req.session._id})
        .then(u => {
            //console.log(u)
            res.render('newfeed',{user: u, posts: post, comments: comment})
        })
        .catch(e => console.log(e))
    }
})
router.post('/create', (req, res) => {
    if(!req.body.content) {
        res.send('Write something u noob')
    }
    else{
        const post = new Posts({
            content: req.body.content,
            Owner: req.session.name
        })
        //console.log(req.body)
        post.save()
            .then(data => {
                //res.json(data)
                res.redirect('/newfeed')
            })
            .catch(err => {
                res.json({message: err})
            })
        }
})
router.post('/postComment', (req, res) => {
    if(req.session._id) {
        if(!req.body.comment || !req.body.postId) {
            return res.render('newfeed',{errors: 'Input comment first'})
        }
        let comment = req.body.comment
        let postId = req.body.postId
        let user = undefined
        //console.log(comment, postId)
        User.findOne({_id: req.session._id})
        .then(u => {user = u})
        Posts.findOne({_id: postId})
        .then(p => {
            if(!p) res.send('PostID NOT Valid')
            let comment = new Comments({
                content: req.body.comment,
                Owner: user.name,
                PostId: postId
            })
            console.log('success')
            return comment.save();
        })
        .then(() => {res.redirect('/newfeed')})
    } else {
        res.redirect('/login')
    }
})
router.post('/createNotification', (req, res) => {
    if(req.session._id) {
        if(!req.body.title || !req.body.content) {
            return res.render('newfeed',{errors: 'Input comment first'})
        }
        let user = undefined
        //console.log(comment, postId)
        User.findOne({_id: req.session._id})
        .then(u => {user = u})
        .then(() => {
            let Noti = new Notifications({
                title: req.body.title,
                content: req.body.content,
                Owner: user.name,
                Falcuty: req.body.falcuty
                }
            )
            return Noti.save()
        })
        .then(() => { res.redirect('/newfeed')})
    } else {
        res.redirect('/login')
    }
})
module.exports = router