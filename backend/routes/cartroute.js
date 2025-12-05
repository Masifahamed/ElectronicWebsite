import express from 'express'
import { addproducttocart, decreaseQuantity, deletecartitem, deleteproductfromcart, getcartitem, getsinglecartitem, increaseQuantity } from '../controllers/CartController.js'

const cartroute=express.Router()

cartroute.post("/add",addproducttocart)
cartroute.get("/get",getcartitem)
cartroute.get("/single/:userId",getsinglecartitem)
cartroute.delete("/delete/:userId/:productId",deleteproductfromcart)
cartroute.post('/decrease',decreaseQuantity)
cartroute.post('/increase',increaseQuantity)
cartroute.delete('/deletecart/:userId',deletecartitem)


export default cartroute;
