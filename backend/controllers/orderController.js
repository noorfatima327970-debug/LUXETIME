import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const createOrder = async (req, res) => {
  try {
    const { customer, items } = req.body;

    if (
      !customer ||
      !customer.fullName?.trim() ||
      !customer.email?.trim() ||
      !customer.phone?.trim() ||
      !customer.address?.trim() ||
      !customer.city?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please complete all checkout details.",
      });
    }

    const email = customer.email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email.",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty.",
      });
    }

    if (items.length > 30) {
      return res.status(400).json({
        success: false,
        message: "Too many items in one order.",
      });
    }

    const orderItems = [];

    for (const item of items) {
      const productId = Number(item.productId);
      const quantity = Number(item.quantity);

      if (
        !Number.isSafeInteger(productId) ||
        !Number.isSafeInteger(quantity) ||
        quantity < 1 ||
        quantity > 20
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid cart items.",
        });
      }

      const product = await Product.findOne({ id: productId });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${productId} not found.`,
        });
      }

      orderItems.push({
        productId: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity,
      });
    }

    const totalAmount = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: req.user?._id || null,

      customer: {
        fullName: customer.fullName.trim(),
        email,
        phone: customer.phone.trim(),
        address: customer.address.trim(),
        city: customer.city.trim(),
      },

      items: orderItems,
      totalAmount,
      paymentMethod: "Demo Checkout",
    });

    res.status(201).json({
      success: true,
      message: "Demo order placed successfully!",
      order: {
        _id: order._id,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error("Create order error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to place order.",
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Unable to load orders.",
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(200);

    res.json({
      success: true,
      orders,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Unable to load admin orders.",
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const allowedStatuses = [
      "Pending",
      "Processing",
      "Completed",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status.",
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Unable to update order.",
    });
  }
};