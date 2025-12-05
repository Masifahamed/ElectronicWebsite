import mongoose from "mongoose";

const heroSchema = new mongoose.Schema({
    productname: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    originalprice: {
        type: Number
    },
    discount: {
        type: Number,
        default: 0
    },
    category: {
        type: String
    },
    stock: {
        type: Number,
        default: 0
    },
    imageurl: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,

    },
    views: {
        type: Number
    },
    date: {
        type: Date,
        default: Date.now
    },
    isHeroOnly: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const HeroModel = mongoose.model("HeroProduct", heroSchema);

export default HeroModel;
