const chalk = require("chalk");

function requestLogger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const status = res.statusCode;

    let statusColor = chalk.green;
    if (status >= 500) statusColor = chalk.red;
    else if (status >= 400) statusColor = chalk.yellow;
    else if (status >= 300) statusColor = chalk.cyan;

    const methodColors = {
      GET: chalk.blue,
      POST: chalk.green,
      PUT: chalk.yellow,
      PATCH: chalk.magenta,
      DELETE: chalk.red,
    };

    const methodColor = methodColors[req.method] || chalk.white;

    let timeColor = chalk.green;
    if (duration > 1000) timeColor = chalk.red;
    else if (duration > 500) timeColor = chalk.yellow;

    // 🧾 Final log
    console.log(
      [
        chalk.gray(new Date().toISOString()), // timestamp
        methodColor.bold(req.method), // method
        chalk.white(req.originalUrl), // route
        statusColor.bold(status), // status
        timeColor(`${duration}ms`), // duration
      ].join("  "),
    );
  });

  next();
}

module.exports = requestLogger;
