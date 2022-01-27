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

// Call start
(async() => {
    const sslCertificates =  await certbot.guessSSLCertificates()

    console.log(sslCertificates)
    console.log("DONE")
})();

/*

        console.log('\nI found the following PM2_HOME configurations:')
        const answer = await userinput.ask(pm2homes, true)

        return answer
 */
