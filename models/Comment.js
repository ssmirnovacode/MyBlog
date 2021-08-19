const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    postId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Post'
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    comment: {
        type: String,
        required: true
    },
/*     replies: [
        {
            userId: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'User'
            },
            reply: {
                type: String,
                required: true
            },
            createdAt: { 
                type: Date, 
                default: Date.now 
            }
        }
    ] */
});

module.exports = mongoose.model('Comment', commentSchema);