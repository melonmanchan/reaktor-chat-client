<template>
  <div>
    <form class="pure-form">
      <fieldset>
        <legend>Create public channel</legend>

        <div class="form-elements">
          <input v-model="channelName" type="text" placeholder="Channel name">
          <button :disabled="createDisabled" v-on:click="create" type="submit" class="pure-button pure-button-primary">Create</button>
        </div>

      </fieldset>
    </form>
  </div>
</template>

<script>
import { createChannel } from '../api/channels'
import { ChannelStore }  from '../store'

export default {
  name: 'create-channel-form',
  data () {
    return {
      channelName: '',
      createDisabled: false
    }
  },
  methods: {
    create (e) {
      e.preventDefault()

      if (this.channelName === '') {
        return
      }

      this.createDisabled = true

      createChannel(this.channelName)
        .then((resp) => {
          const newChannel = resp.data
          ChannelStore.addPublic(newChannel)
          this.$bus.emit('channel:add', newChannel)
          this.createDisabled = false
        })
        .catch((err) => {
          console.log(err)
          this.createDisabled = false
        })

      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.form-elements {
  display: flex;
  justify-content: space-between;
}

</style>
