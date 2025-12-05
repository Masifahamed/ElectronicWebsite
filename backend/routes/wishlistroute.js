import express from 'express'
import { addtowishlist, getsinglewishlist, getWishlist, removeWishlist } from '../controllers/Wishlistcontroller.js'


const wishlistroute=express.Router();

//Add product to wishlist
wishlistroute.post('/add',addtowishlist);
//get the user wishlist
wishlistroute.get("/get",getWishlist);

wishlistroute.get("/single/:userId",getsinglewishlist)
//Remove product from wishlist
wishlistroute.delete("/remove/:userId/:productId",removeWishlist)

export default wishlistroute



// const wishlistroute=express.Router()

// //add product into wishlist
// wishlistroute.post("/add",addwishlist)

// //Get all user's wishlist
// wishlistroute.get("/",getwishlist)

// //Delete the all product in the UserId from wishlist
// wishlistroute.delete("/delete/:userId",deletewishlist)
 
// //Get the singlewishlist by userId
// wishlistroute.get("/:userId",getsinglewishlist)

// //Delete the singleProduct in the UserId wishlist
// wishlistroute.delete("/:userId/:productId",singleDeleteproduct)

// export default wishlistroute

// import express from 'express';
// import { 
//   addwishlist, 
//   getMyWishlist, 
//   singleDeleteproduct 
// } from '../controllers/Wishlistcontroller.js';
// import { authMiddleware } from '../middleware/authMiddleware.js';

// const wishlistroute = express.Router();

// // All routes protected - userId comes from auth
// wishlistroute.use(authMiddleware);

// // Current user's wishlist operations
// wishlistroute.post("/add", addwishlist);
// wishlistroute.get("/:userId", getMyWishlist);
// wishlistroute.delete("/removeproduct/:productId", singleDeleteproduct);

// export default wishlistroute;
