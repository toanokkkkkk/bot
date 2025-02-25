const { spawn } = require("child_process");
const logger = require("./utils/log.js");
async function startBot(index) {
  logger(`Starting child process ${index}`, "[ Starting ]");
  const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "main.js"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true,
    env: {
      ...process.env,
      CHILD_INDEX: index,
    },
  });

  child.on("close", async (codeExit) => {
    if (codeExit !== 0 || global.countRestart && global.countRestart < 5) {
      await startBot(index);
      return;
    }
    return;
  });

  child.on("error", (error) => {
    logger(`An error occurred: ${JSON.stringify(error)}`, "[ Starting ]");
  });
}

startBot(0);
