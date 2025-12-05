import ArrivalModel from "../models/Newarrivalmodel.js";

export const getAllproduct = async (req, res) => {
    try {
        const products = await ArrivalModel.find({});
        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const newArrival = async (req, res) => {
    try {
        const products = await ArrivalModel.find({ isNewArrival: true }).limit(4);
        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const newProduct = async (req, res) => {
    try {
        // const { productname, price, category, description, originalprice, imageurl,isNewArrival } = req.body
        // if (!productname || !price || !category) {
        //     return res.status(400).send({
        //         success:false,
        //         message: "Send All required Fields"
        //     })
        // }
        // const createproduct = {
        //     productname,
        //     price,
        //     category,
        //     description,
        //     originalprice,
        //     imageurl,
        //     isNewArrival
        // }
        const product = new ArrivalModel(req.body);
       await product.save()
        res.status(200).json({
            success:true,
            message:"product update successfully",
            data:product
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


export const changeproduct = async (req, res) => {
    try {
        const{id}=req.params
        const product = await ArrivalModel.findByIdAndUpdate(id,req.body,{ new: true }
        );
        res.status(200).json({
            success:true,
            message: "successfully update the product",
            data: product
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const removeproduct = async (req, res) => {
    try {
        const {id}=req.params
        const product = await ArrivalModel.findByIdAndDelete(id);
        res.json({
            success:true,
            message: 'Product deleted successfully',
            data: product
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}