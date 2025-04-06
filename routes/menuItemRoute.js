const express= require('express');
const menuItem = require('../models/menuItem');
const { authMiddleware } = require('../middleware/authmid');
const MenuItem = require('../models/menuItem');
const Restaurant = require('../models/restaurant');


const menuItemRouter = express.Router();


// add menu item

menuItemRouter.post('/menuItem/add/:resId', authMiddleware, async (req, res) => {
    try{
        if (!req.user || (req.user.role !== "admin" && req.user.role !== "restaurant_owner")) {
            return res.status(403).json({ message: "Access denied" });
        }
        const { name, price, category, description, imageUrl, title } = req.body;
        const menuItem= new MenuItem({restaurant:req.params.resId, name, price, category, description, imageUrl, title});
        await menuItem.save();

        await Restaurant.findByIdAndUpdate(req.params.resId, { $push: { menu: menuItem._id } });
        res.status(201).json({message: 'Menu Item Added Successfully', menuItem});
    }catch(err){
        res.status(500).json({message:'something went wrong', error:err.message})
    }
       


});


menuItemRouter.get('/menuItem/get/:resId', async (req, res) => {
        try{
                const menuItem = await MenuItem.find({restaurant: req.params.resId}).populate('restaurant',['restaurantName']);
                res.status(200).json({menuItem});
        }catch(err){
        res.status(500).json({message:'something went wrong', error:err.message})
    }
})

menuItemRouter.put('/menuItem/update/:resId', authMiddleware, async (req, res) => {
        try{
            const resid= req.params.resId;
            const menuItem = await MenuItem.findById(resid);
            if (!menuItem) {
                return res.status(404).json({ message: "Menu Item not found" });
            }

            if (!req.user || (req.user.role !== "admin" && req.user.role !== "restaurant_owner")) {
                return res.status(403).json({ message: "Access denied" });
            }
            Object.assign(menuItem, req.body);
            await menuItem.save();
            res.status(200).json({message: 'Menu Item Updated Successfully', menuItem});
           

        }catch(err){
            res.status(500).json({message:'something went wrong', error:err.message})
        }

})

menuItemRouter.delete('/menuItem/delete/:resId', authMiddleware, async (req, res) => {
        try{
            const resid= req.params.resId;
            if (!req.user || (req.user.role !== "admin" && req.user.role !== "restaurant_owner")) {
                return res.status(403).json({ message: "Access denied" });
            }
            await MenuItem.findByIdAndDelete(resid);
            res.status(200).json({message: 'Menu Item Deleted Successfully'});


        }catch(err){
            res.status(500).json({message:'something went wrong', error:err.message})
        }
})




module.exports = menuItemRouter;