const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Tasks = require('./classRoom')

const userSchema = new mongoose.Schema({
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
    classRoomCount: {
        type: Number,
        default: 0
    },
    userType: {
        type: String,
        required: true
    },
    following: {
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

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.generateAuthToken = async function() {

    const token = jwt.sign({ _id: this._id }, 'thisismynewtoken');

    this.tokens = this.tokens.concat({ token });
    await this.save();
    return token;
}

userSchema.methods.toJSON = function() {
    const userObject = this.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject
}
userSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('unable to login');
    }
    return user
}

userSchema.pre('save', async function(next) {

    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next()
})

userSchema.pre('remove', async function(next) {

    await Tasks.deleteMany({ owner: this._id })
    next();
})

const User = mongoose.model('User', userSchema)

module.exports = User;