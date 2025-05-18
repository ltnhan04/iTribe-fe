const CustomerService = require("../../services/admin/customer.service");

const getAllUser = async (_, res, next) => {
  try {
    const customers = await CustomerService.handleGetCustomers();
    res
      .status(200)
      .json({ message: "Get customers successfully", data: customers });
  } catch (error) {
    next(error);
  }
};

const getUserDetail = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const customer = await CustomerService.handleGetCustomer(userId);
    res.status(200).json({ customer });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUser,
  getUserDetail,
};
