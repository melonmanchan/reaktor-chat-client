<template>
  <div class="channel-view">
    <div class="pure-g messages">
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
        <div class="pure-u-4-5">
            <input v-model="newMessage" class="pure-input-1" type="text">
        </div>
        <div class="pure-u-1-5">
          <button v-on:click="sendMessage" type="submit" class="pure-button pure-button-primary">Send</button>
        </div>
    </form>
  </div>
</template>

<script>
import { joinChannel } from '../api/channels'

export default {
  data () {
    return {
      messages: [],
      newMessage: '',
      key: null
    }
  },

  methods: {
    joinChannel (key) {
      return joinChannel(key)
    },
    sendMessage (e) {
      e.preventDefault()

      if (this.newMessage === '') {
        return
      }

      window._socket.emit('message:post', { channel: this.key, message : this.newMessage })

      this.messages.push({ type: 'message', message: this.newMessage, user: { username: 'You' } })

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

    window._socket.on('user:joined', (data) => {
      const message = { type: 'system', message: `User ${data.username} joined.` }

      this.messages.push(message)
    })

    window._socket.on('message:post', (data) => {
      data.type = 'message'
      this.messages.push(data)
    })

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

<style lang="scss" scoped>
.channel-view {
  height: 100vh;
  width: 100vw;

  .messages {
    overflow-y: scroll;
    height: 90vh;
  }

  button {
    float: right;
  }
}
</style>
