// https://eff-certbot.readthedocs.io/en/stable/using.html#where-are-my-certificates

const fs = require('fs')

const systools = require('./systools.js')

module.exports = {}

module.exports.guessSSLCertificates = async () => {
    console.log('### Searching for SSL Certificates');

    const letsencryptStandardPath = '/etc/letsencrypt/live/'

    const files = await systools.readdir(letsencryptStandardPath)
    if (files === 'ENOENT') {
        console.log(`- No such file or directory ${letsencryptStandardPath}`)
        return false
    }

    if (files === 'EACCES') {
        console.log(`- Permission denied to ${letsencryptStandardPath}`)
        return false
    }

    return files.filter((file) => file !== 'README')
}
