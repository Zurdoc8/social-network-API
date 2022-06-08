const { Thought, User } = require('../models');

const thoughtController = {
    //GET all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
            .populate({
                path: 'reactions',
                select: '-__v',
            })
            .populate({
                path: 'thoughts',
                select: '-__v',
            })
            .select('-__v')
            .then((dbThoughtData) => res.json(dbThoughtData))
            .catch((err) => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    //GET one thought by ID
    getThoughtById({ params }, res) {
        Thought.findOne({ _id : params.id })
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                    res.status(404).json({
                        message: "No thought matched to this ID"
                    });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch((err) => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    //CREATE thought
    createThought({ body }, res) {
        console.log(body)
        Thought.create(body)
            .then((dbThoughtData) => {
                return User.findOneAndUpdate(
                    { _id: body.userId },
                    { $push: { thoughts: dbThoughtData._id}},
                    { new: true }
                    );
            })
            .then((dbUserData) => {
                if (!dbUserData) {
                    res.status(404).json({
                        message: "No user matched to this ID"
                    });
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => res.json(err));
    },
    //UPDATE thought
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.id },
            body,
            { new: true }
        )
        .then((dbThoughtData) => {
            if (!dbThoughtData) {
                res.status(404).json({
                    message: "No thought matched to this ID"
                });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch((err) => res.status(400).json(err));
    },
    //DELETE thought
    deleteThought({ params }, res) {
        Thought.findOneAndDelete( 
            { _id: params.id }
        )
        .then((dbThoughtData) => {
            if (!dbThoughtData) {
                res.status(404).json({
                    message: "No thought matched to this ID"
                });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch((err) => res.status(400).json(err));
    },
    //ADD reaction
    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $addToSet: { reactions: body }},
            { new: true }
        )
        .then((dbThoughtData) => {
            if (!dbThoughtData) {
                res.status(404).json({
                    message: "No thought matched to this ID"
                });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch((err) => res.json(err));
    },
    //DELETE reaction
    deleteReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true }
        )
        .then((dbThoughtData) => res.json(dbThoughtData))
        .catch((err) => res.json(err));
    },
}

module.exports = thoughtController;