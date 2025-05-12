const express = require("express");
const router = express.Router();
const axios = require("axios");
const NumberModel = require("../models/numModel");

const numberIdMap = {
  p: "primes",
  f: "fibo",
  e: "even",
  r: "rand"
};

const WINDOW_SIZE = 10;

router.get("/numbers/:numberid", async (req, res) => {
  const { numberid } = req.params;
  const type = numberIdMap[numberid];

  if (!type) return res.status(400).json({ error: "Invalid number ID" });

  const apiURL = `http://20.244.56.144/evaluation-service/${type}`;

  let responseData = [];
  try {
    const response = await axios.get(apiURL, { timeout: 2000 });
    responseData = response.data.numbers;
  } catch (err) {
    return res.status(500).json({ error: "Third-party API failed or timed out" });
  }

  const windowPrevState = await NumberModel.find().sort({ addedAt: 1 }).limit(WINDOW_SIZE);
  const windowPrevValues = windowPrevState.map(item => item.value);

  const newValues = [...new Set(responseData)].filter(num => !windowPrevValues.includes(num));
  for (let val of newValues) {
    await NumberModel.updateOne({ value: val }, { $setOnInsert: { value: val } }, { upsert: true });
  }

  const allStored = await NumberModel.find().sort({ addedAt: 1 });
  if (allStored.length > WINDOW_SIZE) {
    const excess = allStored.length - WINDOW_SIZE;
    const idsToDelete = allStored.slice(0, excess).map(doc => doc._id);
    await NumberModel.deleteMany({ _id: { $in: idsToDelete } });
  }

  const windowCurrStateDocs = await NumberModel.find().sort({ addedAt: 1 }).limit(WINDOW_SIZE);
  const windowCurrValues = windowCurrStateDocs.map(item => item.value);
  const avg = (windowCurrValues.reduce((a, b) => a + b, 0) / windowCurrValues.length).toFixed(2);

  return res.json({
    windowPrevState: windowPrevValues,
    windowCurrState: windowCurrValues,
    numbers: responseData,
    avg: parseFloat(avg)
  });
});

module.exports = router;
