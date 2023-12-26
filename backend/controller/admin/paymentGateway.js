const axios = require("axios");
const sha256 = require("sha256");
const paymentGateway = require("../../model/admin/paymentGateway");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");

class Paymentgetway {
  async initiatePayment(req, res) {
    const transactionId = uuidv4();
    console.log("id", transactionId);

    try {
      const base64 = Buffer.from(
        JSON.stringify({
          merchantId: "M1KSO0OLXGKZ",
          merchantTransactionId: transactionId,
          merchantUserId: "asfnjk212",
          amount: 235900,
          redirectUrl: "",
          redirectMode: "POST",
          callbackUrl: `http://localhost:8000/api/payment/status/M1KSO0OLXGKZ/${transactionId}`,
          mobileNumber: "8526190332",
          paymentInstrument: {
            type: "PAY_PAGE",
          },
        })
      ).toString("base64");
      // console.log("base64===", base64);

      const sha256encode =
        sha256(base64 + "/pg/v1/payc3fc2cbb-e95e-490a-97ed-05533e9f73e3") +
        "###1";
      // console.log("sha256encode===", sha256encode);

      return res.status(200).json({
        success: true,
        message: "Payment initiated successfully",
        base64: base64,
        sha256encode: sha256encode,
        merchantId: "M1KSO0OLXGKZ",
        merchantTransactionId: transactionId,
      });
    } catch (error) {
      console.error("Error initiating payment:", error);
      res.status(500).json({
        success: false,
        message: "Payment initiation failed. Please try again.",
      });
    }
  }

  async checkTransactionStatus(req, res) {
    const { merchantId, merchantTransactionId, userId } = req.params;
    const saltKey = "c3fc2cbb-e95e-490a-97ed-05533e9f73e3";
    const url = `/pg/v1/status/${merchantId}/${merchantTransactionId}`;
    const xVerify =
      crypto
        .createHash("sha256")
        .update(url + saltKey)
        .digest("hex") +
      "###" +
      1;

    try {
      const response = await axios.get(
        `https://api.phonepe.com/apis/hermes${url}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-VERIFY": xVerify,
            " X-MERCHANT-ID": "M1KSO0OLXGKZ",
          },
        }
      );

      response.data.data.paymentInstrument = JSON.stringify(
        response.data.data.paymentInstrument
      );

      // Save the responseData to MongoDB
      if (response.data.code === "PAYMENT_SUCCESS") {
        const responseData = new paymentGateway({
          userId: userId,
          code: response.data.code,
          data: response.data.data,
          message: response.data.message,
          success: response.data.success,
        });
        await responseData.save();
      }

      return res.status(200).json({
        success: true,
        responseData: response.data,
      });
      return res.status(500).json({
        success: false,
        responseData: response.data,
      });
    } catch (error) {
      console.error("Error checking transaction status:", error);
      res.status(500).json({
        success: false,
        message: "Failed to check transaction status.",
      });
    }
  }

  async getpaymentstatusByUserId(req, res) {
    let userId = req.params.userId;
    try {
      const status = await paymentGateway.find({
        userId,
      });

      if (status) {
        return res.json({ getPaymentStatus: status });
      } else {
        return res.json({ getPaymentStatus: [] });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Failed to fetch user status" });
    }
  }
  async getAllPayment(req, res) {
    try {
      const payment = await paymentGateway.find({});
      if (payment) {
        res.status(200).json({ success: payment });
      } else {
        res.status(404).json({ error: "something went wrong" });
      }
    } catch (error) {
      console.log("error:", error);
    }
  }
}

const paymentgetwaycontroller = new Paymentgetway();
module.exports = paymentgetwaycontroller;
