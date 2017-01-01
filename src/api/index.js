import axios from 'axios'

function setAuthorizationToken (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer: ${token}`
}

function deleteAuthorizationToken () {
  delete axios.defaults.headers.common['Authorization']
}

export { setAuthorizationToken, deleteAuthorizationToken }
