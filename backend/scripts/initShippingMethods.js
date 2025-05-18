const mongoose = require("mongoose");
const dotenv = require("dotenv");
const ShippingMethod = require("../models/shippingMethod.model");

dotenv.config();

const initializeShippingMethods = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    await ShippingMethod.deleteMany({});
    console.log("Cleared existing shipping methods");

    const methods = [
      {
        name: "Tiêu chuẩn",
        basePrice: 15000,
        isActive: true,
      },
      {
        name: "Nhanh",
        basePrice: 25000,
        isActive: true,
      },
      {
        name: "Hỏa tốc",
        basePrice: 40000,
        isActive: true,
      },
    ];

    const createdMethods = await ShippingMethod.insertMany(methods);
    console.log("Created shipping methods:", createdMethods);

    console.log("Shipping methods initialized successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error initializing shipping methods:", error);
    process.exit(1);
  }
};

initializeShippingMethods();
