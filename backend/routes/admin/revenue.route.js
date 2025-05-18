const router = require("express").Router();
const {
  getRevenueByMonth,
  getRevenueByYear,
  getRevenueByCustomDateRange,
} = require("../../controllers/admin/revenue.controller");

const { verifyAdmin } = require("../../middleware/auth.middleware");

router.get("/month", verifyAdmin, getRevenueByMonth);
router.get("/year", verifyAdmin, getRevenueByYear);
router.get("/custom", verifyAdmin, getRevenueByCustomDateRange);

module.exports = router;
