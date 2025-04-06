require("dotenv").config();
const express = require('express');
const mongoose= require('mongoose');
const cookieParser = require('cookie-parser');

const authRouter = require('./routes/authRoute');
const restaurantRouter = require('./routes/restaurantRoute');
const menuItemRouter = require('./routes/menuItemRoute');
const orderRouter = require('./routes/orderRoute');

var cors = require('cors')


const app=express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));



app.use('/', authRouter);
app.use('/', restaurantRouter);
app.use('/', menuItemRouter);
app.use('/', orderRouter);








mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error(err));


app.listen(process.env.PORT, ()=>{
    console.log('Server is running on port '+process.env.PORT);
})