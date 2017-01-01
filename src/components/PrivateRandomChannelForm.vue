<template>
  <div>
    <div class="pure-form">
      <fieldset>
        <legend>Random private channel</legend>
        <div class="form-elements">
          <input class="channel-url" readonly v-model="channelUrl" type="text" placeholder="Channel URL">
          <button v-on:click="randomizeLink" class="pure-button pure-button-primary">Re-roll!</button>
        </div>
      </fieldset>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RandomChannelForm',

  data () {
    return {
      channelUrl: ''
    }
  },

  mounted () {
    this.randomizeLink()
  },

  methods: {
    randomizeLink () {
      this.channelUrl = window.location.origin + '/#/channel/' + Math.random().toString(36).substr(2, 32)
    }
  }
}
</script>

<style lang="scss" scoped>
.form-elements {
  display: flex;
  justify-content: space-between;

  button {
    width: 80px;
  }

  input {
    width: 50%;
  }
}
</style>
