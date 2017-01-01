<template>
  <div>
    <form class="pure-form">
      <fieldset>
        <legend>Create new channel</legend>

        <div class="form-elements">
          <div>
            <input v-model="channelName" type="text" placeholder="Channel name">
            <label for="isPublic">
              <input v-model="isPublic" id="isPublic" type="checkbox"> Public?
            </label>
          </div>
          <button :disabled="createDisabled" v-on:click="create" type="submit" class="pure-button pure-button-primary">Create</button>
        </div>

      </fieldset>
    </form>
  </div>
</template>

<script>
import { createChannel } from '../api/channels'

export default {
  name: 'create-channel-form',
  data () {
    return {
      channelName: '',
      isPublic: true,
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

      createChannel(this.channelName, this.isPublic)
        .then((resp) => {
          console.log(resp.data)
          const newChannel = resp.data
          console.log(newChannel)
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
