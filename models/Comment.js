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
        ref: 'User'
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    comment: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Post', commentSchema);