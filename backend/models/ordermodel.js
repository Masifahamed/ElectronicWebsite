import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"UserDetails",
        required: true
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        productname: {
            type: String,

        },
        price: {
            type: Number,

        },
        originalprice: {
            type: Number,

        },
        discount: {
            type: Number,

        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        imageurl: {
            type: String
        },
        category: {
            type: String,
            default: "Electronics"
        },
        rating: {
            type: Number,
            min: 1
        }
    }],
    ordersummary: {
        items: {
            type: Number,
            required: true,
            min: 1 // Should be at least 1 item
        },
        subtotal: {
            type: Number,
            required: true, // Consider making this required
            min: 0
        },  
        saving: {
            type: Number,
            default: 0, // Add default value

        },
        tax: {
            type: Number,
            // required: true, // Consider making this required
            min: 0
        },
        totalprice: {
            type: Number,
            required: true, // This should definitely be required

        },
        paymentmethod: {
            type: String,
            enum: ["online Payment", "Cash on delivery"],
            required: true
        },
        status: {
            type: String,
            enum: ["Active", "Shipped","Packing", "Delivered", "Cancelled","Pending"], // Consider using enum for status
            default: "Active"
        },
        date: {
            type: Date,
            default: Date.now
        },
        address: {
            type: String,
            required: [true, "Enter your address"],
            trim: true // Remove extra spaces
        }
    },
    paymentInfo: {
        razorpay_order_id: {
            type: String
        },
        razorpay_payment_id: {
            type: String
        },
        razorpay_signature: {
            type: String
        },
        status: {
            type: String,
            enum:["pending","paid","failed"],
            default: "pending"
        }
    }

    // Consider adding user reference

}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

const orderModel = mongoose.model("Orderdetails", orderSchema);
export default orderModel;


//     type:[
//     {
//     productId:{
//     type:mongoose.Schema.Types.ObjectId,
//     ref:'Product'
// },
//     name: String,
//     price: Number,
//     quantity: Number,

// }],

// userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true
// },

// import mongoose from 'mongoose'

// //Address Schema
// const addressSchema=new mongoose.Schema({
//   fullName:{
//     type:String,
//     required:[true,"Full name is required"]
//   },
//   phone:{
//     type:String,
//     required:[true,"Phone number is required"]
//   },
//   email:{
//     type:String,
//     required:[true,"Email is required"]
//   },
//   street:{
//     type:String,
//     required:[true,"Street address is required"]
//   },
//   city:{
//     type:String,
//     required:[true,"City is required"]
//   },
//   state:{
//     type:String,
//     required:[true,"Pincode is required"]
//   },
//   pincode:{
//     type:String,
//     required:[true,"Pincode is required"]
//   },
//   landmark:{
//     type:String
//   },
// })

// const orderItemSchema=new mongoose.Schema({
//   productId:{
//     type:mongoose.Schema.Types.ObjectId,
//     ref:"product",
//     required:true
//   },
//   productName:{
// type:String,
// required:true
//   },
//   image
// })