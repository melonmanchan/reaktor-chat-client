import axios from 'axios'
import config from '../config/config'

function login (name) {
  return axios.post(`${config.backend}/auth/login`, { name })
}

export { login }
