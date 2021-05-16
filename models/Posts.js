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

var today = new Date();

var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

var dateTime = date+' '+time;