const mongoose = require('mongoose')
const findOrCreate = require('mongoose-findorcreate')
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    }
})
UserSchema.plugin(findOrCreate);
const User = mongoose.model('User', UserSchema)
module.exports = User