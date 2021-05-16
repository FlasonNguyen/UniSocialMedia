var today = new Date();
var date = today.getDate()+ '/' + (today.getMonth()+1) + '/'+ today.getFullYear()   ;
var time = today.getHours() + ":" + today.getMinutes()
var dateTime = date+' '+time;

const mongoose = require('mongoose')
const findOrCreate = require('mongoose-findorcreate')
const PostsSchema = new mongoose.Schema({
    content: {
        type: String,
        require: true
    },
    createAt: {
        type: Date,
        default: dateTime
    },
    Likes: {
        type: String,
        default: 0
    },
    Owner: {
        type: String,
        require: true
    }
})
PostsSchema.plugin(findOrCreate);
const Posts = mongoose.model('Posts', PostsSchema)
module.exports = Posts

