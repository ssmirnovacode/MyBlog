const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    text: {
        type: String,
        required: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: {
        type: Date
    },
    likes: [{
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        count: Number
    }]
/*     comments: [
        {
            commentId: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'Comment'
            }
        }
    ] */
});

module.exports = mongoose.model('Post', postSchema);