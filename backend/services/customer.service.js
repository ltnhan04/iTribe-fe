const User = require("../models/user.model");
const AppError = require("../helpers/appError.helper");
const RedisHelper = require("../helpers/redis.helper");

class CustomerService {
  static findCustomerById = async (id) => {
    const customer = await User.findById(id);
    if (!customer) {
      throw new AppError("Customer not found", 404);
    }
    return customer;
  };

  static updateProfile = async (id, { name, phoneNumber, address }) => {
    const customer = await User.findByIdAndUpdate(
      id,
      { name, phoneNumber, address },
      { new: true, runValidators: true }
    );
    if (!customer) {
      throw new AppError("Customer not found", 404);
    }
    return customer;
  };

  static findCustomerByEmail = async (email) => {
    const customer = await User.findOne({ email });
    if (customer) {
      throw new AppError("Customer already exists", 400);
    }
    return customer;
  };

  static registeredAccount = async (email) => {
    const customer = await User.findOne({ email });
    if (!customer) {
      throw new AppError("Customer not found", 404);
    }
    return customer;
  };

  static createNewCustomer = async (name, email, password) => {
    const customer = await User.create({ name, email, password });
    if (!customer) {
      throw new AppError("Customer not created", 500);
    }
    await RedisHelper.del(`signup:${email}`);
    return customer;
  };

  static verifyRole = async (email, role, password) => {
    const customer = await User.findOne({ email });
    if (customer && (await customer.comparePassword(password))) {
      if (customer.role !== role) {
        throw new AppError("Access denied - Admin only", 403);
      }
    }
    return customer;
  };
}

module.exports = CustomerService;
