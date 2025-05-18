const {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} = require("../../services/nodemailer/email.service");
const AuthService = require("../../services/customer/auth.service");
const {
  generateToken,
  storeRefreshToken,
} = require("../../services/token.service");
const { setCookie } = require("../../helpers/cookie.helper");
const CustomerService = require("../../services/customer.service");
const passport = require("passport");

const signUp = async (req, res, next) => {
  try {
    const { email, verificationCode } = await AuthService.signUp(req.body);
    await sendVerificationEmail(email, verificationCode);
    res.status(200).json({ message: "Check your email for the OTP" });
  } catch (error) {
    next(error);
  }
};

const loginWithGoogle = async (req, res, next) => {
  passport.authenticate("google", { scope: ["email", "profile"] })(
    req,
    res,
    next
  );
};
const googleCallback = async (req, res, next) => {
  passport.authenticate("google", { session: false }, async (err, user) => {
    if (err || !user) {
      return res.redirect(`${process.env.CLIENT_URL}/login`);
    }
    const userInfo = {
      id: user._id,
      name: user.name,
      email: user.email,
    };
    const { accessToken, refreshToken } = generateToken(user._id);
    setCookie(res, "refreshToken", refreshToken);
    await storeRefreshToken(user._id, refreshToken);
    return res.redirect(
      `${process.env.CLIENT_URL}/?accessToken=${accessToken}&name=${userInfo.name}&email=${userInfo.email}`
    );
  })(req, res, next);
};

const verifySignUp = async (req, res, next) => {
  try {
    const customer = await AuthService.verifyAccount(req.body);
    const { accessToken, refreshToken } = generateToken(customer._id);
    setCookie(res, "refreshToken", refreshToken);
    await storeRefreshToken(customer._id, refreshToken);

    res.status(200).json({
      accessToken,
      name: customer.name,
      message: "Email verified and user created successfully",
      freeShipPromotion: customer.freeShipPromotion,
    });
  } catch (error) {
    next(error);
  }
};

const resentOTP = async (req, res, next) => {
  const { email } = req.body;
  try {
    const { verificationCode } = await AuthService.handleResendOtp(email);
    await sendVerificationEmail(email, verificationCode);
    res.status(200).json({ message: "Verification code resent successfully." });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password, role = "user" } = req.body;
    const { accessToken, name, message } = await AuthService.handleLogin({
      email,
      password,
      role,
      res,
    });
    res.status(200).json({ accessToken, name, message });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const { message } = await AuthService.handleLogout(refreshToken, res);
    res.status(200).json({ message: message });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const { newAccessToken, message } = await AuthService.handleRefreshToken(
      refreshToken,
      res
    );
    res.status(200).json({ accessToken: newAccessToken, message: message });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const customer = await AuthService.handleGetProfile(req.user._id);
    res.status(200).json(customer);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  const { name, phoneNumber, address } = req.body;

  try {
    const updatedUser = await CustomerService.updateProfile(req.user._id, {
      name,
      phoneNumber,
      address,
    });

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const { resetToken } = await AuthService.handleChangePassword(email);

    await sendPasswordResetEmail(
      email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );
    res.status(200).json({
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const { email } = await AuthService.handleResetPassword(token, password);

    await sendResetSuccessEmail(email);
    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signUp,
  login,
  logout,
  refreshToken,
  verifySignUp,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
  resentOTP,
  loginWithGoogle,
  googleCallback,
};
