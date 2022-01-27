// exec vs. spawn
// https://stackabuse.com/executing-shell-commands-with-node-js/
const util = require('util')
const fs = require('fs')

module.exports = {
    isRootOrSudo : () => {
        const uid = parseInt(process.env.SUDO_UID)
        return uid === 0 || process.getuid() === 0
    },

    exec : util.promisify(require('child_process').exec) ,
    readdir : (dir) => {
        return new Promise((resolve, reject) => {
            fs.readdir(dir, (err, files) => {
                if (err) {
                    console.log(err)
                    resolve(err.code)
                } else {
                    resolve(files)
                }
            })
        })
    },
}

