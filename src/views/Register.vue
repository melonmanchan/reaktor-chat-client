<template>
  <div class="register-form">
    <form class="pure-form pure-form-stacked">
      <fieldset>
        <legend>Register an account</legend>
        <div v-if="errorMessage" class="error-message">{{errorMessage}}</div>
        <input minlength="3" v-bind:class="{ error: usernameError }"  v-model="username" id="name" type="text" placeholder="Username" required>
        <input minlength="6" v-bind:class="{ error: passwordError }" v-model="password" id="password" type="password" placeholder="Password" required>
        <input minlength="6" v-bind:class="{ error: passwordError }" v-model="passwordAgain" id="passwordAgain" type="password" placeholder="Password again" required>
        <div class="pure-controls">
          <button :disabled="registerDisabled" v-on:click="register" type="submit" class="pure-button pure-button-primary">Register</button>
        </div>
      </fieldset>
        <div class="login-notice">
          <router-link to="/login">Login »</router-link>
        </div>
    </form>
  </div>
</template>

<script>
import debounce from 'lodash.debounce'

import Storage                   from '../localstorage'
import { connectSocket }         from '../socketio/connection'
import { register }              from '../api/auth'
import { setAuthorizationToken } from '../api'

export default {
  data () {
    return {
      username: '',
      password: '',
      passwordAgain: '',

      usernameError: false,
      passwordError: false,

      errorMessage: null,
      registerDisabled: false
    }
  },

  watch: {
    username (val) {
      const possibleError = this.isNameValid(val)

      if (possibleError) {
        this.usernameError = true
        this.errorMessage = possibleError
      } else {
        this.usernameError = false
        this.errorMessage = null
      }
    },

    password (val) {
      if (val === this.passwordAgain) {
        this.errorMessage = null
        this.passwordError = false
      } else {
        this.debouncedPasswordMatch()
      }
    },

    passwordAgain (val) {
      if (val === this.password) {
        this.errorMessage = null
        this.passwordError = false
      } else {
        this.debouncedPasswordMatch()
      }
    }
  },

  methods: {
    isNameValid (name) {
      let error = null

      if (name.length < 3) {
        error = 'Name is too short (minimum 3 characters)'
      } else if (name === 'You' || name === 'System') {
        error = 'That name is not allowed'
      } else if (!name.match(/^[A-Za-z0-9]+$/)) {
        error = 'Name must be numbers or letters A-Z only'
      }

      return error
    },

    debouncedPasswordMatch: debounce(function () {
      if (this.password !== this.passwordAgain) {
        this.errorMessage = 'Passwords do not match'
        this.passwordError = true
      }
    }, 2000),

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
        this.passwordError = true
        return
      }

      const possibleNameError = this.isNameValid(this.username)

      if (possibleNameError) {
        this.errorMessage = possibleNameError
        this.usernameError = true
        return
      }

      this.registerDisabled = true

      register(this.username, this.password)
        .then(res => {
          Storage.saveAuthInfo(res.data)
          Storage.saveLoggedInUser({ username: this.username })
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
