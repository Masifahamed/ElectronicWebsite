import mongoose from 'mongoose'

const cartSchema = new mongoose.Schema(
    {
        userId: {
            // type: String,
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserDetails",
            required: true
        },
        cartlist: [
            {
                productId: {
                    //type:String,
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "ProductDetails",
                    required: true
                },
                imageurl: {
                    type: String,
                },
                productname: {
                    type: String,
                },
                price: {
                    type: Number
                },
                discount: {
                    type: Number
                },
                rating: {
                    type: Number
                },
                category: {
                    type: String
                },
                quantity: {
                    type: Number
                },
                originalprice:{
                    type:Number,
                }
                
            }
        ]
    }
)

const CartModel = mongoose.model("CartItems", cartSchema)

export default CartModel;


