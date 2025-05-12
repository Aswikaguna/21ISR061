const axios = require('axios');

const BASE_URL = 'http://20.244.56.144/evaluation-service';
const endpoints = {
  p: 'primes',
  f: 'fibo',
  e: 'even',
  r: 'rand'
};

async function fetchNumbers(type) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 500);

  try {
    const response = await axios.get(`${BASE_URL}/${endpoints[type]}`, {
      signal: controller.signal,
      timeout: 500
    });
    clearTimeout(timeout);
    return response.data.numbers || [];
  } catch (error) {
    clearTimeout(timeout);
    return [];
  }
}

module.exports = { fetchNumbers };
