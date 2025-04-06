const express = require('express');

const {authMiddleware} = require('../middleware/authmid');
const Restaurant = require('../models/restaurant');


const restaurantRouter = express.Router();


// add new Restaurant 

restaurantRouter.post("/restaurant/add", authMiddleware, async (req, res) => {
    try {
       const userId= req.user._id;
       const { restaurantName, restaurantAddress, cuisine, rating, priceRange, imageUrl, description, location, menu } = req.body;
        if (!req.user || (req.user.role !== "admin" && req.user.role !== "restaurant_owner")) {
            return res.status(403).json({ message: "Access denied" });
        }

        
        const newRestaurant = new Restaurant({
            restaurantName,
            restaurantAddress,
            cuisine,
            rating,
            priceRange,
            imageUrl,
            description,
            location,
            menu,
            RestaurantOwner: userId
        });
        const data = await newRestaurant.save();

        res.status(201).json({ message: "Restaurant added successfully", data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

// get all restaurants
restaurantRouter.get('/restaurant/viewAll',authMiddleware, async(req,res)=>{
    try{
        const data = await Restaurant.find().populate({
            path: 'menu',
            populate: {
                path: 'restaurant',
                select: 'restaurantName'
            }
        });
        res.status(200).json({message:"all restaurants",data:data})

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
})

// find restaurant by id 
restaurantRouter.get('/restaurant/view/:resId', async(req,res)=>{
    try{
        const resId = req.params.resId;
        const restaurant = await Restaurant.findById(resId);
        if(!restaurant){
            return res.status(404).json({message:"Restaurant not found"})
            }
            res.status(200).json({message:"Restaurant found",data:restaurant})
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
})
// update restaurant by id

restaurantRouter.put('/restaurant/update/:resid', authMiddleware, async(req,res)=>{
    try{
        const resid = req.params.resid;
        const restaurant = await Restaurant.findById(resid);
        if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
    
         
        if (!req.user || (req.user.role !== "admin" && req.user.role !== "restaurant_owner")) {
            return res.status(403).json({ message: "Access denied" });
        }

        Object.assign(restaurant, req.body);
       const data = await restaurant.save();
        res.status(200).json({message:"Restaurant updated successfully",data:data})

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }

});

restaurantRouter.delete('/restaurant/delete/:resid', authMiddleware, async(req,res)=>{
    try{
        const resid = req.params.resid;
        if (!req.user || (req.user.role !== "admin")) {
            return res.status(403).json({ message: "Access denied" });
        }
        const restaurant = await Restaurant.findByIdAndDelete(resid);
        res.status(200).json({message:"Restaurant deleted successfully"})


    }catch(err){
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
})







module.exports = restaurantRouter;