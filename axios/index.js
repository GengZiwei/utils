import HttpRequest from './axios'

const api = process.env.BASE_URL

export default new HttpRequest(api)
