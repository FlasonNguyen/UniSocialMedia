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
    },
    role: {
        type: String,
        require: true,
        default: 'student'
    },
    falcuty: {
        type: String,
        default: ''
    }
})
UserSchema.plugin(findOrCreate);
const User = mongoose.model('User', UserSchema)
module.exports = User