const express = require("express");
const router = express.Router();
const {
  getProvinces,
  getDistricts,
  getWards,
} = require("../../controllers/customer/province.controller");

router.get("/provinces", getProvinces);
router.get("/districts/:code", getDistricts);
router.get("/wards/:code", getWards);

module.exports = router;
