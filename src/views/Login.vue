<template>
  <div class="login-form">
    <form class="pure-form pure-form-stacked">
      <fieldset>
        <legend>Welcome to the chat</legend>
        <div v-if="errorMessage" class="error-message">{{errorMessage}}</div>
        <input v-bind:class="{ error: errorMessage }" v-model="username" id="name" type="text" placeholder="Username" required>
        <input v-bind:class="{ error: errorMessage }" v-model="password" id="password" type="password" placeholder="Password" required>
        <div class="pure-controls">
          <button :disabled="joinDisabled" v-on:click="join" type="submit" class="pure-button pure-button-primary">Join</button>
        </div>

        <div class="register-notice">
          <router-link to="/register">Register »</router-link>
        </div>
      </fieldset>
    </form>
  </div>
</template>

<script>
import connectSocket             from '../socketio/connect'
import Storage                   from '../localstorage'
import { login }                 from '../api/auth'
import { setAuthorizationToken } from '../api'
import { requestPermission }     from '../notifications'

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
    join (event) {
      event.preventDefault()

      if (!this.username || !this.password) {
        return
      }

      this.joinDisabled = true

      login(this.username, this.password)
        .then(res => {
          Storage.saveAuthInfo(res.data)
          const token = res.data.token
          setAuthorizationToken(token)
          return connectSocket(token)
        })
        .then(() => {
          requestPermission()
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
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

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

  .register-notice {
    font-size: .8em;
    margin-top: .5em;
    border-top: 1px solid #e5e5e5;
    text-align: center;
    padding: .3em 0;
  }
}
</style>
