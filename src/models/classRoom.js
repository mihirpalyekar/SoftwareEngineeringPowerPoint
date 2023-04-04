const mongoose = require('mongoose');

const classRoomSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Teacher'
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    students: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    studentCount: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true
})

const ClassRoom = mongoose.model('ClassRoom', classRoomSchema)
module.exports = ClassRoom;