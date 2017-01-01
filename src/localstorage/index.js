const PREFIX = 'chat__'

const Storage = {
  saveLoggedInUser (user) {
    window.localStorage.setItem(PREFIX + 'user', JSON.stringify(user))
  },

  getLoggedInUser () {
    return JSON.parse(window.localStorage.getItem(PREFIX + 'user'))
  },

  saveAuthInfo (info) {
    window.localStorage.setItem(PREFIX + 'info', JSON.stringify(info))
  },

  getAuthInfo () {
    return JSON.parse(window.localStorage.getItem(PREFIX + 'info'))
  },

  saveAvailableChannels (channels) {
    window.localStorage.setItem(PREFIX + 'channels', JSON.stringify(channels))
  },

  getAvailableChannels () {
    return JSON.parse(window.localStorage.getItem(PREFIX + 'channels'))
  },

  clearStorage () {
    window.localStorage.clear()
  },

  getTokenIfValid () {
    const authInfo = this.getAuthInfo()

    if (!authInfo) {
      return
    }

    if (Date.now() < authInfo.expiresIn) {
      return authInfo.token
    }
  }
}

export default Storage
