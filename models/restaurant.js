const mongoose= require('mongoose');

const RestaurantSchema= new mongoose.Schema({
    restaurantName : String,
    restaurantAddress : String,
    cuisine : String,
    rating : Number,
    priceRange : String,
    imageUrl :String,
    description : String,
    location : String,
    menu: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem'}],
    RestaurantOwner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
}, {
    timestamps: true
});

const Restaurant = mongoose.model('Restaurant', RestaurantSchema);
module.exports = Restaurant;