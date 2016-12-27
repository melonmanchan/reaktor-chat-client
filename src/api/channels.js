import axios from 'axios'
import config from '../config/config'

function joinChannel (key) {
  return axios.post(`${config.backend}/channels/${key}/join`)
}

function getChannels () {
  return axios.get(`${config.backend}/channels`)
}

export { getChannels, joinChannel }
