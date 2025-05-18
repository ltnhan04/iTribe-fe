const axios = require("axios");

const getProvinces = async (_, res, next) => {
  try {
    const response = await axios.get(`${process.env.BASE_URL}/p/`);
    res.json(response.data);
  } catch (error) {
    next(error);
  }
};

const getDistricts = async (req, res, next) => {
  const { code } = req.params;
  try {
    const response = await axios.get(
      `${process.env.BASE_URL}/p/${code}?depth=2`
    );
    res.json(response.data);
  } catch (error) {
    next(error);
  }
};

const getWards = async (req, res, next) => {
  const { code } = req.params;
  try {
    const response = await axios.get(
      `${process.env.BASE_URL}/d/${code}?depth=2`
    );
    res.json(response.data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProvinces,
  getDistricts,
  getWards,
};
