import axios from 'axios'

/* 通过Symbol控制外部没法进行访问方法 */
const addPending = Symbol('addPending')
const interceptors = Symbol('interceptors')
const removePending = Symbol('removePending')

export default class HttpRequest {
  constructor (baseUrl) {
    this.baseUrl = baseUrl
    this.pending = new Map()
  }

  getInsideConfig () { // 默认配置
    let config = {
      baseURL: this.baseUrl,
      timeout: 30000
    }
    return config
  }

  clearPending () { // 清空当前全部请求
    for (const [url, cancel] of this.pending) {
      cancel(url)
    }
    this.pending.clear()
  }

  [interceptors] (instance) { // 请求拦截
    instance.interceptors.request.use(config => {
      config.paddingURl = config.url // 保证请求成功之后返回的config url一致
      config.responseType === 'blob' && (config.timeout = 0)
      this[removePending](config)
      this[addPending](config)
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(response => {
      this[removePending](response.config) // 结束之后进行清除
      return response
    }, error => {
      if (axios.isCancel(error)) { // 判断是否是自动取消的
        error.cancel = true
      }
      // 服务器响应码
      return Promise.reject(error)
    })
  }

  [addPending] (config) { // 添加单独请求
    const { method, paddingURl, params, data } = config
    let setKey = [
      method, paddingURl,
      JSON.stringify(params),
      JSON.stringify(data)
    ].join('&')
    config.cancelToken = config.cancelToken || new axios.CancelToken(cancel => {
      if (!this.pending.has(setKey)) { // map里面没有当前值进行添加
        this.pending.set(setKey, cancel)
      }
    })
  }

  [removePending] (config) { // 清空单独请求
    const { method, paddingURl, params, data } = config
    let getKey = [
      method, paddingURl,
      JSON.stringify(params),
      JSON.stringify(data)
    ].join('&')

    if (this.pending.has(getKey)) { // map有值进行数据清除
      const cancel = this.pending.get(getKey)
      cancel(getKey)
      this.pending.delete(getKey)
    }
  }

  request (options) { // 进行请求方法
    const instance = axios.create(this.getInsideConfig())
    this[interceptors](instance)
    return new Promise((resolve, reject) => {
      instance(options)
        .then(res => {
          resolve(res.data)
        }).catch(reject)
    })
  }
}
