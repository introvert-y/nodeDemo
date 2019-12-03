const http = require("http");
const chalk = require("chalk");
const fork = require("child_process").fork;
const cpusLength = require("os").cpus().length;

const tempelate = chalk.yellow.bold;

console.log(tempelate(`cpu核心数${cpusLength}`));

const server = http.createServer((req, res) => {
  if (req.url == "/compute") {
    const compute = fork("./fork_compute.js");
    compute.send("开启一个新的子进程");

    // 当一个子进程使用 process.send() 发送消息时会触发 'message' 事件
    compute.on("message", sum => {
      res.end(`Sum is ${sum}`);
      compute.kill();
    });

    // 子进程监听到一些错误消息退出
    compute.on("close", (code, signal) => {
      console.log(
        tempelate(
          `收到close事件，子进程收到信号 ${signal} 而终止，退出码 ${code}`
        )
      );
      compute.kill();
    });
    compute.on("exit", code => {
      console.log(`子进程使用代码 ${code} 退出`);
    });
  } else {
    res.end(`ok`);
  }
});
server.listen(3000, () => {
  console.log(`server started at port ${3000}`);
});
