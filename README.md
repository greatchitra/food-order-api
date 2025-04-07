# 🍽️ Foodie-hub-server

The backend service for the Foodie Hub application, handling restaurant and menu data, user authentication, order processing, and payment integration.

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js  
- **Database**: MongoDB  
- **Authentication**: JSON Web Tokens (JWT)  
- **Payment Gateway**: Razorpay  
- **Utilities**: dotenv, bcryptjs, mongoose  

---

## ✨ Features

- 🔐 **User Authentication** – Secure signup/login with JWT and bcrypt  
- 🍽️ **Restaurant API** – Fetch restaurants and menu data  
- 🛒 **Order Management** – Create and track user orders  
- 💳 **Razorpay Integration** – Online payments via Razorpay  
- ⚙️ **Middleware** – Auth protection and error handling  

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/adarshbhagatjii/Foodie-hub-server.git
cd Foodie-hub-server
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory with the following:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 4. Start the Server
```bash
npm start
```
Server will run at: [http://localhost:5000](http://localhost:5000)

---

## 📂 Project Structure

```
Foodie-hub-server/
├── middleware/       # Auth and error middleware
├── models/           # Mongoose schemas
├── routes/           # API route handlers
├── utils/            # Helper functions and Razorpay config
├── .env              # Environment variables
├── server.js         # App entry point
└── package.json
```

---

## 🔑 API Endpoints

- **User**  
  - `POST /api/users/signup`  
  - `POST /api/users/login`  
  - `GET /api/users/profile` *(protected)*

- **Restaurants**  
  - `GET /api/restaurants`  
  - `GET /api/restaurants/:id`

- **Orders**  
  - `POST /api/orders` *(protected)*  
  - `GET /api/orders/:id` *(protected)*

- **Payments**  
  - `POST /api/payments/create-order` *(protected)*  
  - `POST /api/payments/verify` *(protected)*

---

## 💳 Razorpay Flow

1. Client hits `create-order` to generate a Razorpay order
2. After payment, `verify` route ensures the payment is secure
3. Order gets stored and confirmed

---

## 🤝 Contributing

1. Fork the repo  
2. `git checkout -b feature-name`  
3. Make changes and commit  
4. `git push origin feature-name`  
5. Create a Pull Request  

---

## 🙋‍♂️ Author

**Adarsh Bhagat**  
📧 [bhagatadarsh01@gmail.com](mailto:bhagatadarsh01@gmail.com)  
🌐 [GitHub](https://github.com/adarshbhagatjii)

---

## 📄 License

Licensed under the [MIT License](LICENSE).
