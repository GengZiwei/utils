import HttpRequest from './axios'

const api = 'http://localhost:9999/api/'

const request = new HttpRequest(api).request

export default request