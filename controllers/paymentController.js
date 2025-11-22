const razorpay = require('../utills/razorpayInstance');
const crypto = require('crypto');

exports.createOrder = async (req, res) => {
  console.log('hii')
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };
    // console.log('option is ',options)
    const order = await razorpay.orders.create(options);
    // console.log(order)
    res.status(200).json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    res.status(500).json({ error: "Failed to create order" });
  }
};

exports.verifyPayment = async (req, res) => {
  const { Razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  console.log(req.body);
  
  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  hmac.update(Razorpay_order_id + "|" + razorpay_payment_id);
  const digest = hmac.digest("hex");  
  if (digest === razorpay_signature) {
    // res.redirect(`http://localhost:3000/successpayment?reffrence=${razorpay_payment_id}`)
    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ success: false, message: "Invalid signature" });
  }
};
