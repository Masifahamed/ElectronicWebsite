import mongoose from "mongoose"
import ProductModel from "./productmodel"
import orderModel from "./ordermodel"
const OrderCountSchema=new mongoose.Schema({
    count:orderModel.count,
    details:ProductModel
})

const OrdercountModel=mongoose.model(OrderCountSchema)

export default OrdercountModel;