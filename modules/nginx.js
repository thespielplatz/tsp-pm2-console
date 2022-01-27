const systools = require('./systools.js')
const fs = require('fs')
const colors = require('colors');

module.exports = {

    guessNginxConfig : async (letsencryptPath) => {
        let domains = []

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

        availableFiles.forEach(file => {
            // Ignoring Default file
            //if (file === 'default') return

            try {
                const data = fs.readFileSync(availablePath + file, 'utf8')
                const servernamesMatches = data.match(/server_name .*;/gm)
                if (servernamesMatches == null) return;

                // Get the ports
                let port = undefined
                const portMatches = data.match(/proxy_pass http:\/\/127\.0\.0\.1:[0-9]{4}/gm)
                if (portMatches != null) {
                    port = portMatches[0].slice(-4)
                }

                // Get the ssl certificates
                let certificates = []
                const certificateMatches = data.matchAll(`ssl_certificate ${letsencryptPath}.*;`, 'gm')
                for (const match of certificateMatches) {
                    certificates.push(match[0])
                }

                servernamesMatches.forEach(line => {
                    line = line.slice('server_name'.length + 1, -1)
                    const foundDomains = line.split(' ')

                    foundDomains.forEach(d => {
                        domains.push({
                            domain: d,
                            port,
                            ssl: certificates
                        })
                    })
                })


            } catch (err) {
                console.log(`error reading or parsing file: ${availablePath + file}`.red)
                console.log(err)
            }
        })

        return domains
    }
}
