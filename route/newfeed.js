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
    if(!req.body.postcontent) {
        res.send('Write something u noob')
    }
    else{
        const post = new Posts({
            content: req.body.postcontent,
            Owner: req.session.name
        })
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
        let falcuty = req.body.falcuty.toString()
        //console.log(falcuty)
        User.findOne({_id: req.session._id})
        .then(u => {user = u})
        .then(() => {
            let Noti = new Notifications({
                title: req.body.title,
                content: req.body.content,
                Owner: user.name,
                Falcuty: falcuty
                }
            )
            return Noti.save()
        })
        .then(() => { res.redirect('/newfeed')})
    } else {
        res.redirect('/login')
    }
})
router.post('/delete/:id', (req, res) => {
    if(!req.params.id) {
        return res.json({code: 1, message: 'Invalid ID'})
    }
    Posts.findOneAndDelete({_id: req.params.id})
    .then(data => {
        console.log(data)
    })
    return res.json({code: 0, message: 'OK'})
})
router.post('/update/:id', (req, res) => {
    if(!req.params.id) {
        return res.json({code: 1, message: 'Invalid ID'})
    }
    let content = req.body.updatecontent
    let current = new Date()
    //console.log(req.body)
    // Posts.findOne({_id: req.params.id})
    // .then(data => {
    //     data.overwrite({content: content, createAt: current})
    // })
    Posts.findOne({_id: req.params.id}, (err, doc) => {
        doc.content = content
        doc.createAt = current
        doc.save()
    } )
    return res.json({code: 0, message: 'OK'})
})
module.exports = router