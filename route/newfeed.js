const express = require('express')
const router = express.Router()

const Posts = require('../models/Posts')
const User = require('../models/User')

router.get('/', (req, res) => {
    if(!req.session._id) {
        res.redirect('/login')
    }
    else{
        post = undefined
        Posts.find((err, data) => {
            if(err) console.log(err)
            post = data
        })
        User.findOne({_id: req.session._id})
        .then(u => {
            //console.log(u)
            res.render('newfeed',{user: u, posts: post})
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

module.exports = router