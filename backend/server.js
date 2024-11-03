const express = require("express");
var cors = require("cors");
require("dotenv").config();
const Razorpay = require("razorpay");
const crypto = require("crypto");

const app = express();

const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

app.post("/order", async (req, res) => {
  try {
    const razorpayVar = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    if (!req.body) {
      return res.status(400).json({ message: "Please provide user data" });
    }
    const userData = req.body;

    const orderDetail = await razorpayVar.orders.create(userData);

    if (!orderDetail) {
      return res.status(400).json({ message: "Failed to create order" });
    } else {
      return res.status(200).json({
        message: "Order created successfully",
        order: orderDetail,
        success: true,
      });
    }
  } catch (err) {
    console.log("err.message==>", err.message);
    res
      .status(400)
      .json({ message: "Something related Payment error", success: false });
  }
});

// order verification

app.post("/verify", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  console.log("req.body", req.body);

  const sign = razorpay_order_id + "|" + razorpay_payment_id;

  try {
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    console.log(razorpay_signature === expectedSign);

    const isAuthenticated = expectedSign === razorpay_signature;

    if (isAuthenticated) {
      return res
        .status(200)
        .json({ message: "Payment verified successfully", success: true });
    } else {
      return res
        .status(400)
        .json({ message: "Payment verification failed", success: false });
    }
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`we are on port number ${port}`);
});

// ----------- getting data from frontend

// app.post("/validate", async (req, res) => {
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
//     req.body;

//   const sha = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
//   // order_id + " | " + razorpay_payment_id

//   sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);

//   const digest = sha.digest("hex");

//   if (digest !== razorpay_signature) {
//     return res.status(400).json({ msg: " Transaction is not legit!" });
//   }

//   res.json({
//     msg: " Transaction is legit!",
//     orderId: razorpay_order_id,
//     paymentId: razorpay_payment_id,
//   });
// });
