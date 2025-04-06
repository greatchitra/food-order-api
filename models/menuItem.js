const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    title: String,
    category: String,
    name: String,
    price: Number,
    description: String,
    imageUrl: String,
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
},{
    timestamps: true
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
module.exports = MenuItem;