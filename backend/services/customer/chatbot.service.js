const Chatbot = require("../../models/chatbot.model");
const Order = require("../../models/order.model");
const Product = require("../../models/product.model");
const Voucher = require("../../models/pointVoucher.model");
const Promotion = require("../../models/promotion.model");
const FAQ = require("../../models/faq.model");
const AppError = require("../../helpers/appError.helper");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

class ChatbotService {
  static async createSession(userId) {
    const sessionId = uuidv4();
    const chatbot = new Chatbot({
      userId,
      sessionId,
      messages: [],
      context: {},
    });
    await chatbot.save();
    return chatbot;
  }

  static async analyzeMessage(message) {
    try {
      const prompt = `Phân tích câu hỏi sau và trả về kết quả dưới dạng JSON với các trường sau:
      - intent: Một trong các giá trị: "order_tracking", "product_search", "shipping_fee", "voucher_info", "general"
      - subIntent: (chỉ khi intent là "order_tracking") Một trong các giá trị: "list_orders", "track_specific_order"
      - orderId: (chỉ khi intent là "order_tracking" và subIntent là "track_specific_order") Mã đơn hàng nếu có
      - searchQuery: (chỉ khi intent là "product_search") Từ khóa tìm kiếm sản phẩm
      - province: (chỉ khi intent là "shipping_fee") Tên tỉnh/thành phố nếu có
      
      Chỉ trả về JSON, không thêm nội dung khác.
      
      Câu hỏi: "${message}"`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      // Trích xuất JSON từ response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (error) {
          console.error("JSON Parse Error:", error);
        }
      }
      
      // Fallback: Phân tích đơn giản dựa trên từ khóa
      return this.fallbackAnalysis(message);
    } catch (error) {
      console.error("Message Analysis Error:", error);
      // Fallback: Phân tích đơn giản dựa trên từ khóa
      return this.fallbackAnalysis(message);
    }
  }

  static fallbackAnalysis(message) {
    const lowerMessage = message.toLowerCase();
    
    // Phân tích intent
    let intent = "general";
    let subIntent = null;
    let orderId = null;
    let searchQuery = null;
    let province = null;
    
    // Kiểm tra intent
    if (lowerMessage.includes("đơn hàng")) {
      intent = "order_tracking";
      
      if (lowerMessage.includes("danh sách") || lowerMessage.includes("của tôi") || lowerMessage.includes("của tao")) {
        subIntent = "list_orders";
      } else {
        subIntent = "track_specific_order";
        // Tìm mã đơn hàng
        const orderIdMatch = lowerMessage.match(/[a-z0-9]{8}/i);
        if (orderIdMatch) {
          orderId = orderIdMatch[0];
        }
      }
    } else if (lowerMessage.includes("sản phẩm") || lowerMessage.includes("hàng") || lowerMessage.includes("giá") || lowerMessage.includes("iphone") || lowerMessage.includes("samsung")) {
      intent = "product_search";
      
      // Trích xuất từ khóa tìm kiếm
      searchQuery = message
        .replace(/sản phẩm|hàng|giá|tìm|kiếm|mua|bán|giá bao nhiêu|bao nhiêu tiền|còn|không|nào/gi, "")
        .trim();
    } else if (lowerMessage.includes("ship") || lowerMessage.includes("vận chuyển") || lowerMessage.includes("phí") || lowerMessage.includes("giao hàng")) {
      intent = "shipping_fee";
      
      // Trích xuất tên tỉnh/thành phố
      const provinceMatch = message.match(/(?:tỉnh|thành phố|tphcm|hcm|hà nội|hanoi|đà nẵng|danang|hải phòng|haiphong|biên hòa|bienhoa|vũng tàu|vungtau|cần thơ|cantho|nha trang|nhatrang|buôn ma thuột|buonmathuot|thanh hóa|thanhhoa|vinh|việt trì|viettri|mỹ tho|mytho|long xuyên|longxuyen|pleiku|nam định|namdinh|thái nguyên|thainguyen|vĩnh yên|vinhyên|yên bái|yenbai|sơn la|sonla|lào cai|laocai|lạng sơn|langson|hạ long|halong|quảng ninh|quangninh|hải dương|haiduong|bắc giang|bacgiang|bắc ninh|bacninh|phú thọ|phutho|vĩnh phúc|vinhphuc|thái bình|thaibinh|hưng yên|hungyen|hải dương|haiduong|ninh bình|ninhbinh|quảng bình|quangbinh|hà tĩnh|hatinh|nghệ an|nghean|quảng trị|quangtri|thừa thiên huế|thuathienhue|đà nẵng|danang|quảng nam|quangnam|quảng ngãi|quangngai|bình định|binhdinh|phú yên|phuyen|khánh hòa|khanhhoa|ninh thuận|ninhthuan|bình thuận|binhthuan|kon tum|kontum|gia lai|gialai|đắk lắk|daklak|đắk nông|daknong|lâm đồng|lamdong|bình phước|binhphuoc|tây ninh|tayninh|bình dương|binhduong|đồng nai|dongnai|bà rịa - vũng tàu|baria-vungtau|hồ chí minh|hochiminh|long an|longan|tiền giang|tiengiang|bến tre|bentre|trà vinh|travinh|vĩnh long|vinhlong|đồng tháp|dongthap|an giang|angiang|kiên giang|kiengiang|cần thơ|cantho|hậu giang|haugiang|sóc trăng|soctrang|bạc liêu|baclieu|cà mau|camau)\s*([^,\.]+)/i);
      
      if (provinceMatch) {
        province = provinceMatch[1].trim();
      }
    } else if (lowerMessage.includes("voucher") || lowerMessage.includes("mã giảm giá") || lowerMessage.includes("khuyến mãi") || lowerMessage.includes("giảm giá")) {
      intent = "voucher_info";
    }
    
    return {
      intent,
      subIntent,
      orderId,
      searchQuery,
      province
    };
  }

  static async findFAQAnswer(question) {
    try {
      // Tìm kiếm câu hỏi tương tự trong database
      const faq = await FAQ.findOne(
        { $text: { $search: question } },
        { score: { $meta: "textScore" } }
      ).sort({ score: { $meta: "textScore" } });

      if (faq && faq.score > 0.5) {
        // Cập nhật số lần sử dụng
        await FAQ.findByIdAndUpdate(faq._id, {
          $inc: { usageCount: 1 },
          lastUsed: new Date(),
        });
        return faq.answer;
      }

      return null;
    } catch (error) {
      console.error("FAQ Search Error:", error);
      return null;
    }
  }

  static async generateAIResponse(question, context = {}) {
    try {
      const prompt = `Bạn là một trợ lý AI thông minh của cửa hàng. 
      Hãy trả lời các câu hỏi của khách hàng một cách thân thiện và chuyên nghiệp.
      Nếu không chắc chắn về câu trả lời, hãy nói thật và đề xuất liên hệ với nhân viên hỗ trợ.
      
      Context: ${JSON.stringify(context)}
      Question: ${question}`;

      const result = await model.generateContent(prompt);
      const answer = result.response.text();

      // Lưu câu hỏi và câu trả lời vào database
      await FAQ.create({
        question,
        answer,
        category: this.detectCategory(question),
        keywords: this.extractKeywords(question),
      });

      return answer;
    } catch (error) {
      console.error("AI Response Error:", {
        message: error.message,
        stack: error.stack,
        details: error.details || {},
      });
      throw new AppError(
        "Không thể tạo câu trả lời. Vui lòng thử lại sau hoặc liên hệ nhân viên hỗ trợ.",
        500
      );
    }
  }

  static detectCategory(question) {
    const categoryKeywords = {
      order: ["đơn hàng", "order", "mua hàng", "thanh toán"],
      product: ["sản phẩm", "hàng", "giá", "mua"],
      shipping: ["ship", "vận chuyển", "giao hàng", "phí ship"],
      voucher: ["voucher", "mã giảm giá", "khuyến mãi", "discount"],
    };

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => question.toLowerCase().includes(keyword))) {
        return category;
      }
    }

    return "general";
  }

  static extractKeywords(question) {
    // Loại bỏ các từ stop words và lấy các từ khóa quan trọng
    const stopWords = ["là", "của", "và", "hoặc", "có", "không", "gì", "nào", "bao", "giờ", "ở", "đâu"];
    const words = question.toLowerCase().split(" ");
    return words.filter(word => !stopWords.includes(word));
  }

  static async trackOrder(orderId, userId) {
    try {
      const order = await Order.findOne({
        _id: orderId,
        user: userId
      });
      
      if (!order) {
        throw new AppError("Không tìm thấy đơn hàng của bạn", 404);
      }

      return {
        orderId: order._id,
        status: order.status,
        items: order.items,
        totalAmount: order.totalAmount,
        shippingAddress: order.shippingAddress,
        createdAt: order.createdAt,
      };
    } catch (error) {
      console.error("Order Tracking Error:", error);
      throw error;
    }
  }

  static async getUserOrders(userId) {
    try {
      const orders = await Order.find({ user: userId })
        .sort({ createdAt: -1 })
        .select('_id status totalAmount createdAt')
        .limit(5);

      return orders;
    } catch (error) {
      console.error("Get User Orders Error:", error);
      throw error;
    }
  }

  static async searchProducts(query, filters = {}) {
    try {
      const { minPrice, maxPrice, category, sortBy } = filters;
      let searchQuery = {
        $or: [
          { name: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      };

      if (minPrice || maxPrice) {
        searchQuery.price = {};
        if (minPrice) searchQuery.price.$gte = Number(minPrice);
        if (maxPrice) searchQuery.price.$lte = Number(maxPrice);
      }

      if (category) {
        searchQuery.category = category;
      }

      let sortOptions = {};
      switch (sortBy) {
        case "price_asc":
          sortOptions.price = 1;
          break;
        case "price_desc":
          sortOptions.price = -1;
          break;
        case "rating":
          sortOptions.rating = -1;
          break;
        case "newest":
          sortOptions.createdAt = -1;
          break;
        default:
          sortOptions.createdAt = -1;
      }

      const products = await Product.find(searchQuery)
        .sort(sortOptions)
        .limit(10)
        .select("name price description image rating");

      // Format products to ensure all required fields exist
      return products.map(product => ({
        name: product.name || "Không có tên",
        price: product.price ? product.price.toLocaleString() : "Liên hệ",
        description: product.description || "Không có mô tả",
        image: product.image || "",
        rating: product.rating || 0
      }));
    } catch (error) {
      console.error("Product Search Error:", error);
      throw error;
    }
  }

  static async calculateShippingFee(province) {
    try {
      // Map provinces to regions
      const regionMap = {
        "Hà Nội": "Bắc",
        "Hải Phòng": "Bắc",
        "Nam Định": "Bắc",
        "Thái Bình": "Bắc",
        "Ninh Bình": "Bắc",
        "Hải Dương": "Bắc",
        "Hưng Yên": "Bắc",
        "Bắc Ninh": "Bắc",
        "Bắc Giang": "Bắc",
        "Phú Thọ": "Bắc",
        "Vĩnh Phúc": "Bắc",
        "Tuyên Quang": "Bắc",
        "Thái Nguyên": "Bắc",
        "Lào Cai": "Bắc",
        "Yên Bái": "Bắc",
        "Sơn La": "Bắc",
        "Điện Biên": "Bắc",
        "Hòa Bình": "Bắc",
        "Lạng Sơn": "Bắc",
        "Quảng Ninh": "Bắc",
        "Cao Bằng": "Bắc",
        "Bắc Kạn": "Bắc",
        "Tuyên Quang": "Bắc",
        "Hà Giang": "Bắc",
        "Đà Nẵng": "Trung",
        "Huế": "Trung",
        "Quảng Nam": "Trung",
        "Quảng Ngãi": "Trung",
        "Bình Định": "Trung",
        "Phú Yên": "Trung",
        "Khánh Hòa": "Trung",
        "Ninh Thuận": "Trung",
        "Bình Thuận": "Trung",
        "Quảng Bình": "Trung",
        "Quảng Trị": "Trung",
        "Thừa Thiên Huế": "Trung",
        "Hồ Chí Minh": "Nam",
        "Cần Thơ": "Nam",
        "Đồng Nai": "Nam",
        "Bình Dương": "Nam",
        "Bà Rịa - Vũng Tàu": "Nam",
        "Long An": "Nam",
        "Tiền Giang": "Nam",
        "Bến Tre": "Nam",
        "Trà Vinh": "Nam",
        "Vĩnh Long": "Nam",
        "Đồng Tháp": "Nam",
        "An Giang": "Nam",
        "Kiên Giang": "Nam",
        "Cà Mau": "Nam",
        "Bạc Liêu": "Nam",
        "Sóc Trăng": "Nam",
        "Hậu Giang": "Nam",
      };

      const region = regionMap[province] || "Khác";
      const shippingMethods = {
        "Bắc": {
          "Giao hàng tiêu chuẩn": 30000,
          "Giao hàng nhanh": 50000,
          "Giao hàng siêu tốc": 80000,
        },
        "Trung": {
          "Giao hàng tiêu chuẩn": 40000,
          "Giao hàng nhanh": 60000,
          "Giao hàng siêu tốc": 90000,
        },
        "Nam": {
          "Giao hàng tiêu chuẩn": 35000,
          "Giao hàng nhanh": 55000,
          "Giao hàng siêu tốc": 85000,
        },
        "Khác": {
          "Giao hàng tiêu chuẩn": 50000,
          "Giao hàng nhanh": 70000,
          "Giao hàng siêu tốc": 100000,
        },
      };

      return {
        region,
        shippingMethods: shippingMethods[region],
      };
    } catch (error) {
      console.error("Shipping Fee Calculation Error:", error);
      throw error;
    }
  }

  static async getAvailableVouchers(userId) {
    try {
      const currentDate = new Date();
      
      // Lấy voucher từ promotion model
      const promotions = await Promotion.find({
        is_active: true,
        valid_from: { $lte: currentDate },
        valid_to: { $gte: currentDate }
      }).select('code discount_type discount_amount discount_percent min_order_amount description user_usage max_usage max_usage_per_user used_count')
        .lean();

      if (!promotions || promotions.length === 0) {
        return []; // Trả về mảng rỗng nếu không có voucher
      }

      // Lọc và format vouchers
      const availableVouchers = promotions
        .filter(promotion => {
          // Kiểm tra số lần sử dụng tổng
          if (!promotion.max_usage || !promotion.used_count) return true;
          return promotion.used_count < promotion.max_usage;
        })
        .map(promotion => {
          // Kiểm tra xem có phải voucher cá nhân không
          const userUsage = promotion.user_usage?.find(
            usage => usage.user && usage.user.toString() === userId
          );

          // Nếu là voucher cá nhân, kiểm tra số lần sử dụng
          if (userUsage && promotion.max_usage_per_user) {
            if (userUsage.usageCount >= promotion.max_usage_per_user) {
              return null;
            }
          }

          const discountAmount = promotion.discount_type === "amount" ? 
            promotion.discount_amount || 0 : 
            promotion.discount_percent || 0;

          const description = promotion.description || 
            `Giảm ${promotion.discount_type === "amount" ? 
              (discountAmount || 0).toLocaleString() + "đ" : 
              discountAmount + "%"}`;

          return {
            code: promotion.code || "",
            discountType: promotion.discount_type || "amount",
            discountValue: discountAmount,
            minOrderAmount: promotion.min_order_amount || 0,
            description: description,
            isPersonal: !!userUsage,
            usageCount: userUsage?.usageCount || 0,
            maxUsagePerUser: promotion.max_usage_per_user || 1,
            remainingUses: promotion.max_usage ? 
              Math.max(0, promotion.max_usage - (promotion.used_count || 0)) : 
              null
          };
        })
        .filter(Boolean); // Loại bỏ các phần tử null

      // Return an empty array if no vouchers are available
      if (availableVouchers.length === 0) {
        return [];
      }

      return availableVouchers;

    } catch (error) {
      console.error("Get Vouchers Error:", error);
      return []; // Return empty array in case of error
    }
  }

  static async saveMessage(sessionId, role, content) {
    try {
      const chatbot = await Chatbot.findOne({ sessionId });
      if (!chatbot) {
        throw new AppError("Chat session not found", 404);
      }

      // Limit message history to last 50 messages
      if (chatbot.messages.length >= 50) {
        chatbot.messages = chatbot.messages.slice(-49);
      }

      chatbot.messages.push({
        role,
        content,
        timestamp: new Date(),
      });

      await chatbot.save();
      return chatbot;
    } catch (error) {
      console.error("Save Message Error:", error);
      throw error;
    }
  }

  static async getChatHistory(sessionId) {
    try {
      const chatbot = await Chatbot.findOne({ sessionId });
      if (!chatbot) {
        throw new AppError("Chat session not found", 404);
      }
      return chatbot;
    } catch (error) {
      console.error("Get Chat History Error:", error);
      throw error;
    }
  }
}

module.exports = ChatbotService; 