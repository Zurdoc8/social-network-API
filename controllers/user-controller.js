const { User } = require('../models');

const userController = {
    //GET all
    getAllUsers(req, res) {
        User.find({})
        .populate({
            path: 'thoughts',
            select: '-__v',
        })
        .select('-__v')
        .sort({
            _id: -1
        })
        .then((dbUserData) => res.json(dbUserData))
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    getUserById({ params }, res) {
        User.findOne({
            _id: params.id
        })
        .populate({
            path: 'thoughts',
            select: '-__v',
        })
        .select('-__v')
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({
                    message: "No user matched with this ID"
                });
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => {                      
            console.log(err);
            res.status(400).json(err);
        });
    },
    //CREATE user
    createUser({ body }, res) {
        console.log(body);
        User.create(body)
            .then((dbUserData) => res.json(dbUserData))
            .catch((err) => res.status(400).json(err));
    },
    //UPDATE user
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({
            _id: params.id
        }, body, {
            new: true
        })
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({
                    message: "No user matched with this ID"
                });
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => res.status(400).json(err));
    },
    //DELETE user
    deleteUser({ params }, res) {
        User.findOneAndDelete({
            _id: params.id
        })
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({
                    message: "No user matched with this ID"
                });
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => res.status(400).json(err));
    },
    //ADD friend
    addFriend({ params }, res) {
        User.findByIdAndUpdate(
            { _id: params.id}, 
            { $addToSet: { friends: params.friendsId} },
            { new: true })
            
            .then((dbUserData) => res.json (dbUserData))
            .catch((err) => res.status(400).json(err));
    },
    //REMOVE friend
    removeFriend({ params }, res) {
        User.findOneAndRemove(
            { _id: params.id },
            { $pull: { friends: params.friendsId } },
            { new: true })

            .then((dbUserData) => {
                if (!dbUserData) {
                    res.status(404).json({
                        message: "No user matched with this ID"
                    });
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => res.status(400).json(err));
    },
};

module.exports = userController;