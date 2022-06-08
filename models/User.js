const { Schema, model } = require('mongoose');

const userSchema = new Schema ({
        userName: {
            type: String,
            trim: true,
            unique: true,
            required: true
        },

        email: {
            type: String,
            unique: true,
            required: true,
            match: [/.+@.+\..+/, 'Please enter a valid e-mail address']
        },

        thoughts: [{
            type: Schema.Types.ObjectId,
            ref: 'Thought'
        }],

        friends: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
    },
        {
            toJSON: {
                virtuals: true,
            },
            getters: true,

            id: false
        }
);

userSchema.virtual('friendCount').get(function () {
    return this.friends.length;
})

const User = model('User', userSchema);

module.exports = User;