const fs = require('fs')

const systools = require('./systools.js')

module.exports = {}

module.exports.guessPM2HomePath = async () => {
    let pm2homedirs = [];
    console.log('### Searching for PM2 Home Directory');

    // Check if systemd is running
    const { stdout, stderr } = await systools.exec('ps --no-headers -o comm 1');
    let isSystemdRunning = stdout === 'systemd\n'

    console.log(`- Systemd ${isSystemdRunning ? 'found' : 'not found'}`)

    // Check systemd files for pm2
    const pathSystemd = '/etc/systemd/system/'
    if (files = await systools.readdir(pathSystemd)) {
        if (files === 'ENOENT') {
            console.log(`- No such file or directory ${pathSystemd}`)
            return false
        }

        if (files === 'EACCES') {
            console.log(`- Permission denied to ${pathSystemd}`)
            return false
        }

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

        if (pm2homes.length > 1) {
            console.log(`- Found multiple PM2_HOME paths`)
            return false
        }

        console.log(`- Found PM2_HOME at ${pm2homes[0]}`)
        return pm2homes[0]
    } else {
        console.log(`- Systemd files not found at ${pathSystemd}`)
        return false
    }
}

