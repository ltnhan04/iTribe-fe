const RevenueService = require("../../services/admin/revenue.service");
const AppError = require("../../helpers/appError.helper");

const getRevenueByMonth = async (req, res, next) => {
  try {
    const { year, month } = req.query;
    if (!year || !month) {
      throw new AppError("Year and month are required", 400);
    }

    const result = await RevenueService.getRevenueByMonth(
      parseInt(year),
      parseInt(month)
    );

    res.status(200).json({
      status: "success",
      data: {
        report: result.data,
        summary: {
          totalSales: result.summary.totalSales.toLocaleString() + "đ",
          totalOrders: result.summary.totalOrders,
          averageOrderValue:
            result.summary.averageOrderValue.toLocaleString() + "đ",
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getRevenueByYear = async (req, res, next) => {
  try {
    const { year } = req.query;
    if (!year) {
      throw new AppError("Year is required", 400);
    }

    const result = await RevenueService.getRevenueByYear(parseInt(year));

    res.status(200).json({
      status: "success",
      data: {
        report: result.data,
        summary: {
          totalSales: result.summary.totalSales.toLocaleString() + "đ",
          totalOrders: result.summary.totalOrders,
          averageOrderValue:
            result.summary.averageOrderValue.toLocaleString() + "đ",
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getRevenueByCustomDateRange = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      throw new AppError("Start date and end date are required", 400);
    }

    const result = await RevenueService.getRevenueByCustomDateRange(
      startDate,
      endDate
    );

    res.status(200).json({
      status: "success",
      data: {
        report: result.data,
        summary: {
          totalSales: result.summary.totalSales.toLocaleString() + "đ",
          totalOrders: result.summary.totalOrders,
          averageOrderValue:
            result.summary.averageOrderValue.toLocaleString() + "đ",
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRevenueByMonth,
  getRevenueByYear,
  getRevenueByCustomDateRange,
};
