const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

router.post("/create-payment", async (req, res) => {
  try {
    const { amount, currency, customer_id, customer_email, customer_phone } =
      req.body || {};

    if (!amount || !currency || !customer_id || !customer_email || !customer_phone) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const order_id = `order_${Date.now()}`;

    const request = {
      order_id,
      order_amount: amount,
      order_currency: currency,
      customer_details: {
        customer_id,
        customer_email,
        customer_phone,
      },
      order_meta: {
        return_url: `https://yourwebsite.com/payment-success?order_id=${order_id}`,
      },
    };

    const response = await axios.post(
      "https://sandbox.cashfree.com/pg/orders",
      request,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Client-Id": process.env.CASHFREE_APP_ID || "",
          "X-Client-Secret": process.env.CASHFREE_SECRET_KEY || "",
          "X-Api-Version": "2025-01-01",
        },
      }
    );

    res.json({
      orderToken: response.data.payment_session_id || "",
      order_id,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: "Internal Server Error",
      message: error.response?.data || error.message,
    });
  }
});

router.post("/verify-payment", async (req, res) => {
  try {
    const { order_id } = req.body || {};
    if (!order_id) {
      return res.status(400).json({ error: "Missing order_id" });
    }

    const response = await axios.get(
      `https://sandbox.cashfree.com/pg/orders/${order_id}`,
      {
        headers: {
          "X-Client-Id": process.env.CASHFREE_APP_ID || "",
          "X-Client-Secret": process.env.CASHFREE_SECRET_KEY || "",
        },
      }
    );

    const payments = response.data.payments || [];
    let orderStatus = "Failure";

    if (payments.some((transaction) => transaction.payment_status === "SUCCESS")) {
      orderStatus = "Success";
    } else if (payments.some((transaction) => transaction.payment_status === "PENDING")) {
      orderStatus = "Pending";
    }

    res.json({ order_id, status: orderStatus, details: response.data });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/webhook", async (req, res) => {
  try {
    const { type, data } = req.body || {};
    if (!type || !data) {
      return res.status(400).json({ error: "Missing webhook data" });
    }

    if (type === "PAYMENT_SUCCESS_WEBHOOK" && data?.payment?.payment_status === "SUCCESS") {
      console.log("Payment successful");
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;