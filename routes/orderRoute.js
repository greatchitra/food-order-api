const express = require("express");
const crypto = require("crypto");
const { authMiddleware } = require("../middleware/authmid");
const Order = require("../models/order");
const razorpayInstance = require("../utils/razorpay");
require("dotenv").config();

const orderRouter = express.Router();

orderRouter.post("/user/order", authMiddleware, async (req, res) => {
  try {
    const { restaurant, items, totalPrice, address, paymentMethod } = req.body;

    if ( !items || !totalPrice || !address || !paymentMethod) {
      return res.status(400).json({ success: false, message: "All order fields are required" });
    }

    const order = new Order({
      user: req.user.id,
      restaurant,
      items,
      totalPrice,
      address,
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "pending" : "completed",
      status: "completed",
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("COD Order Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to place order",
      error: error.message,
    });
  }
});



orderRouter.post("/create-order", authMiddleware, async (req, res) => {
  try {
    let { amount, currency = "INR" } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    const amountInPaise = Math.round(amount * 100); 

    if (amountInPaise < 100) {
      return res.status(400).json({ success: false, message: "Minimum order amount must be ₹1 (100 paise)." });
    }

    const options = {
      amount: amountInPaise,  
      currency,
      receipt: `order_rcptid_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);
    console.log("Razorpay Order Created:", order);

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount / 100,  
      currency: order.currency,
    });
  } catch (error) {
    console.error("Razorpay Order Creation Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
      error: error.message,
    });
  }
});


orderRouter.post("/verify-payment", authMiddleware, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = req.body;
    console.log(req.body);

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment details are required" });
    }

    if (!orderData || !orderData.restaurant || !orderData.items || !orderData.totalPrice || !orderData.address) {
      return res.status(400).json({ success: false, message: "Invalid order details" });
    }

   
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");
     

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

   
    const order = new Order({
      user: req.user.id,
      restaurant: orderData.restaurant,
      items: orderData.items,
      totalPrice: orderData.totalPrice,
      address: orderData.address,
      paymentMethod: "Card",
      paymentStatus: "completed",
      status: "pending",
      razorpay_order_id, 
      razorpay_payment_id, 
    });
    console.log(order);

    await order.save();

    res.status(200).json({ success: true, message: "Payment successful & order placed", order });
  } catch (error) {
    console.error("Payment Verification Error:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
});

orderRouter.get('/user/orderHistory', authMiddleware, async(req, res)=>{
      try{
    const userId = req.user.id;
    const userorder = await Order.find({user:userId}).populate("items.menuItem", ['name', 'price', 'category']).populate('restaurant',['restaurantName']);

    res.status(200).json({ success: true, message: "Order History", userorder
      });
    }catch(err){
      console.log(err);
      res.status(500). json({ success: false, message: "Failed to fetch order history" });

    }
});

module.exports = orderRouter;

