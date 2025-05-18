const exchangeRate = 24000;
const vndLimit = 99999999;

const priceInUSD = (price) => {
  return price / exchangeRate;
};

module.exports = {
  exchangeRate,
  vndLimit,
  priceInUSD,
};
