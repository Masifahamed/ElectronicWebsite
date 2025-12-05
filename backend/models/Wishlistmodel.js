import mongoose from "mongoose"

const wishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        //type:String,
        // ref: "UserDetails",
        required: true
        // type:String,
        // required:true
    },
    product: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                //type:String,
                //ref: "ProductDetails",
                required: true
                // type:String,
                // required:true
            },
            productname: {
                type: String,
                required: [true, 'Required product name'],

            },
            price: {
                type: Number,
                required: [true, 'required product price'],
                min: [100, 'Minimum price should be 100']
            },
            discount: {
                type: Number,
                min: 0,
                max: 100,
                default: 0
            },
            originalprice: {
                type: Number,
            },
            category: {
                type: String,
                required: [true, 'eg:Electronic'],
                trim: true
            },
            stock: {
                type: Number,
                required: [true, 'Stock required'],
                min: [1, 'Stock must be at least 1']
            },
            description: {
                type: String,
                trim: true
            },
            imageurl: {
                type: String,
                required: [true, 'Required the image URL'],

            }
        }
    ]

},
    {
        timestamps: true
    }
)

const wishlistModel = mongoose.model("WishlistProduct", wishlistSchema)

export default wishlistModel