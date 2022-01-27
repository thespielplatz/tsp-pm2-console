const readline = require('readline')
const colors = require('colors');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'PM2CONSOLE> '
})

rl.on('close', () => {
    console.log(`\n${'User interrupted :('.red} Have a great day!`);
    process.exit(0);
})

module.exports = {
    ask: (options, withCustomResponse) => {
        return new Promise((resolve) => {
            function printQuestion() {
                options.forEach((option, i) => {
                    console.log(`[${i + 1}] ${option}`)
                })
                console.log(`... please choose an option${withCustomResponse === true ? ' or enter the value' : ''}`)

                rl.prompt()
            }

            function lineHandler(line) {
                // check if option exists
                let option = parseInt(line.trim())
                if (option !== NaN) {
                    option -= 1
                    if (option >= 0 && option < options.length) {
                        rl.removeListener('line', lineHandler)
                        resolve(options[option])
                        return
                    }
                }

                if (withCustomResponse) {
                    rl.removeListener('line', lineHandler)
                    resolve(line.trim())
                    return
                } else {
                    printQuestion()
                }
            }

            printQuestion()

            rl.on('line', lineHandler)
        })
    }
}
