import axios from 'axios'
import config from '../config/config'

function joinChannel (key) {
  return axios.post(`${config.backend}/channels/${key}/join`)
}

function createChannel (name, isPublic) {
  return axios.post(`${config.backend}/channels`, { name, isPublic })
}

function getChannels () {
  return axios.get(`${config.backend}/channels`)
}

function loadHistory (key, start, end) {
  return axios.get(`${config.backend}/channels/${key}/messages?start=${start}&end=${end}`)
}

export { getChannels, joinChannel, createChannel, loadHistory }
