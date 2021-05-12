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
        notif = undefined
        Posts.find((err, data) => {
            if(err) console.log(err)
            post = data
        })
        Comments.find((err, data) => {
            if(err) console.log(err)
            comment = data
        })
        Notifications.find((err, data) => {
            if(err) console.log(err)
            notif = data
        })
        User.findOne({_id: req.session._id})
        .then(u => {
            //console.log(u)
            res.render('newfeed',{user: u, posts: post, comments: comment, notifs: notif})
        })
        .catch(e => console.log(e))
    }
})
router.get('/allNotif', (req, res) => {
    if(!req.session._id) {
        res.redirect('/login')
    }
    let notif = undefined
    Notifications.find((err, data) => {
        if(err) console.log(err)
        notif = data
    })
    User.findOne({_id: req.session._id})
    .then(u => {
        //console.log(u)
        res.render('tatcathongbao',{user: u, notifs: notif})
    })
    .catch(e => console.log(e))
})
// router.get('/allNotif/page/:page', (req, res) => {
//     if(!req.session._id) {
//         res.redirect('/login')
//     }
//     const pageOptions = {
//         page: parseInt(req.params.page,10) || 10,
//         limit: 10
//     }
//     let notif = Notifications.find()
//                 .skip(pageOptions.page * pageOptions.limit)
//                 .limit(pageOptions.limit)
//                 .exec(doc => console.log(doc))
//     User.findOne({_id: req.session._id})
//     .then(u => {
//         //console.log(u)
//         res.render('tatcathongbao',{user: u, notifs: notif})
//     })
//     .catch(e => console.log(e))
// })
router.get('/allNotif/:id', (req, res) => {
    
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
            return res.render('newfeed',{errors: 'Input comment first', user: u, posts: post, comments: comment, notifs: notif})
        }
        let comment = req.body.comment
        let postId = req.body.postId
        let user = undefined
        //console.log(comment, postId)
        User.findOne({_id: req.session._id})
        .then(u => {
            user = u
        })
        //console.log(user)
        Posts.findOne({_id: postId})
        .then(p => {
            if(!p) res.send('PostID NOT Valid')
            let comment = new Comments({
                content: req.body.comment,
                Owner: user.name,
                PostId: postId
            })
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
            return res.render('newfeed',{errors: 'Input comment first', user: u, posts: post, comments: comment, notifs: notif})
        }
        let user = undefined
        User.findOne({_id: req.session._id})
        .then(u => {user = u})
        .then(() => {
            let Noti = new Notifications({
                falcuty: req.body.falcuty,
                title: req.body.title,
                content: req.body.content,
                Owner: user.name
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
router.post('/commentdelete/:id', (req, res) => {
    if(!req.params.id) {
        return res.json({code: 1, message: 'Invalid ID'})
    }
    console.log(req.params.id)
    Comments.findOneAndDelete({_id: req.params.id})
    .then(data => {
        console.log(data)
    })
    return res.json({code: 0, message: 'OK'})
})
module.exports = router