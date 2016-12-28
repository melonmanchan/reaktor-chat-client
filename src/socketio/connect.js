import Promise from 'bluebird'
import config from '../config/config'
import events from './events'

function connectSocket (token) {
  return new Promise((resolve, reject) => {
    window._socket = window.io(config.backend, { query: `token=${token}` })

    window._socket.once(events.LOGGED_IN, () => {
      resolve()
    })

    window._socket.once(events.NAME_TAKEN, () => {
      window._socket.disconnect()
      reject({ message: 'That username is taken!' })
    })

    window._socket.once(events.CONNECT_ERROR, () => {
      window._socket.disconnect()
      reject({ message: 'Something went wrong.' })
    })
  })
}

export default connectSocket
