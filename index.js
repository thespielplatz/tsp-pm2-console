const systools = require('./modules/systools.js')
const userinput = require('./modules/userinput.js')
const nginx = require('./modules/nginx.js')

const pm2 = require('./modules/pm2.js')
const certbot = require('./modules/certbot.js')

let CONFIG = {
    PM2_HOME : false
};

let domains = {}

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
    //const sslCertificates =  await certbot.guessSSLCertificates()
    //console.log(sslCertificates)
    let domains = await nginx.guessNginxConfig(certbot.letsencryptPath)

    const ports = await pm2.getProjects()

    domains.forEach(domain => {
        if (domain.port in ports) {
            domain.name = ports[domain.port].name
            domain.cwd = ports[domain.port].cwd
            domain.script = ports[domain.port].script
            domain.status = ports[domain.port].status
            domain.autorestart = ports[domain.port].autorestart
            domain.watch = ports[domain.port].watch
            domain.restart = ports[domain.port].restart

        }
    })

    domains = domains.sort((a, b) => {
        var nameA = a.domain.toUpperCase(); // ignore upper and lowercase
        var nameB = b.domain.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }

        // names must be equal
        return 0;
    }).map(d => { return {
        Domain: d.domain,
        Port: d.port,
        cert: d.ssl.length > 0 ? "yes" : "no",
        'PM2 Name': d.name,
        Status: d.status,
        autorestart: ('autorestart' in d ? d.autorestart : '-'),
        watch: ('watch' in d ? d.watch : '-'),
        restart: ('restart' in d ? d.restart : '-')
    }
    })
    console.table(domains)
    console.log("DONE")
})();

/*

        console.log('\nI found the following PM2_HOME configurations:')
        const answer = await userinput.ask(pm2homes, true)

        return answer
 */
