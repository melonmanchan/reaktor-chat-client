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
import { sendNotification } from '../notifications'
import { joinChannel, loadHistory } from '../api/channels'
import { stringArrayToJSON, markdownifyString, emojifyString } from '../utils'

export default {
  data () {
    return {
      messages: [],
      newMessage: '',
      messageBox: null,
      messageArea: null,

      key: null,
      name: null,

      historyLoaded: false,
      historyPoint: 0,
      historyIncrement: 25
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
    window._socket.off(events.USER_JOINED)
    window._socket.off(events.USER_LEFT)
    window._socket.off(events.MESSAGE_POST)
  },

  mounted () {
    const key = this.$route.params.id
    const name = this.$route.params.name

    document.title = `${name}`

    this.key = key
    this.name = name

    this.messageBox = this.$el.querySelector('#messagebox')
    this.messageArea = this.$el.querySelector('#messages')

    window.onfocus = () => { this.disableTitleNotify() }

    window._socket.on(events.USER_JOINED, (user) => {
      const message = `User ${user.username} joined...`

      this.addMessage(message, { username: 'System' }, new Date(), 'system')
    })

    window._socket.on(events.USER_QUIT, (user) => {
      const message = `User ${user.username} quit...`

      this.addMessage(message, { username: 'System' }, new Date(), 'system')
    })

    window._socket.on(events.MESSAGE_POST, (data) => {
      this.addMessage(data.message, data.user, data.date)
    })

    autosize(this.messageBox)

    this.joinChannel(key)
      .then((res) => {
        this.addMessagesToHistory(res.data.messages)
        this.scrollMessageBoxToBottom()
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
  height: 100vh;
  width: 100vw;
}

.channel-view {
  height: 90vh;
  width: 95vw;

  .messages {
    overflow-y: auto;
    height: 90vh;
  }

  #messagebox {
    position: absolute;
    bottom: 20px;
    width: 90%;
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
