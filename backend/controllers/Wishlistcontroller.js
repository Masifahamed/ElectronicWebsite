import wishlistModel from "../models/Wishlistmodel.js";


export const addtowishlist = async (req, res) => {
  try {
    const { 
      userId, 
      productId, 
      imageurl, 
      productname, 
      price, 
      discount, 
      originalprice, 
      category, 
      stock, 
      description 
    } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: "userId and productId are required" });
    }

    // Find user's wishlist
    let list = await wishlistModel.findOne({ userId });

    // If no wishlist exists → create new one
    if (!list) {
      const newlist = await wishlistModel.create({
        userId,
        product: [{
          productId,
          imageurl,
          productname,
          price,
          discount,
          originalprice,
          category,
          stock,
          description
        }]
      });

      return res.status(200).json({
        message: "Wishlist created successfully",
        data: newlist
      });
    }

    // Check if product already exists
    const exists = list.product.some(
      (item) => item.productId.toString() === productId
    );

    if (exists) {
      return res.status(200).json({
        message: "Product already in wishlist",
        exists: true
      });
    }

    // Add product if not exists
    list.product.push({
      productId,
      imageurl,
      productname,
      price,
      discount,
      originalprice,
      category,
      stock,
      description
    });

    await list.save();

    return res.status(200).json({
      message: "Added to wishlist successfully",
      data: list
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    });
  }
};


export const getWishlist = async (req, res) => {
  try {

    const wishlist = await wishlistModel.find({})

    if (!wishlist) {
      return res.status(404).json({
        message: "No Wishlist found"
      })
    }
    return res.status(200).json({
      message: "Wishlist created successfully",
      count: wishlist.length,
      data: wishlist
    });

  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getsinglewishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    const wishlist = await wishlistModel.findOne({ userId })
    if (!wishlist) {
      return res.status(404).json({
        message: "Wishlist is not found"
      })
    }
    return res.status(200).json({
      message: "User wishlist fetched successfully",
      data: wishlist
    })
  } catch (err) {
    return res.status(500).json({
      message: err.message
    })
  }
}

export const removeWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const wishlist = await wishlistModel.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found for this user" });
    }
    const exists = wishlist.product.some((item) => item.productId.toString() === productId.toString())

    if (!exists) {
      return res.status(404).json({
        message: "Product is not found in the wishlist"
      })
    }

    wishlist.product = wishlist.product.filter(
      (item) => item.productId.toString() !== productId.toString());

    await wishlist.save();

    return res.status(200).json({
      message: "product Removed from wishlist",
      count: wishlist.product.length,
      data: wishlist
    });

  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
