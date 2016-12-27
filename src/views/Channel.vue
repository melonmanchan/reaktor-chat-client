<template>
  <div class="channel-view-wrapper">
    <div class="channel-view">
      <div id="messages" class="pure-g messages">
          <div class="pure-u-7-8" v-for="m in messages">
            <div v-if="m.type === 'system'">
              <p class="system">{{m.message}}</p>
            </div>
            <div v-if="m.type === 'message'">
              <p class="message"><span>{{m.user.username}}: </span>{{m.message}}</p>
            </div>
          </div>
      </div>
      <form class="pure-form pure-g">
          <div class="pure-u-1 controls">
            <textarea id="messagebox" v-on:keyup.enter="sendMessage($event)" v-model="newMessage" class="pure-input-1"> </textarea>
            <button v-on:click="sendMessage" type="submit" class="pure-button pure-button-primary">Send</button>
          </div>
      </form>
    </div>
  </div>
</template>

<script>
import autosize from 'autosize'
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

    addMessage (message, user, type = 'message') {
      this.messages.push({ type, message, user })
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

      if (this.newMessage === '') {
        return
      }

      window._socket.emit('message:post', { channel: this.key, message : this.newMessage })

      this.resizeTextArea()
      this.addMessage(this.newMessage, { username: 'You' })
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

      this.addMessage(message, user, 'system')
    })

    window._socket.on('message:post', (data) => {
      this.addMessage(data.message, data.user)
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

  textarea {
    position: absolute;
    bottom: 20px;
    width: 80% !important;
  }

  button {
    float: right;
    margin-top: 0.7em;
    width: 10% !important;
  }
}
</style>
