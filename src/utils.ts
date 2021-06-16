import * as https from 'https'
import * as fs from 'fs'

/**
 * Download a resource from `url` to `dest`.
 * @param {string} url - Valid URL to attempt download of resource
 * @param {string} dest - Valid path to save the file.
 * @returns {Promise<void>} - Returns asynchronously when successfully completed download
 */
export function download(url: string, dest: string) {
  return new Promise<void>((resolve, reject) => {
    // Check file does not exist yet before hitting network
    fs.access(dest, fs.constants.F_OK, err => {
      if (err === null) reject('File already exists')

      const request = https.get(url, response => {
        if (response.statusCode === 200) {
          const file = fs.createWriteStream(dest, {flags: 'wx'})
          file.on('finish', () => resolve())
          file.on('error', err => {
            file.close()
            if (err.name === 'EEXIST') reject('File already exists')
            else fs.unlink(dest, () => reject(err.message)) // Delete temp file
          })
          response.pipe(file)
        } else if (response.statusCode === 302 || response.statusCode === 301) {
          //Recursively follow redirects, only a 200 will resolve.
          if (response.headers.location) {
            download(response.headers.location, dest).then(() => resolve())
          }
        } else {
          reject(
            `Server responded with ${response.statusCode}: ${response.statusMessage}`
          )
        }
      })

      request.on('error', err => {
        reject(err.message)
      })
    })
  })
}
