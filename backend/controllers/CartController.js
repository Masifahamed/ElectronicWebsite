import CartModel from "../models/Cartmodel.js";



export const addproducttocart = async (req, res) => {
    try {
        const {
            userId, productId, imageurl, productname,
            price, discount, rating, category, quantity, originalprice
        } = req.body;

        if (!userId || !productId) {
            return res.status(400).json({ message: "userId and productId are required" });
        }

        let cart = await CartModel.findOne({ userId });

        // Create new cart
        if (!cart) {
            const newCart = await CartModel.create({
                userId,
                cartlist: [{
                    productId,
                    imageurl,
                    productname,
                    price,
                    discount,
                    rating,
                    category,
                    originalprice,
                    quantity: quantity || 1
                }]
            });
            console.log(cart)
            return res.status(200).json({
                message: "Cart created and product added",
                data: newCart
            });
        }


        // Check product exist
        const existingProduct = cart.cartlist.find(
            (item) => item.productId.toString() === productId);

        if (existingProduct) {
            existingProduct.quantity += 1;
            await cart.save();
            return res.status(200).json({
                message: "Product already in cart. Quantity increased.",
                data: cart
            });

        }
        else {
            // Add new product
            cart.cartlist.push({
                productId,
                imageurl,
                productname,
                price,
                discount,
                rating,
                originalprice,
                category,
                quantity: quantity || 1
            });
        }
        await cart.save();

        return res.status(200).json({
            message: "Product added to cart",
            data: cart
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
};


export const decreaseQuantity = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        if (!userId || !productId) {
            return res.status(400).json({ message: "userId and productId are required" });
        }

        // Find user cart
        let cart = await CartModel.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Check product in cart
        const product = cart.cartlist.find((item) => item.productId.toString() === productId.toString());

        if (!product) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        // Decrease quantity
        if (product.quantity > 1) {
            product.quantity -= 1;
        } else {
            // If qty = 1, remove item completely
            cart.cartlist = cart.cartlist.filter((item) => item.productId !== productId);
        }

        await cart.save();

        return res.status(200).json({
            message: "Quantity updated",
            data: cart
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Something went wrong",
            error: err.message
        });
    }
};

export const increaseQuantity = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        if (!userId || !productId) {
            return res.status(400).json({ message: "userId and productId are required" });
        }

        // Find cart
        let cart = await CartModel.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Find product
        const product = cart.cartlist.find((item) => item.productId.toString() === productId.toString());

        if (!product) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        // Increase quantity
        product.quantity += 1;

        await cart.save();

        return res.status(200).json({
            message: "Quantity increased",
            data: cart
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Something went wrong",
            error: err.message
        });
    }
};


export const getcartitem = async (req, res) => {
    try {


        const allcart = await CartModel.find({});

        if (!allcart) {
            return res.status(404).json({ message: "No cart found" });
        }

        return res.status(200).json({
            message: "Cart fetched successfully",
            count: allcart.length,
            data: allcart
        });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};



export const getsinglecartitem = async (req, res) => {
    try {
        const { userId } = req.params;

        const cart = await CartModel.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        return res.status(200).json({
            message: "User cart fetched successfully",
            data: cart
        });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};




export const deleteproductfromcart = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        // Validate
        if (!userId || !productId) {
            return res.status(400).json({ message: "userId and productId are required" });
        }

        // Find cart
        const cart = await CartModel.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found for this user" });
        }

        // Check if product exists in cart
        const exists = cart.cartlist.some((item) => item.productId.toString() === productId);

        if (!exists) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        // Remove product
        cart.cartlist = cart.cartlist.filter(item => item.productId.toString() !== productId);

        await cart.save();

        return res.status(200).json({
            message: "Product removed from cart",
            count: cart.cartlist.length,
            data: cart
        });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const deletecartitem = async (req, res) => {
    try {
        const { userId } = req.params

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId  is required"
            })
        }
        const cartitem = await CartModel.findOneAndDelete({ userId })

        if (!cartitem) {
            return res.status(404).json({
                success: false,
                message: "cart is not found in this user"
            })
        }
        res.status(200).json({
            success:true,
            message: "Entire Cart is removed from user successfully",
            data: []
        })
    } catch (err) {
        return res.status(500).json({
            success:false,
            message: err.message ||"something went wrong may be try later"
        })
    }
}
// export const existsproduct = async (req, res) => {
//     try {
//         const { userId, productId } = req.body
//         if (!userId || !productId) {
//             return res.status(400).json({
//                 message: "userid and productid required"
//             })

//         }
//        const existingproduct=await CartModel.findById({productId})
//        if(existingproduct){
//         return res.status(404).json({
//             message:"this product already exits"
//         })
//        }
//     }
// }