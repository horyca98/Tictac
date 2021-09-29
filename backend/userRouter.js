const express = require("express");
const app = express();
const connectDB = require("./connection")();
const router = express.Router();

router.get("/getGameDataById", async function (req, res) {
  const userID = req.query.id;
  const user = 1
  res.status(200).json(user.rows[0]);
})

module.exports = router;
