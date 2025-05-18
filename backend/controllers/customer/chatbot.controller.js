const ChatbotService = require("../../services/customer/chatbot.service");
const AppError = require("../../helpers/appError.helper");
const PromotionService = require("../../services/customer/promotion.service");

class ChatbotController {
  static async createSession(req, res, next) {
    try {
      const chatbot = await ChatbotService.createSession(req.user._id);
      res.status(201).json({
        status: "success",
        data: {
          sessionId: chatbot.sessionId,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async handleMessage(req, res, next) {
    try {
      const { sessionId, message } = req.body;
      if (!sessionId || !message) {
        throw new AppError("Session ID and message are required", 400);
      }

      // Save user message
      await ChatbotService.saveMessage(sessionId, "user", message);

      // Process message and generate response
      let response;
      let context = {};

      // Sử dụng AI để phân tích câu hỏi trước
      const aiAnalysis = await ChatbotService.analyzeMessage(message);
      context.messageAnalysis = aiAnalysis;

      // Xử lý dựa trên kết quả phân tích từ AI
      if (aiAnalysis.intent === "order_tracking") {
        if (aiAnalysis.subIntent === "list_orders") {
          const orders = await ChatbotService.getUserOrders(req.user._id);
          context.orders = orders;
          if (orders.length === 0) {
            response = "Bạn chưa có đơn hàng nào.";
          } else {
            response = "Danh sách đơn hàng gần đây của bạn:\n" +
              orders.map(order => 
                `- Đơn hàng ${order._id}:\n` +
                `  + Trạng thái: ${order.status}\n` +
                `  + Tổng tiền: ${order.totalAmount.toLocaleString()}đ\n` +
                `  + Ngày đặt: ${new Date(order.createdAt).toLocaleDateString()}`
              ).join("\n\n");
          }
        } else if (aiAnalysis.orderId) {
          const orderInfo = await ChatbotService.trackOrder(aiAnalysis.orderId, req.user._id);
          context.orderInfo = orderInfo;
          response = `Thông tin đơn hàng ${aiAnalysis.orderId}:\n` +
            `- Trạng thái: ${orderInfo.status}\n` +
            `- Tổng tiền: ${orderInfo.totalAmount.toLocaleString()}đ\n` +
            `- Địa chỉ giao hàng: ${orderInfo.shippingAddress}\n` +
            `- Ngày đặt: ${new Date(orderInfo.createdAt).toLocaleDateString()}`;
        } else {
          response = "Vui lòng cung cấp mã đơn hàng để kiểm tra hoặc nhập 'đơn hàng của tôi' để xem danh sách đơn hàng.";
        }
      } 
      else if (aiAnalysis.intent === "product_search") {
        const searchQuery = aiAnalysis.searchQuery || message
          .replace(/sản phẩm|hàng|giá|tìm|kiếm|mua|bán|giá bao nhiêu|bao nhiêu tiền|còn|không|nào/gi, "")
          .trim();
        
        if (!searchQuery) {
          response = "Vui lòng nhập từ khóa tìm kiếm sản phẩm.";
        } else {
          const products = await ChatbotService.searchProducts(searchQuery);
          context.products = products;
          if (products.length === 0) {
            response = "Không tìm thấy sản phẩm phù hợp với từ khóa của bạn.";
          } else {
            response = "Kết quả tìm kiếm:\n" +
              products.map(p => `- ${p.name}: ${p.price.toLocaleString()}đ`).join("\n");
          }
        }
      } 
      else if (aiAnalysis.intent === "shipping_fee") {
        const province = aiAnalysis.province;
        
        if (!province) {
          response = "Vui lòng cung cấp tỉnh/thành phố để tính phí ship.";
        } else {
          const shippingInfo = await ChatbotService.calculateShippingFee(province);
          context.shippingInfo = shippingInfo;
          response = `Phí ship đến ${province} (${shippingInfo.region}):\n` +
            Object.entries(shippingInfo.shippingMethods)
              .map(([method, fee]) => `- ${method}: ${fee.toLocaleString()}đ`)
              .join("\n");
        }
      } 
      else if (aiAnalysis.intent === "voucher_info") {
        const vouchers = await ChatbotService.getAvailableVouchers(req.user._id);
        context.vouchers = vouchers;
        response = formatVoucherMessage(vouchers);
      } 
      else {
        // Tìm câu trả lời trong FAQ
        const faqAnswer = await ChatbotService.findFAQAnswer(message);
        if (faqAnswer) {
          response = faqAnswer;
        } else {
          // Nếu không tìm thấy trong FAQ, sử dụng AI
          response = await ChatbotService.generateAIResponse(message, context);
        }
      }

      // Save assistant response
      await ChatbotService.saveMessage(sessionId, "assistant", response);

      res.status(200).json({
        status: "success",
        data: {
          response,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getChatHistory(req, res, next) {
    try {
      const { sessionId } = req.params;
      const chatbot = await ChatbotService.getChatHistory(sessionId);
      
      res.status(200).json({
        status: "success",
        data: {
          messages: chatbot.messages,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

const formatVoucherMessage = (vouchers) => {
  if (!vouchers || vouchers.length === 0) {
    return "Hiện không có voucher nào khả dụng.";
  }

  return "Danh sách voucher khả dụng:\n" +
    vouchers.map(v => 
      `- ${v.code}${v.isPersonal ? " (Voucher cá nhân)" : ""}:\n` +
      `  + ${v.description}\n` +
      `  + Đơn hàng tối thiểu: ${v.minOrderAmount.toLocaleString()}đ\n` +
      `  + Số lần còn lại: ${v.isPersonal ? 
        `${v.maxUsagePerUser - v.usageCount}/${v.maxUsagePerUser} lần` : 
        `${v.remainingUses} lần`}`
    ).join("\n\n");
};

const applyPromotion = async (req, res, next) => {
  // ... existing code ...
};

const getActivePromotions = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const vouchers = await PromotionService.handleGetActivePromotions(userId);
    
    res.status(200).json({
      status: "success",
      data: {
        promotions: vouchers,
        message: formatVoucherMessage(vouchers)
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = ChatbotController; 