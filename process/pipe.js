const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  if (req.url == "/pipe") {
    const fileName = path.resolve(__dirname, "data.txt");
    let stream = fs.createReadStream(fileName);
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    stream.pipe(fs.createWriteStream("clone.txt"));
    stream.pipe(res); // 将 res 作为 stream 的 dest
  }
});
server.listen(3000, () => {
  console.log(`server started at port ${3000}`);
});
