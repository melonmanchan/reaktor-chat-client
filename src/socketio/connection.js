import Promise from 'bluebird'
import config from '../config/config'
import events from './events'

function connectSocket (token) {
  return new Promise((resolve, reject) => {
    window._socket = window.io(config.backend, { query: `token=${token}`, forceNew: true })

    window._socket.once(events.LOGGED_IN, () => {
      resolve()

      window._socket.off(events.NAME_TAKEN)
      window._socket.off(events.CONNECT_ERROR)
    })

    window._socket.once(events.NAME_TAKEN, () => {
      window._socket.disconnect()
      reject(new Error('That name is already taken'))
    })

    window._socket.once(events.CONNECT_ERROR, () => {
      window._socket.disconnect()
      reject(new Error('Error connecting to server'))
    })
  })
}

function disconnectSocket () {
  window._socket.disconnect()
  window._socket = null
}

export { connectSocket, disconnectSocket }
