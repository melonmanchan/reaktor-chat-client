<template>
  <div class="register-form">
    <form class="pure-form pure-form-stacked">
      <fieldset>
        <legend>Register an account</legend>
        <div v-if="errorMessage" class="error-message">{{errorMessage}}</div>
        <input minlength="3" v-bind:class="{error: errorMessage }" v-model="username" id="name" type="text" placeholder="Username" required>
        <input minlength="6" v-bind:class="{error: errorMessage }" v-model="password" id="password" type="password" placeholder="Password" required>
        <input minlength="6" v-bind:class="{error: errorMessage }" v-model="passwordAgain" id="passwordAgain" type="password" placeholder="Password again" required>
        <div class="pure-controls">
          <button :disabled="registerDisabled" v-on:click="register" type="submit" class="pure-button pure-button-primary">Login</button>
        </div>
      </fieldset>
        <div class="login-notice">
          <router-link to="/login">Login »</router-link>
        </div>
    </form>
  </div>
</template>

<script>
import connectSocket             from '../socketio/connect'
import { register }              from '../api/auth'
import { setAuthorizationToken } from '../api'

export default {
  data () {
    return {
      username: '',
      password: '',
      passwordAgain: '',
      errorMessage: null,
      registerDisabled: false
    }
  },

  watch: {
    password (val) {
      if (val !== this.passwordAgain) {
        this.errorMessage = 'Passwords do not match'
      } else {
        this.errorMessage = null
      }
    },
    passwordAgain (val) {
      if (val !== this.password) {
        this.errorMessage = 'Passwords do not match'
      } else {
        this.errorMessage = null
      }
    }
  },

  methods: {
    register (event) {
      event.preventDefault()

      if (!this.username || !this.password || !this.passwordAgain) {
        return
      }

      if (this.password !== this.passwordAgain) {
        return
      }

      if (this.password.length < 6) {
        this.errorMessage = 'Password too short (minimum of 6 characters)'
        return
      }

      if (this.username.length < 3) {
        this.errorMessage = 'Username too short (minimum of 3 characters)'
        return
      }

      this.registerDisabled = true

      register(this.username, this.password)
        .then(res => {
          const token = res.data.token
          setAuthorizationToken(token)
          return connectSocket(token)
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

          this.registerDisabled = false
        })

      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.register-form {
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

  .login-notice {
    font-size: .8em;
    margin-top: .5em;
    padding: .3em 0;
    border-top: 1px solid #e5e5e5;
    text-align: center;
  }
}
</style>
