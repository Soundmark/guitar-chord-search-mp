import {Promise} from 'es6-promise'
export default class Request {
  constructor () {
    return 0
  }
  request (url, method) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        success (res) {
          resolve(res)
        },
        fail (err) {
          reject(err)
        }
      })
    })
  }
  get (url) {
    return this.request(url, 'GET')
  }
}
