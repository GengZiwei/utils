import Cookies from 'js-cookie'

export const getStorage = (name, localType = true) => {
  const data = localType ? localStorage.getItem(name) : sessionStorage.getItem(name)
  if (!data) return ''
  try {
    return JSON.parse(data)
  } catch (error) {
    return data
  }
}

export const setStorage = (name, value, localType = true) => {
  let data = ''
  if (typeof value === 'object') {
    data = JSON.stringify(value)
  } else {
    data = value || ''
  }
  localType ? localStorage.setItem(name, data) : sessionStorage.setItem(name, data)
  return data
}

export const removeStorage = (name, localType = true) => {
  localType ? localStorage.removeItem(name) : sessionStorage.removeItem(name)
}

/**
 * @description
 * @param {*} key 存储的name值
 * @param {*} value 存储的value值
 * @param {*} [obj={}]
 * expires:定义有效期。如果传入Number，那么单位为天，你也可以传入一个Date对象，表示有效期至Date指定时间。默认情况下cookie有效期截止至用户退出浏览器。
 * path:string 表示此cookie对哪个地址可见。默认为”/”
 * domain:string 表示此cookie对哪个域名可见。设置后cookie会对所有子域名可见。默认为对创建此cookie的域名和子域名可见。
 * secure:boolean 表示cookie传输是否仅支持https。默认为不要求协议必须为https。
  */
export const setCookie = (key, value, obj = {}) => {
  const time = Date.now() + 14 * 60 * 60 * 1000
  Cookies.set(key, value, { expires: new Date(time), ...obj })
}

export const getCookie = (name, obj = {}) => {
  let value = Cookies.get(name, obj)
  if (!value) return value
  try {
    return JSON.parse(value)
  } catch (error) {
    return value
  }
}

export const removeCookie = (key, obj = {}) => {
  return Cookies.remove(key, obj)
}
