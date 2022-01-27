const fs = require('fs')

const systools = require('./systools.js')

function getPM2HOMEfromSystemdFile(file) {
    try {
        const data = fs.readFileSync(file, 'utf8')
        const home = data.match(/PM2_HOME=.*\.pm2/g)
        if (home == null) return false
        return home[0].replace('PM2_HOME=', '')
    } catch (err) {
        return false
    }
}

module.exports = {}

const ecosystemFile = '/home/pm2/ecosystem.config.js'
const runtimeinfoCmd = 'PM2_HOME=/home/pm2/.pm2/ pm2 jlist'

module.exports.getProjects = async () => {
    let ports = {}

    const { stdout, stderr } = await systools.exec(runtimeinfoCmd)
    const runtimeInfoAll = JSON.parse(stdout)

    try {
        let ecosystem = require(ecosystemFile)

        ecosystem.apps.forEach(app => {
            ports[app.env.NODE_PORT] = {
                name: app.name,
                cwd: app.cwd,
                script: app.script
            }

            // Check Runtime info
            runtimeInfoAll.forEach(rti => {
                if (rti.name == app.name) {
                    ports[app.env.NODE_PORT].status = rti.pm2_env.status
                    ports[app.env.NODE_PORT].autorestart = rti.pm2_env.autorestart
                    ports[app.env.NODE_PORT].watch = rti.pm2_env.watch
                    ports[app.env.NODE_PORT].restart = rti.pm2_env.restart_time

                }
            })

        })
    } catch (err) {
        console.log(`Error reading ecosystem file ${ecosystemFile}`.red)
        console.log(err)
    }


    return ports
}

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
                if (pm2_home = getPM2HOMEfromSystemdFile(pathSystemd + file)) {
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

