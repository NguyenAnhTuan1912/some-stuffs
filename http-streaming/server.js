import http from "http";
import fs from "fs";

import express from "express";
import cors from "cors";

const app = express();
const router = express.Router();

function wait(fn, timeout) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res(fn());
    }, timeout);
  });
}

app.use(cors({ origin: "*" }));

function main() {
  const instance = http.createServer(app);
  let HOST = process.env.HOST || "0.0.0.0";
  let PORT = process.env.PORT || "12010";

  router.get("/", (req, res) => {
    return res.json({ message: "Welcome to http streaming example" });
  });

  router.get("/data", (req, res) => {
    res.setHeader("content-type", "application/json");
    // This is where the magic happens: set a stream as the response body
    const read = fs.createReadStream("./db.json", { highWaterMark: 512 });
    read.on("data", (chunk) => {
      res.write(chunk);
    });
  });

  router.get("/text", (req, res) => {
    res.setHeader("content-type", "application/text");
    // This is where the magic happens: set a stream as the response body
    const read = fs.createReadStream("./text.txt", { highWaterMark: 8 });
    read.on("data", async (chunk) => {
      res.write(chunk);
      read.pause();
      await wait(() => {
        read.resume();
      }, 50);
    });
  });

  app.use(router);

  // Run server
  instance.listen(PORT, HOST, function () {
    console.log(`Your server is running on http://${HOST}:${PORT}`);
  });
}

// Call main
main();
