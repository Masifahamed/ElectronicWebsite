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
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}))

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  }
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

app.get("/",(req,res)=>{
  res.send("<h1>happy coding...</h1>")
})

//app.use("api/payment",paymentRoutes)
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Backend API is running',
    frontend: 'http://localhost:5173',
    backend: `http://localhost:${process.env.PORT}`
  })
})

// Database connection
mongoose
  .connect(process.env.MONGODB_URL)
.then(() => {
    console.log('Database Connected Successfully!');
    createDefaultadmin()
    server.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
      console.log(`frontend:http://localhost:5173`)
      console.log(`Backend product API:http://localhost:${process.env.PORT}/api/product`)
      console.log(`Backend order API:http://localhost:${process.env.PORT}/api/order`)
      console.log(`Backend User API:http://localhost:${process.env.PORT}/api/user`)
      console.log(`Backend wishlist:http://localhost:${process.env.PORT}/api/wishlist`)
      console.log(`health check:http://localhost:${process.env.PORT}/health`)
    });
  })
  .catch((err) => {
    console.log('Database connection error:', err);
  });
