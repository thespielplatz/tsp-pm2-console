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
                    reject(false)
                } else {
                    resolve(files)
                }
            })
        })
    },
    getPM2HOMEfromSystemdFile : (file) => {
        try {
            const data = fs.readFileSync(file, 'utf8')
            const home = data.match(/PM2_HOME=.*\.pm2/g)
            if (home == null) return false
            return home[0].replace('PM2_HOME=', '')
        } catch (err) {
            return false
        }
    }
}
 
