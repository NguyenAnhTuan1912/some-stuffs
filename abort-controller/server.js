const http = require("http");

const hostname = "0.0.0.0";
const port = 3030;

function sendJSON(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "text/json");
  res.end(JSON.stringify(data));
}

const mapEndpoints = new Map();

mapEndpoints.set("/heavy-task", {
  method: "GET",
  /**
   *
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse<http.IncomingMessage> & {req: http.IncomingMessage;}} res
   */
  handler(req, res) {
    let start = Date.now(),
      end = 0;

    for (let i = 0; i < 60_000_000; i++) {
      Date.now();
    }

    end = Date.now();

    sendJSON(res, 200, {
      message: `Execute time is ${parseInt((end - start) / 1000)} second - [${
        end - start
      }] in miliseconds`,
    });
  },
});

mapEndpoints.set("/", {
  method: "GET",
  /**
   *
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse<http.IncomingMessage> & {req: http.IncomingMessage;}} res
   */
  handler(req, res) {
    sendJSON(res, 200, {
      message: "Hello, welcome to AbortController test API!",
    });
  },
});

const server = http.createServer((req, res) => {
  const endpoint = mapEndpoints.get(req.url);

  // Allow CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (endpoint) {
    if (endpoint.method.toLowerCase() === "get") {
      endpoint.handler(req, res);
    } else {
      sendJSON(res, 400, {
        message: `Method [${endpoint.method}] isn't supported`,
      });
    }
  } else {
    sendJSON(res, 400, { message: `The endpoint [${req.url}] isn't found` });
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
