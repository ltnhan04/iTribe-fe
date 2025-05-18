const Order = require("../../models/order.model");
const AppError = require("../../helpers/appError.helper");

class RevenueService {
  static async getRevenueByDateRange(startDate, endDate, groupBy = "day") {
    try {
      // Validate dates
      if (!startDate || !endDate) {
        throw new AppError("Start date and end date are required", 400);
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new AppError("Invalid date format", 400);
      }

      if (start > end) {
        throw new AppError("Start date must be before end date", 400);
      }

      // Set end date to end of day
      end.setHours(23, 59, 59, 999);

      // Build aggregation pipeline
      const pipeline = [
        {
          $match: {
            createdAt: { $gte: start, $lte: end },
            status: "delivered",
          },
        },
      ];

      // Add grouping based on groupBy parameter
      let groupStage = {};
      switch (groupBy) {
        case "day":
          groupStage = {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },
            },
          };
          break;
        case "month":
          groupStage = {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
          };
          break;
        case "year":
          groupStage = {
            _id: {
              year: { $year: "$createdAt" },
            },
          };
          break;
        default:
          throw new AppError(
            "Invalid groupBy parameter. Must be 'day', 'month', or 'year'",
            400
          );
      }

      pipeline.push({
        $group: {
          ...groupStage,
          totalSales: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
        },
      });

      // Add sorting based on groupBy
      let sortStage = {};
      switch (groupBy) {
        case "day":
          sortStage = {
            "_id.year": 1,
            "_id.month": 1,
            "_id.day": 1,
          };
          break;
        case "month":
          sortStage = {
            "_id.year": 1,
            "_id.month": 1,
          };
          break;
        case "year":
          sortStage = {
            "_id.year": 1,
          };
          break;
      }

      pipeline.push({ $sort: sortStage });

      // Execute aggregation
      const results = await Order.aggregate(pipeline);

      // Format results
      const formattedResults = results.map((result) => {
        let date;
        let label;

        switch (groupBy) {
          case "day":
            date = new Date(
              result._id.year,
              result._id.month - 1,
              result._id.day
            );
            label = `${result._id.day}/${result._id.month}/${result._id.year}`;
            break;
          case "month":
            date = new Date(result._id.year, result._id.month - 1, 1);
            label = `Tháng ${result._id.month}/${result._id.year}`;
            break;
          case "year":
            date = new Date(result._id.year, 0, 1);
            label = `Năm ${result._id.year}`;
            break;
        }

        return {
          date: date.toISOString().split("T")[0],
          label: label,
          totalSales: result.totalSales,
          totalOrders: result.totalOrders,
        };
      });

      // Calculate summary
      const summary = {
        totalSales: formattedResults.reduce(
          (sum, item) => sum + item.totalSales,
          0
        ),
        totalOrders: formattedResults.reduce(
          (sum, item) => sum + item.totalOrders,
          0
        ),
        averageOrderValue:
          formattedResults.length > 0
            ? formattedResults.reduce((sum, item) => sum + item.totalSales, 0) /
              formattedResults.reduce((sum, item) => sum + item.totalOrders, 0)
            : 0,
      };

      return {
        data: formattedResults,
        summary,
      };
    } catch (error) {
      console.error("Error in getRevenueByDateRange:", error);
      throw error;
    }
  }

  static async getRevenueByMonth(year, month) {
    try {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0);
      end.setHours(23, 59, 59, 999);

      const result = await this.getRevenueByDateRange(start, end, "day");
      return result;
    } catch (error) {
      console.error("Error in getRevenueByMonth:", error);
      throw error;
    }
  }

  static async getRevenueByYear(year) {
    try {
      const start = new Date(year, 0, 1);
      const end = new Date(year, 11, 31);
      end.setHours(23, 59, 59, 999);

      const result = await this.getRevenueByDateRange(start, end, "month");
      return result;
    } catch (error) {
      console.error("Error in getRevenueByYear:", error);
      throw error;
    }
  }

  static async getRevenueByCustomDateRange(startDate, endDate) {
    try {
      // Validate dates
      if (!startDate || !endDate) {
        throw new AppError("Start date and end date are required", 400);
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new AppError("Invalid date format", 400);
      }

      if (start > end) {
        throw new AppError("Start date must be before end date", 400);
      }

      // Set end date to end of day
      end.setHours(23, 59, 59, 999);

      const result = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: start, $lte: end },
            status: "delivered",
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },
            },
            totalSales: { $sum: "$totalAmount" },
            totalOrders: { $sum: 1 },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
            "_id.day": 1,
          },
        },
      ]);

      // Format results
      const formattedResults = result.map((item) => {
        const date = new Date(item._id.year, item._id.month - 1, item._id.day);

        return {
          date: date.toISOString().split("T")[0],
          label: `${item._id.day}/${item._id.month}/${item._id.year}`,
          totalSales: item.totalSales,
          totalOrders: item.totalOrders,
        };
      });

      // Calculate summary
      const summary = {
        totalSales: formattedResults.reduce(
          (sum, item) => sum + item.totalSales,
          0
        ),
        totalOrders: formattedResults.reduce(
          (sum, item) => sum + item.totalOrders,
          0
        ),
        averageOrderValue:
          formattedResults.length > 0
            ? formattedResults.reduce((sum, item) => sum + item.totalSales, 0) /
              formattedResults.reduce((sum, item) => sum + item.totalOrders, 0)
            : 0,
      };

      return {
        data: formattedResults,
        summary,
      };
    } catch (error) {
      console.error("Error in getRevenueByCustomDateRange:", error);
      throw error;
    }
  }
}

module.exports = RevenueService;
