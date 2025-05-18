import { Rule } from "antd/lib/form";
import dayjs from "dayjs";

const getStartDate = () => {
  const startDate = localStorage.getItem("startDate");
  return startDate ? dayjs(startDate) : dayjs();
};

export const minOrderAmountRules: Rule[] = [
  { required: true, message: "Please enter the minimum order amount!" },
  {
    validator: (_, value) => {
      const minAmount = 10000;
      if (!value || isNaN(value)) {
        return Promise.reject(
          new Error("The order amount must be a valid number.")
        );
      }
      if (value < minAmount) {
        return Promise.reject(
          new Error(
            `The minimum order amount must be at least ${minAmount.toLocaleString(
              "vi-VN",
              { style: "currency", currency: "VND" }
            )}.`
          )
        );
      }
      return Promise.resolve();
    },
  },
];

export const promotionNameRules: Rule[] = [
  { required: true, message: "Please enter the promotion name!" },
  { min: 3, message: "The name must be at least 3 characters." },
  { max: 50, message: "The name must not exceed 50 characters." },
];

export const startDateRules: Rule[] = [
  { required: true, message: "Please select the start date!" },
  {
    validator: (_, value) => {
      const currentDate = dayjs();
      if (!value || dayjs(value).isBefore(currentDate, "day")) {
        return Promise.reject(
          new Error("The start date must be later than today.")
        );
      }
      return Promise.resolve();
    },
  },
];

export const endDateRules: Rule[] = [
  {
    required: true,
    message: "Please select the end date!",
  },
  {
    validator: (_, value) => {
      const startDate = getStartDate();
      if (!value) {
        return Promise.reject(new Error("Please select the end date."));
      }
      const endDate = dayjs(value);

      if (!startDate.isValid()) {
        return Promise.reject(new Error("The start date is invalid."));
      }

      if (endDate.isBefore(startDate, "day")) {
        return Promise.reject(
          new Error(
            "The end date cannot be earlier than the start date or in the past."
          )
        );
      }

      return Promise.resolve();
    },
  },
];

export const maxUsageRules: Rule[] = [
  { required: true, message: "Please enter the usage limit!" },
  {
    type: "number",
    min: 1,
    max: 50,
    message: "Usage limit must be between 1 and 50.",
    transform: (value) => Number(value),
  },
  {
    validator: (_, value) => {
      if (value && (value < 1 || value > 50)) {
        return Promise.reject(
          new Error("Usage limit must be between 1 and 50.")
        );
      }
      return Promise.resolve();
    },
  },
];

export const discountRules: Rule[] = [
  { required: true, message: "Please enter the discount percentage!" },
  {
    type: "number",
    min: 5,
    max: 50,
    message: "Discount percentage must be between 5% and 50%.",
    transform: (value) => Number(value),
  },
  {
    validator: (_, value) => {
      if (value && (value < 5 || value > 50)) {
        return Promise.reject(
          new Error("Discount percentage must be between 5% and 50%.")
        );
      }
      return Promise.resolve();
    },
  },
];
