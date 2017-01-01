import Storage from '../localstorage'

const ChannelStore = {
  _publicChannels: [],

  _privateChannels: [],

  deserializeChannels () {
    this._publicChannels = Storage.getPublicChannels()
    this._privateChannels = Storage.getPrivateChannels()
  },

  serializeChannels () {
    Storage.savePublicChannels(this._publicChannels)
    Storage.savePrivateChannels(this._privateChannels)
  },

  getPrivate () {
    return this._privateChannels || []
  },

  addPrivate (channel) {
    this._privateChannels.push(channel)
    this.serializeChannels()
  },

  addPublic (channel) {
    this._privateChannels.push(channel)
    this.serializeChannels()
  },

  getPublic () {
    return this._publicChannels || []
  },

  refreshPublicChannels (channels) {
    this._publicChannels = channels
    this.serializeChannels()
  },

  getChannelNameForKey (key) {
    const channel = [].concat(this._publicChannels, this._privateChannels).find((c) => {
      return c.key === key
    })

    if (typeof channel === 'undefined') {
      return 'Unnamed Channel'
    }

    return channel.name
  }
}

export default ChannelStore
