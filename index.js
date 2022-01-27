
const systools = require('./modules/systools.js')
const fs = require('fs')

let CONFIG = {
    RUNNING_SYSTEMD : false,
    PM2_HOME : false
}

async function guessPM2HomePath() {
    let pm2homedirs = []
    console.log('### Searching for PM2 Home Directory');

    // Check if systemd is running
    const { stdout, stderr } = await systools.exec('ps --no-headers -o comm 1');
    CONFIG.RUNNING_SYSTEMD = stdout === 'systemd\n'

    console.log(`- Systemd ${CONFIG.RUNNING_SYSTEMD ? 'found' : 'not found'}`)

    if (systools.isRootOrSudo()) {

    }
    // Check systemd files for pm2
    const pathSystemd = '/etc/systemd/system/'
    if (files = await systools.readdir(pathSystemd)) {
        pm2homes = files.reduce((acc, file) => {
            if (file.startsWith('pm2')) {
                if (pm2_home = systools.getPM2HOMEfromSystemdFile(pathSystemd + file)) {
                    acc.push(pm2_home)
                }
            }
 
            return acc
        }, [])

        if (pm2homes.length == 0) {
            console.log(`- Could not find any pm2 files with a PM2_HOME at ${pathSystemd}`)
            return false
        }

        if (pm2homes.length == 1) {
            console.log(`- Found PM2_HOME at ${pm2homes[0]}`)
            return pm2homes[0]
        }

        return pm2homes
    } else {
        console.log(`- Systemd files not found at ${pathSystemd}`)
        return false
    }

}


// Call start
(async() => {
    const pm2home = await guessPM2HomePath();
    CONFIG.PM2_HOME = pm2home
    console.log(CONFIG.PM2_HOME)
    console.log("DONE")
})();

