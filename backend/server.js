import express from 'express';
import mongoose from "mongoose";
import cors from 'cors';
//import { MONGODB_URL,PORT } from './config.js';
import productroute from './routes/productroute.js';
import orderroute from './routes/orderroute.js';
import http from 'http'
import { Server } from 'socket.io';
import wishlistroute from './routes/wishlistroute.js';
import cartroute from './routes/cartroute.js';
import dotenv from 'dotenv'
import loginroutes from './routes/loginroutes.js';
//import UserModel from './models/usermodel.js';
import { createDefaultadmin } from './controllers/authController.js';
import userroute from './routes/UserRoute.js';
import herorouter from './routes/adminheroroute.js';
import posterrouter from './routes/posterrouter.js';
import Arrivalroute from './routes/Arrivalroute.js';
import path from 'path';

//import paymentRoutes from './routes/paymentRoutes.js';

//import paymentRoutes from './routes/paymentRoutes.js';

dotenv.config()
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.use(cors({
  origin: 'https://frontend-e-commerce-website.onrender.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}))

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://frontend-e-commerce-website.onrender.com",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials:true
  }
})

process.on("unhandledRejection",(err)=>{
  console.log("this is went something wrong:",err)
})
// Routes
app.use('/api/product', productroute);
app.use('/api/order', orderroute)
app.use('/api/user', userroute)
app.use('/api/wishlist', wishlistroute)
app.use('/api/cart', cartroute)
app.use("/api/login", loginroutes)
app.use('/api/hero', herorouter)
app.use('/api/poster', posterrouter)
app.use("/uploads", express.static(path.join(process.cwd(),"uploads")));
app.use('/api/arrival',Arrivalroute)
//app.use('/api/payment',paymentRoutes)
app.set('io',io);

io.on('connection', (socket) => {
  socket.on("join_room",(userId)=>{
    socket.join(userId)
  })
  console.log('Socket connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});



//app.use("api/payment",paymentRoutes)
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Backend API is running',
    frontend: 'https://frontend-e-commerce-website.onrender.com',
    backend: `https://electronicwebsite-backend.onrender.com`
  })
})

// Database connection
mongoose
  .connect(process.env.MONGODB_URL)
.then(async() => {
    console.log('Database Connected Successfully!');
    await createDefaultadmin()
    server.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log('Database connection error:', err);
  });
