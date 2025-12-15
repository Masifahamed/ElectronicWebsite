import HeroModel from "../models/AdminHeroModel.js";

// ADD hero product
export const addHeroProduct = async (req, res) => {
    try {
        const { productname, description, price, originalprice, discount, imageurl,stock,category } = req.body;

        // Validation
        if (!productname || !price || !originalprice || !imageurl) {
            return res.status(400).json({
                success: false,
                message: "Product name, price, original price and image are required"
            });
        }

        // Limit: Only 5 hero products allowed
        const count = await HeroModel.countDocuments();
        if (count >= 5) {
            return res.status(400).json({ 
                success: false,
                message: "Maximum 5 hero products allowed" 
            });
        }

        // Add product with auto-order
        const heroProduct = await HeroModel.create({
            productname,
            description,
            price,
            originalprice,
            discount: discount || 0,
            imageurl,
            stock,
            category,
            order: count // Example: 0,1,2,3,4
        });

        res.status(200).json({
            success: true,
            message: "Hero product added successfully",
            data: heroProduct
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Server Error", 
            error 
        });
    }
};


// GET all hero products
export const getHeroProducts = async (req, res) => {
    try {
        const products = await HeroModel.find().sort({ order: 1 });  
        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// GET all hero products
export const getsingleProducts = async (req, res) => {
    try {
        const {id}=req.params
        const products = await HeroModel.findById(id).sort({ order: 1 });  
        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};


// UPDATE hero product
export const updateHeroProduct = async (req, res) => {
    try {
        const updated = await HeroModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({
            success: true,
            message: "Hero product updated",
            data: updated
        });
    } catch (err) {
        res.status(500).json({ message: "Error updating product", error: err });
    }
};


// UPDATE Order for drag & drop sorting
export const updateOrder = async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ message: "Invalid items format" });
        }

        for (const item of items) {
            await HeroModel.findByIdAndUpdate(item.id, { order: item.order });
        }

        res.json({ 
            success: true,
            message: "Order updated successfully" 
        });

    } catch (err) {
        res.status(500).json({ message: "Error updating order", error: err });
    }
};


// DELETE hero product
export const deleteHeroProduct = async (req, res) => {
    try {
        const { id } = req.params;

        await HeroModel.findByIdAndDelete(id);

        // Reorder remaining
        const products = await HeroModel.find().sort({ order: 1 });
        for (let i = 0; i < products.length; i++) {
            await HeroModel.findByIdAndUpdate(products[i]._id, { order: i });
        }

        res.json({
            success: true,
            message: "Hero product removed"
        });

    } catch (err) {
        res.status(500).json({ message: "Error deleting product", error: err });
    }
};


// CLEAR all hero products
export const clearHeroProducts = async (req, res) => {
    try {
        await HeroModel.deleteMany({});
        res.json({ 
            success: true,
            message: "All hero products cleared" 
        });
    } catch (err) {
        res.status(500).json({ message: "Error clearing products", error: err });
    }
};
