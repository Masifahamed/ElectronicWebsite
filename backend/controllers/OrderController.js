import orderModel from "../models/ordermodel.js";
import crypto from "crypto";

const emitEvent = (req, name, data) => {
  try {
    const io = req.app.get("io");
    if (io) io.emit(name, data);
  } catch (err) {
    console.log("Socket emit error:", err);
  }
};

// CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const { userId, products, ordersummary } = req.body;

    if (!userId || !products?.length || !ordersummary) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const orderId =
      "ORD-" + crypto.randomBytes(4).toString("hex").toUpperCase();

    let newOrder = await orderModel.create({
      userId,
      orderId,
      products,
      ordersummary,
    });
     newOrder=await newOrder.populate("userId","first email phone")
    // notify only this user
    emitEvent(req, "order_created", {
      userId,
      order: newOrder,
    });
    return res.status(200).json({
      success: true,
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (err) {
    return res.status(500).json({
      success: true,
      message: err.message,
    });
  }
};

// GET USER ORDERS
export const getsingleorder = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await orderModel.find({ userId }).sort({ createdAt: -1 }).populate("userId","first email phone");

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// DELETE ALL ORDERS
export const deleteorder = async (req, res) => {
  try {
    // Delete all documents
    const deleted = await orderModel.deleteMany({});

    // Fetch remaining orders (should be empty)
    const remainingOrders = await orderModel.find();

    return res.status(200).json({
      success: true,
      deletedCount: deleted.deletedCount,
      data: remainingOrders
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


// DELETE SINGLE PRODUCT IN ORDER
export const deleteproductfromorder = async (req, res) => {
  try {
    const { orderId, productId } = req.params;

    const order = await orderModel.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.products = order.products.filter(
      (p) => p.productId.toString() !== productId
    );

    // recalculate summary
    order.ordersummary.items = order.products.length;
    order.ordersummary.subtotal = order.products.reduce(
      (a, b) => a + b.price * b.quantity,
      0
    );
    order.ordersummary.totalprice =
      order.ordersummary.subtotal -
      (order.ordersummary.saving || 0) +
      (order.ordersummary.tax || 0);

    await order.save();

    emitEvent(req, "product_removed_from_order", {
      orderId: order.orderId,
      updated: order,
    });

    return res.status(200).json({ success: true, order });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// UPDATE ORDER STATUS
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await orderModel.findOneAndUpdate(
      { orderId },
      { "ordersummary.status": status },
      { new: true }
    );

    emitEvent(req, "order_status_updated", {
      userId: order.userId,
      orderId: order.orderId,
      order,
    });

    return res.status(200).json({
      success: true,
      message: "Status updated",
      data: order,

    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


export const getorderlist = async (req, res) => {
  try {
    const orderlist = await orderModel.find({}).populate("userId","first email phone")

    res.status(200).json({
      message: 'All Order items list in here',
      ordercount: orderlist.length,
      data: orderlist
    })
  } catch (err) {
    res.status(500).json({
      message: err.message
    })
  }
}

// DELETE ALL ORDERS FOR ONE USER
export const deleteOrdersForUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    // Delete all orders of that user
    const result = await orderModel.deleteMany({ userId });

    // Emit socket update to that user
    emitEvent(req, "orders_deleted_for_user", {
      userId,
      deletedCount: result.deletedCount,
    });

    return res.status(200).json({
      success: true,
      message: "All orders deleted for the user",
      deletedCount: result.deletedCount,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error while deleting orders",
      error: err.message,
    });
  }
};



export const deleteSingleOrder = async (req, res) => {
  try {
    const { userId, orderId } = req.params;

    if (!userId || !orderId) {
      return res.status(400).json({
        success: false,
        message: "userId and orderId are required",
      });
    }

    // delete specific order
    const deleted = await orderModel.findOneAndDelete({
      userId: userId,      // Mongoose automatically converts to ObjectId
      orderId: orderId
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Fetch remaining orders for admin panel refresh
    const remainingOrders = await orderModel.find()
      .populate("userId", "first last email phone");

    // Emit event to user
    emitEvent(req, "single_order_deleted", {
      userId,
      orderId
    });

    return res.status(200).json({
      success: true,
      message: "Single order deleted successfully",
      data: remainingOrders,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// // In your OrderController or a separate service
// export const updateUserProfileStats = async (userId) => {
//   try {
//     // Fetch user's orders from order API
//     const userOrders = await orderModel.find({ userId: userId });

//     // Calculate statistics
//     const totalOrders = userOrders.length;
//     const pendingOrders = userOrders.filter(order =>
//       order.status === 'processing' || order.status === 'pending'
//     ).length;
//     const deliveredOrders = userOrders.filter(order =>
//       order.status === 'delivered' || order.status === 'completed'
//     ).length;
//     const totalSpent = userOrders.reduce((sum, order) => {
//       return sum + (order.total || 0);
//     }, 0);

//     // Update user profile
//     await UserModel.findByIdAndUpdate(userId, {
//       profile: {
//         totalorder: totalOrders,
//         pending: pendingOrders,
//         delivery: deliveredOrders,
//         totalspent: totalSpent
//         // wishlist and totalvalue would be updated separately
//       }
//     });

//     console.log(`Updated profile stats for user ${userId}`);

//   } catch (error) {
//     console.error('Error updating user profile stats:', error);
//   }
// };

// export const getOrderSummary = async (req, res) => {
//   try {
//     const totalOrders = await orderModel.countDocuments();
//     const orders = (await orderModel.find().populate("product.productId")).toSorted({ data: -1 });
//     res.json({
//       totalOrders,
//       orders
//     })
//   } catch (error) {
//     res.status(500).json({ error: error.message })
//   }
// }

// export const activeOrder = async (req, res) => {
//   try {
//     const orders = await orderModel
//       .find({ status: "Active" })
//       .populate("products.productId")
//       .sort({ date: -1 });

//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const updateorderstatus = async (req, res) => {
//   await orderModel.findByIdAndUpdate(req.params.id, { status: req.body.status });
//   res.json({ message: "Status updated" });
// };