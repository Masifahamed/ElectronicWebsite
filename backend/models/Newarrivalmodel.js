import mongoose from "mongoose";


const ArrivalSchema = new mongoose.Schema({
    productname: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    originalprice: {
        type: Number,
        required: true
    },
    imageurl: {
        type: String,
        required: true
    },
    category:{
        type:String,
    },
    isNewArrival:{
        type:Boolean,
        default:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

})

const ArrivalModel=mongoose.model("NewArrival",ArrivalSchema)

export default ArrivalModel;