<template>
  <div class="login-form">
    <form class="pure-form pure-form-stacked">
      <fieldset>
        <legend>Welcome to the chat.</legend>
        <input v-model="username" id="name" type="text" placeholder="Username" required>

        <div class="pure-controls">
          <button v-on:click="join" type="submit" class="pure-button pure-button-primary">Join</button>
        </div>
      </fieldset>
    </form>
  </div>
</template>

<script>
import config from '../config/config'
import events from '../socket/events'

export default {
  data () {
    return {
      username: '',
      channel: ''
    }
  },

  methods: {
    join (event) {
      event.preventDefault()

      if (!this.username) {
        return
      }

      window._socket = window.io(config.backend, { query: `username=${this.username}` })

      window._socket.on(events.CONNECT, () => {
        window.alert(1)
      })

      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.login-form {
  display: flex;
  justify-content: center;
  align-items: center;

  height: 100vh;

  button {
    margin-top: 10px;
    width: 100%;
  }
}
</style>
