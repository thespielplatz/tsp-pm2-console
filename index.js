const systools = require('./modules/systools.js')
const userinput = require('./modules/userinput.js')

const pm2 = require('./modules/pm2.js')
const certbot = require('./modules/certbot.js')

let CONFIG = {
    PM2_HOME : false
};


const guessEverything = async () => {
    // pm2 - home path
    const pm2homes = await pm2.guessPM2HomePath();

    // pm2 - ecosystem.config.js

    // nginx - subdomains and ports

    // certbot - ssl
    const sslCertificates =  await certbot.guessSSLCertificates()
}

const guessNginxConfig = async () => {
    // MAYBE: Veryfiy if nginx is running curl -I 127.0.0.1
    // TODO: Check where nginx files are located
    const installLocations = ['/etc/nginx', '/usr/local/nginx/conf', '/usr/local/etc/nginx']

    const enabledPath = installLocations[0] + '/sites-enabled/'
    const availablePath = installLocations[0] + '/sites-available/'

    let enabledFiles = await systools.readdir(enabledPath)

    if (enabledFiles === 'ENOENT') {
        console.log(`- No such file or directory ${enabledPath}`)
        return false
    }

    if (enabledFiles === 'EACCES') {
        console.log(`- Permission denied to ${enabledPath}`)
        return false
    }

    let availableFiles = await systools.readdir(availablePath)

    if (availableFiles === 'ENOENT') {
        console.log(`- No such file or directory ${enabledPath}`)
        return false
    }

    if (availableFiles === 'EACCES') {
        console.log(`- Permission denied to ${enabledPath}`)
        return false
    }

    enabledFiles.forEach(file => {
        console.log(JSON.stringify(file))
    })

    return true
}

// Call start
(async() => {

    const result = await guessNginxConfig()
    console.log(result)
    console.log("DONE")
})();

/*

        console.log('\nI found the following PM2_HOME configurations:')
        const answer = await userinput.ask(pm2homes, true)

        return answer
 */
