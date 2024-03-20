const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    aboutyou: {
        type: String,
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    }
   
});

const books = mongoose.model('books', bookSchema);

module.exports = books