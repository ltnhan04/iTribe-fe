const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const CustomerService = require("../customer.service");
const RedisHelper = require("../../helpers/redis.helper");
const OtpService = require("../otp.service");
const AppError = require("../../helpers/appError.helper");
const {
  generateToken,
  storeRefreshToken,
  generateNewToken,
} = require("../token.service");
const { setCookie } = require("../../helpers/cookie.helper");
const PromotionService = require("./promotion.service");
const User = require("../../models/user.model");
const { OAuth2Client } = require("google-auth-library");
const { sendVerificationEmail } = require("../nodemailer/email.service");

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

class AuthService {
  static signUp = async ({ name, email, password }) => {
    await CustomerService.findCustomerByEmail(email);
    const { verificationCode, createdAt } = await OtpService.generateOTP();
    await RedisHelper.set(
      `signup:${email}`,
      JSON.stringify({ name, password, verificationCode, createdAt }),
      300
    );
    return { email, verificationCode };
  };

  static async verifyGoogleToken(token) {
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      return ticket.getPayload();
    } catch (error) {
      throw new AppError("Invalid Google token", 401);
    }
  }

  //Đăng nhập với google
  static async loginWithGoogle(googleUser) {
    try {
      // Tìm user theo email
      let user = await User.findOne({ email: googleUser.email });

      if (!user) {
        // Tạo user mới nếu chưa tồn tại
        user = await User.create({
          email: googleUser.email,
          name: googleUser.name,
          avatar: googleUser.picture,
          isEmailVerified: true, // Email từ Google đã được xác thực
          googleId: googleUser.sub,
        });
      }

      // Tạo JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      return {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
      };
    } catch (error) {
      throw new AppError("Error during Google authentication", 500);
    }
  }
  //Xác nhận tài khoản
  static verifyAccount = async ({ email, otp }) => {
    const { name, password } = await OtpService.verifyOtp(email, otp);
    const customer = await CustomerService.createNewCustomer(
      name,
      email,
      password
    );
    // Tạo voucher freeship cho user mới
    await PromotionService.createFirstOrderFreeShipPromotion(customer._id);
    return customer;
  };

  static handleResendOtp = async (email) => {
    await CustomerService.findCustomerByEmail(email);
    const { verificationCode } = await OtpService.checkCountOtp(email);
    return { verificationCode };
  };

  static verifyRole = async ({ email, role }) => {
    const customer = await CustomerService.registeredAccount(email);

    if (customer.role !== role) {
      throw new AppError("Access denied - Admin only", 403);
    }
    return customer;
  };

  static handleLogin = async ({ email, password, role, res }) => {
    const customer = await this.verifyRole({ email, role });
    if (customer && (await customer.comparePassword(password))) {
      const { accessToken, refreshToken } = generateToken(customer._id);
      setCookie(res, "refreshToken", refreshToken);
      await storeRefreshToken(customer._id, refreshToken);
      return { accessToken, name: customer.name, message: "Login success" };
    } else {
      let wrongPassword = await RedisHelper.get(`wrongPassword:${email}`);
      wrongPassword = wrongPassword ? parseInt(wrongPassword) : 0;
      if (wrongPassword >= 5) {
        customer.active = false;
        await customer.save();
        throw new AppError(
          "You have been restricted for 5 minutes due to multiple failed password attempts.",
          400
        );
      }
      wrongPassword += 1;
      await RedisHelper.set(`wrongPassword:${email}`, wrongPassword, 5 * 60);
      throw new AppError(
        `Invalid email or password. You have ${
          5 - wrongPassword
        } attempts remaining.`,
        400
      );
    }
  };

  static handleLogout = async (refreshToken, res) => {
    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      await RedisHelper.del(`refresh_token:${decoded.userId}`);
    }
    res.clearCookie("refreshToken");
    return { message: "Logged out successfully" };
  };

  static handleRefreshToken = async (refreshToken, res) => {
    if (!refreshToken) {
      throw new AppError("No refresh token provided", 404);
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const storedToken = await RedisHelper.get(
      `refresh_token:${decoded.userId}`
    );

    if (storedToken !== refreshToken) {
      throw new AppError("Invalid refresh token", 400);
    }

    const { newAccessToken, newRefreshToken } = generateNewToken(
      decoded.userId
    );
    setCookie(res, "refreshToken", newRefreshToken);
    return { newAccessToken, message: "Token refreshed successfully" };
  };

  static handleGetProfile = async (id) => {
    const customer = await CustomerService.findCustomerById(id);
    if (!customer) {
      throw new AppError("Customer not found", 404);
    }
    return customer;
  };

  static handleChangePassword = async (email) => {
    const customer = await CustomerService.registeredAccount(email);
    const resetToken = crypto.randomBytes(20).toString("hex");

    await RedisHelper.set(
      `resetpassword:${resetToken}`,
      JSON.stringify({ userId: customer._id, resetToken }),
      5 * 60
    );
    return { resetToken };
  };

  static handleResetPassword = async (token, password) => {
    const storedData = await RedisHelper.get(`resetpassword:${token}`);
    if (!storedData) {
      throw new AppError("Reset token expired", 400);
    }
    const parsedData = JSON.parse(storedData);
    const { userId } = parsedData;

    const customer = CustomerService.findCustomerById(userId);
    customer.password = password;
    (await customer).save();
    return { email };
  };
}

module.exports = AuthService;
