<template>
  <div class="login-form">
    <form class="pure-form pure-form-stacked">
      <fieldset>
        <legend>Welcome to the chat</legend>
        <input v-bind:class="{error: errorMessage }" v-model="username" id="name" type="text" placeholder="Username" required>
        <div v-if="errorMessage" class="error-message">{{errorMessage}}</div>
        <div class="pure-controls">
          <button :disabled="joinDisabled" v-on:click="join" type="submit" class="pure-button pure-button-primary">Join</button>
        </div>
      </fieldset>
    </form>
  </div>
</template>

<script>
import config from '../config/config'
import events from '../socketio/events'

export default {
  data () {
    return {
      username: '',
      errorMessage: null,
      joinDisabled: false
    }
  },

  watch: {
    username (val) {
      if (val === '') {
        this.errorMessage = null
      }
    }
  },

  methods: {
    join (event) {
      event.preventDefault()

      if (!this.username) {
        return
      }

      this.joinDisabled = true

      window._socket = window.io(config.backend, { query: `username=${this.username}` })

      window._socket.once(events.LOGGED_IN, () => {
        console.log('logged in')
      })

      window._socket.once(events.NAME_TAKEN, () => {
        this.errorMessage = 'That username is taken!'
        this.joinDisabled = false
        window._socket.disconnect()
      })

      window._socket.once(events.CONNECT_ERROR, () => {
        this.errorMessage = 'Something went wrong. Try again later.'
        this.joinDisabled = false
        window._socket.disconnect()
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

  legend {
    text-align: center;
  }

  .error {
    background-color: #fce4e4;
    border: 1px solid #cc0033;
    outline: none;
  }

  .error-message {
    color: #cc0033;
    display: inline-block;
    font-size: 12px;
    line-height: 15px;
    margin: 5px 0 0;
  }

}
</style>
