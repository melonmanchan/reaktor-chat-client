<template>
  <div class="channel-view">

  </div>
</template>

<script>
import { joinChannel } from '../api/channels'

export default {
  data () {
    return {
      messages: []
    }
  },

  methods: {
    joinChannel (key) {
      return joinChannel(key)
    }
  },
  mounted () {
    const key = this.$route.params.id
    window._socket.on('user:joined', (data) => {
      console.log(data)
    })

    this.joinChannel(key)
      .then((res) => {
        console.log(res)
      })
      .catch(e => {
        console.log(e)
      })
  }
}
</script>

<style lang="scss" scoped>

</style>
