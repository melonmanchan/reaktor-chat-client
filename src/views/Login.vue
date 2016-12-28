<template>
  <div class="login-form">
    <form class="pure-form pure-form-stacked">
      <fieldset>
        <legend>Welcome to the chat</legend>
        <div v-if="errorMessage" class="error-message">{{errorMessage}}</div>
        <input v-bind:class="{error: errorMessage }" v-model="username" id="name" type="text" placeholder="Username" required>
        <input v-bind:class="{error: errorMessage }" v-model="password" id="password" type="password" placeholder="Password" required>
        <div class="pure-controls">
          <button :disabled="joinDisabled" v-on:click="join" type="submit" class="pure-button pure-button-primary">Join</button>
        </div>
      </fieldset>
    </form>
  </div>
</template>

<script>
import Promise from 'bluebird'

import config                    from '../config/config'
import { login }                 from '../api/auth'
import { setAuthorizationToken } from '../api'
import events                    from '../socketio/events'

export default {
  data () {
    return {
      username: '',
      password: '',
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
    connectSocket (token) {
      return new Promise((resolve, reject) => {
        window._socket = window.io(config.backend, { query: `token=${token}` })

        window._socket.once(events.LOGGED_IN, () => {
          resolve()
        })

        window._socket.once(events.NAME_TAKEN, () => {
          window._socket.disconnect()
          reject({ message: 'That username is taken!' })
        })

        window._socket.once(events.CONNECT_ERROR, () => {
          window._socket.disconnect()
          reject({ message: 'Something went wrong.' })
        })
      })
    },

    join (event) {
      event.preventDefault()

      if (!this.username || !this.password) {
        return
      }

      this.joinDisabled = true

      login(this.username, this.password)
        .then(res => {
          const token = res.data.token
          setAuthorizationToken(token)
          return this.connectSocket(token)
        })
        .then(() => {
          this.$router.push('channels')
        })
        .catch(e => {
          if (e.response) {
            this.errorMessage = e.response.data.error
          } else {
            this.errorMessage = e.message
          }

          this.joinDisabled = false
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
