const stripe = require("../../libs/stripe");
const ProductVariant = require("../../models/productVariant.model");
const AppError = require("../../helpers/appError.helper");
const { vndLimit, priceInUSD } = require("../../constants");
const crypto = require("crypto");
const https = require("https");

class PaymentService {
  static handleCheckoutSession = async (variants, orderId) => {
    if (!variants || !Array.isArray(variants) || variants.length === 0) {
      throw new AppError("Invalid product variants", 400);
    }

    const productVariants = await Promise.all(
      variants.map(async (item) => {
        const product = await ProductVariant.findById(item.variant);
        if (!product) {
          throw new Error(`ProductVariant ${item.variant} not found`);
        }
        return {
          name: product.storage,
          price: product.price,
          quantity: item.quantity,
          image: product.images[0],
        };
      })
    );

    const lineItems = productVariants.map((variant) => {
      const price = priceInUSD(variant.price);
      const unitAmountInCents = Math.round(price * 100);

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: variant.name,
            images: [variant.image],
          },
          unit_amount: unitAmountInCents,
        },
        quantity: variant.quantity,
      };
    });

    const totalAmount = lineItems.reduce((sum, item) => {
      return sum + item.price_data.unit_amount * item.quantity;
    }, 0);

    if (totalAmount > vndLimit) {
      throw new AppError("Total amount exceeds the limit", 400);
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&&orderId=${orderId}`,
      cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
    });
    return session;
  };

  static createMomoPayment = async (orderId, amount, orderInfo) => {
    try {
      const accessKey = process.env.MOMO_ACCESS_KEY;
      const secretKey = process.env.MOMO_SECRET_KEY;
      const partnerCode = process.env.MOMO_PARTNER_CODE;
      const redirectUrl = `${process.env.CLIENT_URL}/payment/success`;
      const ipnUrl = `${process.env.SERVER_URL}/api/v1/payment/momo/callback`;
      const requestType = "payWithMethod";
      const requestId = orderId;
      const extraData = "";
      const orderGroupId = "";
      const autoCapture = true;
      const lang = "vi";

      // Create raw signature
      const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

      // Create signature
      const signature = crypto
        .createHmac("sha256", secretKey)
        .update(rawSignature)
        .digest("hex");

      // Create request body
      const requestBody = JSON.stringify({
        partnerCode,
        partnerName: "Test",
        storeId: "MomoTestStore",
        requestId,
        amount,
        orderId,
        orderInfo,
        redirectUrl,
        ipnUrl,
        lang,
        requestType,
        autoCapture,
        extraData,
        orderGroupId,
        signature,
      });

      // Create payment URL
      return new Promise((resolve, reject) => {
        const options = {
          hostname: "test-payment.momo.vn",
          port: 443,
          path: "/v2/gateway/api/create",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(requestBody),
          },
        };

        const req = https.request(options, (res) => {
          let body = "";
          res.setEncoding("utf8");
          res.on("data", (chunk) => {
            body += chunk;
          });
          res.on("end", () => {
            try {
              const response = JSON.parse(body);
              console.log("Create payment response:", response);
              if (response.resultCode === 0) {
                resolve({
                  url: response.payUrl,
                  orderId: response.orderId,
                  requestId: response.requestId,
                  amount: response.amount,
                  message: response.message,
                  resultCode: response.resultCode,
                  responseTime: response.responseTime,
                });
              } else {
                reject(
                  new AppError(
                    response.message || "Payment creation failed",
                    400
                  )
                );
              }
            } catch (error) {
              reject(new AppError("Error parsing response", 500));
            }
          });
        });

        req.on("error", (error) => {
          reject(new AppError("Error creating payment request", 500));
        });

        req.write(requestBody);
        req.end();
      });
    } catch (error) {
      throw new AppError("Error creating MoMo payment", 500);
    }
  };

  static handleMomoCallback = async (data) => {
    console.log("Call back:::");
    try {
      // Verify signature
      const accessKey = process.env.MOMO_ACCESS_KEY;
      const secretKey = process.env.MOMO_SECRET_KEY;
      const partnerCode = process.env.MOMO_PARTNER_CODE;

      const rawSignature = `accessKey=${accessKey}&amount=${data.amount}&extraData=${data.extraData}&message=${data.message}&orderId=${data.orderId}&orderInfo=${data.orderInfo}&orderType=${data.orderType}&partnerCode=${partnerCode}&payType=${data.payType}&requestId=${data.requestId}&responseTime=${data.responseTime}&resultCode=${data.resultCode}&transId=${data.transId}`;

      const signature = crypto
        .createHmac("sha256", secretKey)
        .update(rawSignature)
        .digest("hex");

      if (signature !== data.signature) {
        throw new AppError("Invalid signature", 400);
      }
      console.log(data);
      // Handle payment result
      if (data.resultCode === 0) {
        // Payment successful
        return {
          success: true,
          orderId: data.orderId,
          transId: data.transId,
          message: data.message,
        };
      } else {
        // Payment failed
        return {
          success: false,
          orderId: data.orderId,
          message: data.message,
        };
      }
    } catch (error) {
      throw new AppError("Error handling MoMo callback", 500);
    }
  };

  static transactionStatus = async (orderId) => {
    try {
      const accessKey = process.env.MOMO_ACCESS_KEY;
      const secretKey = process.env.MOMO_SECRET_KEY;
      const partnerCode = process.env.MOMO_PARTNER_CODE;

      const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${orderId}`;
      const signature = crypto
        .createHmac("sha256", secretKey)
        .update(rawSignature)
        .digest("hex");

      const requestBody = JSON.stringify({
        partnerCode,
        orderId,
        requestId: orderId,
        signature,
        lang: "vi",
      });

      return new Promise((resolve, reject) => {
        const options = {
          hostname: "test-payment.momo.vn",
          port: 443,
          path: "/v2/gateway/api/query",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(requestBody),
          },
        };

        const req = https.request(options, (res) => {
          let body = "";
          res.setEncoding("utf8");
          res.on("data", (chunk) => {
            body += chunk;
          });
          res.on("end", () => {
            try {
              const response = JSON.parse(body);
              console.log("Transaction status response:", response);
              resolve(response);
            } catch (error) {
              reject(new AppError("Error parsing response", 500));
            }
          });
        });

        req.on("error", (error) => {
          reject(new AppError("Error querying transaction status", 500));
        });

        req.write(requestBody);
        req.end();
      });
    } catch (error) {
      throw new AppError("Error in transaction status check", 500);
    }
  };
}

module.exports = PaymentService;
