const User = require("../../models/user.model");
const AppError = require("../../helpers/appError.helper");

class CustomerService {
  static handleGetCustomers = async () => {
    const customers = await User.find({});
    if (!customers) {
      throw new AppError("No customers found", 404);
    }
    return customers;
  };

  static handleGetCustomer = async (id) => {
    const customer = await User.findById(id).select("-password");
    if (!customer) {
      throw new AppError("Customer not found", 404);
    }
    return customer;
  };
}

module.exports = CustomerService;
