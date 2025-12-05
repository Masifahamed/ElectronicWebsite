import express from 'express'

import { createOrder,deleteorder,deleteOrdersForUser, deleteproductfromorder, deleteSingleOrder, getorderlist,getsingleorder, updateOrderStatus } from '../controllers/OrderController.js'

const orderroute=express.Router()

orderroute.post('/createorder', createOrder);
orderroute.get('/orderlist', getorderlist);
orderroute.get('/:userId', getsingleorder);
orderroute.put('/updatestatus/:orderId', updateOrderStatus);
orderroute.delete('/deleteorder', deleteorder);
orderroute.delete('/deleteproduct/:orderId/:productId', deleteproductfromorder);
orderroute.delete("/singleorder/:userId",deleteOrdersForUser)
orderroute.delete("/deletesingleorder/:userId/:orderId",deleteSingleOrder)

export default orderroute;


// orderroute.get("/order-summary",getOrderSummary)
// orderroute.get("/active-order",activeOrder)
// orderroute.put("update-status",updateorderstatus)