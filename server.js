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
    //origin: "https://foodie-hub-sigma.vercel.app", 
      origin: "http://localhost:5173", 
     credentials: true, // Allows cookies to be sent
     methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allowed HTTP methods
     allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
 }));
 

 app.use((req, res, next) => {
     res.header("Access-Control-Allow-Origin", "http://localhost:5173");
     res.header("Access-Control-Allow-Credentials", "true");
     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
     res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
     next();
 });

 //app.use("/api", authRouter);
// after app and middleware setup but before routers
app.get('/', (req, res) => {
  res.send('API is working!');
});


app.use('/', authRouter);
app.use('/', restaurantRouter);
app.use('/', menuItemRouter);
app.use('/', orderRouter);








mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error(err));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});

