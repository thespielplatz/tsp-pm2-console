// https://eff-certbot.readthedocs.io/en/stable/using.html#where-are-my-certificates
const fs = require('fs')

const systools = require('./systools.js')

module.exports = {}

module.exports.letsencryptPath = '/etc/letsencrypt/live/'

module.exports.guessSSLCertificates = async () => {
    console.log('### Searching for SSL Certificates');

    const files = await systools.readdir(this.letsencryptStandardPath)
    if (files === 'ENOENT') {
        console.log(`- No such file or directory ${this.letsencryptStandardPath}`)
        return false
    }

    if (files === 'EACCES') {
        console.log(`- Permission denied to ${this.letsencryptStandardPath}`)
        return false
    }

    return files.filter((file) => file !== 'README')
}
