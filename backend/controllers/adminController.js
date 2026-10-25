import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [products, orders, customers, completedOrders] =
      await Promise.all([
        Product.countDocuments(),
        Order.countDocuments(),
        User.countDocuments({ role: "user" }),
        Order.find({ status: "Completed" }).select("totalAmount"),
      ]);

    const demoRevenue = completedOrders.reduce(
      (total, order) => total + order.totalAmount,
      0
    );

    res.json({
      success: true,
      stats: {
        products,
        orders,
        customers,
        demoRevenue,
      },
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Unable to load dashboard.",
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const allowedFields = ["name", "price", "badge", "description"];

    const updates = {};

    for (const field of allowedFields) {
      if (Object.hasOwn(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No changes provided.",
      });
    }

    if (
      updates.price !== undefined &&
      (!Number.isFinite(Number(updates.price)) ||
        Number(updates.price) <= 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid price.",
      });
    }

    if (updates.price !== undefined) {
      updates.price = Number(updates.price);
    }

    const product = await Product.findOneAndUpdate(
      { id: Number(req.params.id) },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Unable to update product.",
    });
  }
};