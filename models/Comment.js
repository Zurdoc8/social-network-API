const { Schema, model, Types } = require('mongoose');

const replySchema = new Schema ({
    replyId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId()
    },
    replyBody: {
        type: String,
        required: true
    },
    writtenBy: {
        type: String,
        trim: true,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },   
},
{
    toJSON: {
        getters: true
    }
});

const commentSchema = new Schema ({
    writtenBy: {
        type: String,
        required: true
    },
    commentBody: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
    },
    replies: [replySchema]
},
{
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
});

commentSchema.virtual('replyCount').get(function() {
    return this.replies.length;
});

const Comment = model('Comment', commentSchema);

module.exports = Comment;