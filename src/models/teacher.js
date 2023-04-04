const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validator(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Value of email is incorrect');
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0)
                throw new Error('Age should be positive');
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('password cannot contain "Password"')
            }
        }
    },
    userType: {
        type: String,
        required: true
    },
    classRoomCreatedCount: {
        type: Number,
        default: 0
    },
    classRoomFollowedCount: {
        type: Number,
        default: 0
    },
    classRooms: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})


teacherSchema.methods.generateAuthToken = async function() {

    const token = jwt.sign({ _id: this._id }, 'thisismynewtoken');

    this.tokens = this.tokens.concat({ token });
    await this.save();
    return token;
}

teacherSchema.methods.toJSON = function() {
    const teacherObject = this.toObject();

    delete teacherObject.password;
    delete teacherObject.tokens;
    delete teacherObject.avatar;

    return teacherObject
}
teacherSchema.statics.findByCredentials = async(email, password) => {
    const teacher = await Teacher.findOne({ email });

    if (!teacher) {
        throw new Error('unable to login');
    }

    const isMatch = await bcrypt.compare(password, teacher.password)

    if (!isMatch) {
        throw new Error('unable to login');
    }
    return teacher
}

teacherSchema.pre('save', async function(next) {

    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next()
})

teacherSchema.pre('remove', async function(next) {

    await Tasks.deleteMany({ owner: this._id })
    next();
})

const Teacher = mongoose.model('Teacher', teacherSchema)

module.exports = Teacher;