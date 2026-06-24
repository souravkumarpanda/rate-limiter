const express = require("express");
const ip = require("ip");
const { hideIp } = require("./helpers/hideip");
const redisClient = require("./helpers/redis");

const MAX_ALLOWED_REQUESTS = 5;
const MAX_TIME = 30;

const app = express();

app.use(async (req, res, next) => {
  const myIp = hideIp(ip.address());

  const request = await redisClient.incr(myIp);

  if (request === 1) {
    await redisClient.expire(myIp, MAX_TIME);
  }

  if (request > MAX_ALLOWED_REQUESTS) {
    return res.status(429).json({ message: "too many requests" });
  }

  next();
});

app.get("/", (req, res) => {
  console.log("Request received");
  res.status(200).send("ok");
});

app.listen(8000, () => console.log("Server is running on port 8000"));
