// Custom Node.js production server for Site.eu / DirectAdmin / cPanel / Phusion Passenger environments
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOST || "0.0.0.0";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error("Error occurred handling request:", req.url, err);
        res.statusCode = 500;
        res.end("Internal Server Error");
      }
    }).listen(port, () => {
      console.log(`> MaisonCare production server ready on http://${hostname}:${port}`);
    });
  })
  .catch((err) => {
    console.error("Error starting MaisonCare server:", err);
    process.exit(1);
  });

