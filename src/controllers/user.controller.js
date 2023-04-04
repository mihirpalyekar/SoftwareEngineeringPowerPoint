const User = require('../models/user')
const UploadDocuments = require('../models/documents')
const multer = require('multer');

const ClassRoom = require('../models/classRoom')

const Document = require('../models/documents')
const path = require('path')

const Register = async function(req, res) {

    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.cookie('access_token', token)
        res.send({ user, redirect: '/user/home' })
    } catch (e) {
        res.status(400).send(e);
    }
}

const Login = async function(req, res) {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.cookie('access_token', token)
        res.send({ user, redirect: '/user/home' })
    } catch (e) {
        res.status(400).send(e)
    }
}

const showHomePage = async function(req, res) {
    try {
        const user = req.user
        res.render('UserHome', {
            user
        })

    } catch (e) {

        res.status(500).send();
    }
}

const Profile = async function(req, res) {
    const user = req.user
    res.render('UserProfile', {
        user,
    })
}

const Logout = async function(req, res) {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save();

        res.render('login');
    } catch (e) {
        res.status(500).render('login')
    }
}

const UpdateProfile = async function(req, res) {
    const updates = Object.keys(req.body);
    const updatesAllowed = ['name', 'age', 'email', 'password'];
    const isValidOperation = updates.every((update) => updatesAllowed.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Update!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save();
        const user = req.user
        res.send({ redirect: '/user/profile', user });
    } catch (e) {
        res.status(400).send(e)
    }
}

const DeleteProfile = async function(req, res) {
    try {
        const currentUserID = req.user._id.toString();

        await User.updateMany({ _id: { $in: req.user.followingList } }, {

            $unset: {
                [`follower.${currentUserID}`]: ""
            }
        });

        await User.updateMany({ _id: { $in: req.user.followerList } }, {
            $unset: {
                [`following.${currentUserID}`]: ""
            }
        });
        await req.user.remove()
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e)
    }
}



var storage = multer.diskStorage({
    destination: './public/images/',
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
})

const Upload = multer({ storage: storage })

const UploadDocument = async function(req, res) {
    //if want to restrict the size and dimentions uncomment below line and replace  uploadDocument.fileUpload = file with uploadDocument.fileUpload = buffer
    //const buffer = await sharp(req.file).resize({ width: 250, height: 250 }).png()
    const file = req.file
    try {
        const classRoom = await ClassRoom.findOne({ name: req.body.name })
        const students = Object.keys(classRoom.students);
        var flag = 0

        if (students.length > 0) {
            students.forEach(element => {
                if (element != req.user._id) {
                    throw new Error("User does not belong to class")
                } else {
                    flag = 1
                }
            });
        } else {
            throw new Error("User does not belong to class")
        }
        if (flag == 1) {
            const uploadDocument = new UploadDocuments({
                studentId: req.user._id,
                classRoomId: classRoom._id,
                name: req.body.name,
                description: req.body.description
            })
            uploadDocument.fileUpload = file
            await uploadDocument.save()
            await uploadDocument.populate('teacherId', 'name email age').populate('studentId', 'name email age').execPopulate()
            res.send(uploadDocument);
        }

    } catch (e) {
        if (e) {
            res.status(500).send(e);
        } else {
            res.status(500).send("Class not found");
        }

    }
}

const getDocument = async function(req, res) {
    try {
        var classRoom = []
        classRoom = await Document.find({ studentId: req.user._id })
        res.send(classRoom)
    } catch (e) {
        res.status(500).send("somthing went wrong while getting document");
    }
}

// const deleteAvatar = async function(req, res) {
//     try {
//         req.user.avatar = undefined;
//         await req.user.save()
//         res.send('success');
//     } catch (e) {
//         res.status(500).send()
//     }
// }

// const getAvatar = async function(req, res) {
//     try {
//         const user = await User.findById(req.body.id)

//         if (!user || !user.avatar) {
//             throw new Error("something is wrong")
//         }

//         res.set('Content-Type', 'image/png')
//         res.send(user.avatar)
//     } catch (e) {
//         res.status(500).send();
//     }
// }

const classRoomFollow = async function(req, res) {
    const userProfile = req.user
    const userId = req.user._id
    const classRoomId = req.body.id
    try {
        const classRoom = await ClassRoom.findOne({ _id: classRoomId })
        if (classRoomId in userProfile.following) {

            delete userProfile.following[classRoomId]
            delete classRoom.students[userId]

            userProfile.classRoomCount = userProfile.classRoomCount - 1
            classRoom.studentCount = classRoom.studentCount - 1

            userProfile.markModified('following')
            userProfile.markModified('classRoomCount')
            classRoom.markModified('students')
            classRoom.markModified('studentCount')
            await classRoom.save()
            await userProfile.save()
            return res.status(201).send(userProfile)
        }
        classRoom.students[userId] = userId
        userProfile.following[classRoomId] = classRoomId
        userProfile.classRoomCount = userProfile.classRoomCount + 1
        classRoom.studentCount = classRoom.studentCount + 1
        userProfile.markModified('following')
        userProfile.markModified('classRoomCount')
        classRoom.markModified('students')
        classRoom.markModified('studentCount')
        await classRoom.save()
        await userProfile.save()
        res.send(userProfile)

    } catch (e) {
        res.status(500).send("somthing went wrong");
    }
}

const searchClassRoom = async function(req, res) {
    try {

        const classRoom = await ClassRoom.findOne({ name: req.body.name })

        if (!classRoom) {
            return alert('Class room not found')
        }

        res.send(classRoom)
    } catch (e) {
        res.status(500).send("somthing went wrong")
    }
}

const loadSearch = async function(req, res) {
    try {
        const user = req.user

        res.render('UserSearch', { user })
    } catch (e) {
        res.status(500).send("somthing went wrong while loading page")
    }
}

const loadClassDetails = async function(req, res) {
    try {
        const user = req.user

        res.render('UserClassDetails', { user })
    } catch (e) {
        res.status(500).send("somthing went wrong while loading page")
    }
}
const loadClassRoom = async function(req, res) {
        try {

            const classRoom = await ClassRoom.findOne({ name: req.body.name }).populate('owner', 'name email age')
                //classRoom.populate('owner', 'name email age').execPopulate()

            if (!classRoom) {
                return alert('Class room not found')
            }

            res.send(classRoom)
        } catch (e) {
            res.status(500).send("somthing went wrong")
        }
    }
    // const Followers = async function(req, res) {
    //     try {
    //         const user = req.user
    //         res.render('followers', {
    //             user
    //         })
    //     } catch (e) {
    //         res.status(500).send("somthing went wrong")
    //     }
    // }

// const Following = async function(req, res) {
//     try {
//         const user = req.user
//         res.render('following', {
//             user
//         })
//     } catch (e) {
//         res.status(500).send("somthing went wrong")
//     }
// }

// const Searchuser = async function(req, res) {
//     try {
//         const user = req.user
//         res.render('search', {
//             user
//         })
//     } catch (e) {
//         res.status(500).send("somthing went wrong")
//     }
// }

// const getData = async function(req, res) {
//     try {
//         const user = req.user
//         res.send(user)
//     } catch (e) {
//         res.status(500).send("somthing went wrong")
//     }
// }


const loadHome = async function(req, res) {
    var following = Object.keys(req.user.following)

    const documents = await Document.find({ $or: [{ $and: [{ classRoomId: { $in: following } }, { teacherId: { $exists: true } }] }, { $and: [{ classRoomId: { $in: following } }, { studentId: { $nin: req.user._id } }] }] }).populate('teacherId', 'name email age').populate('studentId', 'name email age')

    documents.forEach(element => {
        if (element.teacherId) {
            element.populate('teacherId', 'name email age').execPopulate()
        } else {
            element.populate('studentId', 'name email age').execPopulate()
        }
    });
    //console.log(documents);
    res.send(documents)
        // $and: [{ classRoomId: { $in: following } }, { teacherId: { $exists: true } }]
        // $and: [{ classRoomId: { $in: following } }, { studentId: { $nin: req.user._id } }]
        // $or: [ { $and: [{ classRoomId: { $in: following } }, { teacherId: { $exists: true } }] }, { $and: [{ classRoomId: { $in: following } }, { studentId: { $nin: req.user._id } }] } ]
        //const userFollowers = await User.find({ _id: { $in: followers } }, 'firstName lastName twitterHandle')
}







module.exports = {
    Register: Register,
    Login: Login,
    Profile: Profile,
    Logout: Logout,
    searchClassRoom,
    UpdateProfile: UpdateProfile,
    DeleteProfile: DeleteProfile,
    //uploadAvatar: uploadAvatar,
    Upload,
    UploadDocument,
    loadSearch,
    getDocument,
    loadClassDetails,
    loadClassRoom,
    //deleteAvatar: deleteAvatar,
    //getAvatar: getAvatar,
    //userFollow: userFollow,
    showHomePage,
    classRoomFollow,
    loadHome,
    //showFollower,
    //Followers,
    //Following,
    //Searchuser,
    //getData
}