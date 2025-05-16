import cors from "cors";
import express from "express";
import http from "http";

const app = express();
const router = express.Router();

// Add some global middlewares
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

router.get("/event", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  let counter = 0;
  const intervalId = setInterval(() => {
    console.log("Send message to client");
    const data = `data: Hello from server ${counter}\n\n`;
    res.write(data);
    counter++;
  }, 1000);

  req.on("close", () => {
    console.log("Client request to close");
    clearInterval(intervalId);
    res.end();
  });
});

router.get("/", (req, res) => {
  return res
    .status(200)
    .json({ message: "Welcome to EventSource test api server" });
});

function main() {
  const instance = http.createServer(app);
  let HOST = process.env.HOST || "0.0.0.0";
  let PORT = process.env.PORT || "12000";

  app.use(router);

  // Run server
  instance.listen(PORT, HOST, function () {
    console.log(`Your server is running on http://${HOST}:${PORT}`);
  });
}

// Call main
main();
