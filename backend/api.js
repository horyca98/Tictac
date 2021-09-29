const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./connection.js");
const userRouter = require("./userRouter.js");
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use("/users", userRouter);

app.listen(5000, () => {
  console.log("Starting server");
});
