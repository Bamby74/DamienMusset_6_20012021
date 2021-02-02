const mongoose = require('mongoose');

const thingSchema = mongoose.Schema({
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageURL: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, defaultValue: 0 },
    dislikes: { type: Number, defaultValue: 0 },
    usersLiked: { type: Array, defaultValue: [] },
    usersDisliked: { type:Array, defaultValue: [] }
});

module.exports = mongoose.model('Thing', thingSchema);