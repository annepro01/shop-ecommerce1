import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";

//stripe instance
const stripe = new Stripe(process.env.STRIPE_S_KEY);

//@desc Create new order
//@route POST /api/v1/orders
//@access Private/Admin

export const createOrderCtrl = asyncHandler(async (req, res) => {
  //get the coupon
  // const { coupon } = req.query;

  // const couponFound = await Coupon.findOne({ code: coupon?.toUpperCase() });

  // if (couponFound?.isExpired) {
  //   throw new Error("Coupon has expired");
  // }

  // if (!couponFound) {
  //   throw new Error("Coupon doesn't exists");
  // }

  // //get the discount
  // const discount = couponFound?.discount / 100;

  //get the payload/data from postman (customer/user, orderItems,shippingAddress,totalPrice)
  const { orderItems, shippingAddress, totalPrice } = req.body;

  // console.log(orderItems,shippingAddress,totalPrice)

  //find the userID
  const user = await User.findById(req.userAuthId);

  //check if the user has shipping address
  if (!user?.hasShippingAddress) {
    throw new Error("Please provide shipping address");
  }

  //Check if order is not empty
  if (orderItems?.length <= 0) {
    throw new Error("There's no Order Item");
  }

  //Place/create order-save into DB
  const order = await Order.create({
    //you can use also req.userAuthId
    user: user?._id,
    orderItems,
    shippingAddress,
    // totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice,
    totalPrice,
  });

  //Update the product qty

  const products = await Product.find({ _id: { $in: orderItems } });

  orderItems?.map(async (order) => {
    const product = products?.find((product) => {
      return product?._id?.toString() === order?._id?.toString();
    });

    if (product) {
      product.totalSold += order.qty;
    }
    await product.save();
  });

  // console.log(order)

  //push the order into the user
  user.orders.push(order?._id);
  //resave
  await user.save();

  const convertedOrders = orderItems.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item?.name,
          description: item?.description,
        },
        unit_amount: item?.price * 100,
      },
      quantity: item?.qty,
    };
  });

  //make payment (Stripe)

  const session = await stripe.checkout.sessions.create({
    line_items: convertedOrders,
    metadata: {
      orderId: JSON.stringify(order?._id),
    },
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });
  res.send({
    url: session.url,
  });

  // payment webhook
  // update the user order
  // res.json({
  //     success: true,
  //     message: "Order Created",
  //     user,
  //     order
  // })
});

//@desc get all orders
//@route GET /api/v1/orders
//@access private

export const getAllordersCtrl = asyncHandler(async (req, res) => {
  //find all orders
  const orders = await Order.find().populate("user");
  res.json({
    success: true,
    message: "All orders",
    orders,
  });
});

//@desc get single order
//@route GET /api/v1/orders/:id
//@access private/admin

export const getSingleOrderCtrl = asyncHandler(async (req, res) => {
  //get the id from params
  const id = req.params.id;
  const order = await Order.findById(id);
  //send response
  res.status(200).json({
    success: true,
    message: "Single order",
    order,
  });
});

//@desc update order to delivered
//@route PUT /api/v1/orders/update/:id
//@access private/admin

export const updateOrderCtrl = asyncHandler(async (req, res) => {
  //get the id from params
  const id = req.params.id;
  //update
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      status: req.body.status,
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    success: true,
    message: "Order updated",
    updatedOrder,
  });
});

//@desc get order Statistics
//@route GET /api/v1/sales/stats
//@access private/admin

export const getOrderStatsCtrl = asyncHandler(async (req, res) => {
  //get orders stats
  const orders = await Order.aggregate([
    {
      $group: {
        _id: null,
        minimumScale: {
          $min: "$totalPrice",
        },
        totalSales: {
          $sum: "$totalPrice",
        },
        maxSale: {
          $max: "$totalPrice",
        },
        avgSale: {
          $avg: "$totalPrice",
        },
      },
    },
  ]);

  //get the date
  const date = new Date();
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  //get the sales today
  const salesToday = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: today,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalSales: {
          $sum: "$totalPrice",
        },
      },
    },
  ]);
  //send response
  res.status(200).json({
    success: true,
    message: "Sum of orders",
    orders,
    salesToday,
  });
});
