import axios from 'axios'

function setAuthorizationToken (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer: ${token}`
}

export { setAuthorizationToken }
