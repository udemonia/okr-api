const chalk = require('Chalk')

const devTerminalOutput = (req,res,next) => {
    console.log(chalk.blue(`Here is the request body`))
    console.log(chalk.magenta(req.body))
}

module.exports = devTerminalOutput