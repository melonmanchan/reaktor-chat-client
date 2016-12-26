<template>
  <div class="login-form">
    <form class="pure-form pure-form-stacked">
      <fieldset>
        <label for="name">Username</label>
        <input v-model="username" id="name" type="text" placeholder="Username" required>

        <label for="channel">Channel</label>
        <input v-model="channel" id="channel" type="text" placeholder="Channel name" required>

        <div class="pure-controls">
          <button v-on:click="join" type="submit" class="pure-button pure-button-primary">Join</button>
        </div>
      </fieldset>
    </form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      username: '',
      channel: ''
    }
  },

  methods: {
    join () {
      console.log(this.username)
      console.log(this.channel)
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
