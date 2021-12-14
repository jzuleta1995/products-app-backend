const mongoose = require('mongoose');

const UsersSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        required: true,
        trim: true,
        enum: ["ADMIN", "USER"],
        default: "USER"
    },
    createdAt: {
        type: Date,
        default: Date.now()
    } 
});

module.exports = mongoose.model('User', UsersSchema);