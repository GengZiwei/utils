import axios from 'axios'

class HttpRequest {
  constructor (baseUrl) {
    this.baseUrl = baseUrl
  }
  getInsideConfig () {
    let config = {
      baseURL: this.baseUrl,
      timeout: 30000
    }
    return config
  }
  interceptors (instance) { // 请求拦截
    instance.interceptors.request.use(config => {
      config.responseType === 'blob' && (config.timeout = 0)
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      const { data, status } = res
      return { data, status }
    }, error => {
      // 服务器响应码
      return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create()
    this.interceptors(instance)
    return new Promise((resolve, reject) => {
      instance(Object.assign(this.getInsideConfig(), options))
        .then(res => {
          resolve(res.data)
        }).catch(reject)
    })
  }
}

export default HttpRequest
