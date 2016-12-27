import axios from 'axios'
import config from '../config/config'

function getChannels () {
  return axios.get(`${config.backend}/channels`)
}

export { getChannels }
