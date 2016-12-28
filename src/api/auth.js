import axios from 'axios'
import config from '../config/config'

function login (name, password) {
  return axios.post(`${config.backend}/auth/login`, { name, password })
}

function register (name, password) {
  return axios.post(`${config.backend}/auth/register`, { name, password })
}

export { login, register }
