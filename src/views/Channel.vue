<template>
  <div class="channel-view-wrapper">
    <div class="channel-view">
      <div v-on:scroll="handleHistoryScroll" id="messages" class="pure-g messages">
          <div class="pure-u-7-8 message-area" v-for="m in messages">
            <div class="message-wrapper" v-bind:class="m.type">
              <div class="message-info">
                <span class="username">{{m.user.username || m.user}}</span>
                <span class="timestamp" :title="m.date | moment('HH:MM:SS DD/MM/YYYY')">{{ m.date | moment("from") }}</span>
              </div>
              <div class="message-content" v-html="m.message"></div>
            </div>
          </div>
      </div>
      <form class="pure-form pure-g">
          <div class="pure-u-1 controls">
            <textarea placeholder="Your message..." id="messagebox" v-on:keyup.enter="sendMessage($event)" v-model="newMessage" class="pure-input-1"> </textarea>
            <button v-on:click="sendMessage" type="submit" class="pure-button pure-button-primary">Send</button>
          </div>
      </form>
    </div>
  </div>
</template>

<script>
import autosize from 'autosize'
import debounce from 'lodash.debounce'

import events from '../socketio/events'
import Storage from '../localstorage'
import { sendNotification } from '../notifications'
import { joinChannel, loadHistory } from '../api/channels'
import { stringArrayToJSON, markdownifyString, emojifyString } from '../utils'

export default {
  name: 'channel',

  data () {
    return {
      messages: [],

      newMessage: '',
      messageBox: null,
      messageArea: null,

      key: null,
      name: null,
      currentUser: {},

      historyLoaded: false,
      historyPoint: 0,
      historyIncrement: 25,

      setSelfAwayTimer: null
    }
  },

  methods: {
    handleHistoryScroll: debounce(function (event) {
      if (this.historyLoaded) {
        return
      }

      const scrollAmount = this.messageArea.scrollTop

      if (scrollAmount < 500) {
        this.loadMoreHistory()
      }
    }, 500),

    scrollMessageBoxToBottom () {
      this.$nextTick(() => {
        this.messageArea.scrollTop = this.messageArea.scrollHeight
      })
    },

    joinChannel (key) {
      return joinChannel(key)
    },

    formatMessage (str) {
      return emojifyString(markdownifyString(str))
    },

    startSelfAwayTimer () {
      this.setSelfAwayTimer = window.setTimeout(() => {
        this.setSelfAway()
      }, 30000)
    },

    stopSelfAwayTimer () {
      window.clearTimeout(this.setSelfAwayTimer)
    },

    loadMoreHistory () {
      const start = this.historyPoint
      const end = start + this.historyIncrement

      const oldHeight = this.messageArea.scrollHeight

      loadHistory(this.key, start, end)
        .then(res => {
          this.addMessagesToHistory(res.data.messages, oldHeight)
        })
        .catch(e => {
          console.log(e)
        })
    },

    addMessagesToHistory (apiArray, oldHeight) {
      const messagesAsObjects = stringArrayToJSON(apiArray)

      const formattedMessages = messagesAsObjects.map(m => {
        m.message = this.formatMessage(m.message)
        m.type = 'user'

        return m
      })

      this.messages = formattedMessages.concat(this.messages)

      // We want to keep user scroll at the position it was at before loading new stuff
      if (oldHeight) {
        this.$nextTick(() => {
          const scrollDiff = this.messageArea.scrollHeight - oldHeight
          this.messageArea.scrollTop += scrollDiff
        })
      }

      // No more messages in history to load
      if (formattedMessages.length < 25) {
        this.historyLoaded = true
      }

      this.historyPoint += formattedMessages.length
    },

    addMessage (message, user, date, type = 'message') {
      const trimmed = message.replace(/^\s+|\s+$/g, '')
      const formatted = this.formatMessage(trimmed)

      this.messages.push({ type, message: formatted, date, user })

      if (document.hidden) {
        sendNotification(`${this.name} | ${user.username}`, message)
        this.enableTitleNotify()
      }

      // Check whether or not user is scrolling the history.
      // If not, scroll the message area down
      if (Math.abs(this.messageArea.scrollTop - this.messageArea.scrollHeight) < 2000) {
        this.scrollMessageBoxToBottom()
      }
    },

    enableTitleNotify () {
      if (!document.title.startsWith('*')) {
        document.title = '*' + document.title
      }
    },

    disableTitleNotify () {
      if (document.title.startsWith('*')) {
        document.title = document.title.substring(1)
      }
    },

    resizeTextArea () {
      setTimeout(() => {
        const evt = document.createEvent('Event')
        evt.initEvent('autosize:update', true, false)
        this.messageBox.dispatchEvent(evt)
      }, 0)
    },

    broadcastStatusChange (username, status) {
      this.$bus.emit('users:status_changed', { username, status })
    },

    broadcastUserLeft (user) {
      this.$bus.emit('users:leave', user)
    },

    broadcastUserJoined (user) {
      user.status = 'online'
      this.$bus.emit('users:join', user)
    },

    setSelfAway () {
      window._socket.emit(events.USER_STATUS_CHANGE, { channel: this.key, status : 'away' })
    },

    setSelfOnline () {
      window._socket.emit(events.USER_STATUS_CHANGE, { channel: this.key, status : 'online' })
    },

    sendMessage (e) {
      if (e.shiftKey && e.code === 'Enter') {
        return
      }

      e.preventDefault()

      if (this.newMessage === '' || !(/\S/.test(this.newMessage))) {
        this.newMessage = ''
        return
      }

      window._socket.emit(events.MESSAGE_POST, { channel: this.key, message : this.newMessage })

      this.resizeTextArea()
      this.addMessage(this.newMessage, { username: 'You' }, new Date())
      this.newMessage = ''
      this.scrollMessageBoxToBottom()

      return false
    }
  },

  beforeDestroy () {
    delete window.onfocus
    delete window.onblur

    window._socket.off(events.USER_JOINED)
    window._socket.off(events.USER_LEFT)
    window._socket.off(events.USER_QUIT)
    window._socket.off(events.MESSAGE_POST)
    window._socket.off(events.USER_STATUS_CHANGE)

    window._socket.emit(events.USER_LEFT, { channel: this.key })

    this.broadcastUserLeft(this.currentUser)
  },

  mounted () {
    const key = this.$route.params.id
    const name = this.$route.params.name

    document.title = `${name}`

    this.key = key
    this.name = name
    this.currentUser = Storage.getLoggedInUser()

    this.messageBox = this.$el.querySelector('#messagebox')
    this.messageArea = this.$el.querySelector('#messages')

    window.onfocus = () => {
      this.disableTitleNotify()
      this.stopSelfAwayTimer()
      this.setSelfOnline()
    }

    window.onblur = () => {
      this.startSelfAwayTimer()
    }

    window._socket.on(events.USER_STATUS_CHANGE, (data) => {
      const username = data.user
      const status = data.status

      this.broadcastStatusChange(username, status)
    })

    window._socket.on(events.USER_JOINED, (user) => {
      const message = `User ${user.username} joined the channel...`

      this.addMessage(message, { username: 'System' }, new Date(), 'system')
      this.broadcastUserJoined(user)
    })

    window._socket.on(events.USER_QUIT, (user) => {
      const message = `User ${user.username} quit...`

      this.addMessage(message, { username: 'System' }, new Date(), 'system')
      this.broadcastUserLeft(user)
    })

    window._socket.on(events.USER_LEFT, (data) => {
      const message = `User ${data.user} left the channel...`

      this.addMessage(message, { username: 'System' }, new Date(), 'system')
      this.broadcastUserLeft({ username: data.user })
    })

    window._socket.on(events.MESSAGE_POST, (data) => {
      this.addMessage(data.message, data.user, data.date)
    })

    autosize(this.messageBox)

    this.joinChannel(key)
      .then((res) => {
        this.addMessagesToHistory(res.data.messages)
        this.scrollMessageBoxToBottom()
        this.$bus.emit('users:refresh', res.data.onlineUsers)
      })
      .catch(e => {
        console.log(e)
      })
  }
}
</script>

<style lang="scss">

.channel-view-wrapper {
  display: flex;
  justify-content: center;
}

.channel-view {
  margin-top: 10px;
  height: 90%;
  width: 95%;

  .messages {
    overflow-y: auto;
    height: 90vh;
  }

  .controls {
    position: relative;
    top: 60px;
  }

  #messagebox {
    position: absolute;
    bottom: 0;
    width: 100%;
  }

  button {
    float: right;
    margin-top: 0.7em;
    width: 10% !important;
  }

  @media (min-width: 600px) {
    button {
      display: none;
    }
  }

  @media (max-width: 600px) {
    #messagebox {
     width: 80%;
    }
  }

  .message-wrapper {
    min-height: 80px;
  }

  .message-info {
    width: 250px;
    font-size: 0.8em;
  }

  .message-area {
    width: 95%;
  }

  .message-content {
    line-height: 1.7;
    white-space: pre-wrap;
    font-size: 0.9em;
    margin-top: 10px;
  }

  .username {
    font-weight: 700;
  }

  .timestamp {
    opacity: 0.6;
    float: right;
  }

}
</style>
