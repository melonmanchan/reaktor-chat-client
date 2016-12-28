<template>
  <div class="channel-view-wrapper">
    <div class="channel-view">
      <div id="messages" class="pure-g messages">
          <div class="pure-u-7-8 message-area" v-for="m in messages">
            <div class="message-wrapper" v-bind:class="m.type">
              <div class="message-info">
                <span class="username">{{m.user.username}}</span>
                <span class="timestamp">{{ m.date | moment("from") }}</span>
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
import marked   from 'marked'
import emojione from 'emojione'

import { joinChannel } from '../api/channels'

export default {
  data () {
    return {
      messages: [],
      newMessage: '',
      messageBox: null,
      key: null
    }
  },

  watch: {
    messages () {
      this.$nextTick(() => {
        const messageArea = document.getElementById('messages')
        messageArea.scrollTop = messageArea.scrollHeight
      })
    }
  },

  methods: {
    joinChannel (key) {
      return joinChannel(key)
    },

    addMessage (message, user, date, type = 'message') {
      const trimmed = message.replace(/^\s+|\s+$/g, '')
      const withEmojis = emojione.toImage(trimmed)
      const asMarkdown = marked(withEmojis)
      this.messages.push({ type, message: asMarkdown, date, user })
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

      window._socket.emit('message:post', { channel: this.key, message : this.newMessage })

      this.resizeTextArea()
      this.addMessage(this.newMessage, { username: 'You' }, new Date())
      this.newMessage = ''

      return false
    }
  },

  beforeDestroy () {
    window._socket.off('user:joined')
    window._socket.off('message:post')
  },

  mounted () {
    const key = this.$route.params.id
    this.key = key

    window._socket.on('user:joined', (user) => {
      const message = `User ${user.username} joined`

      this.addMessage(message, { username: 'System' }, new Date(), 'system')
    })

    window._socket.on('message:post', (data) => {
      this.addMessage(data.message, data.user, data.date)
    })

    this.messageBox = this.$el.querySelector('#messagebox')
    autosize(this.messageBox)

    this.joinChannel(key)
      .then((res) => {
        console.log(res.data)
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
