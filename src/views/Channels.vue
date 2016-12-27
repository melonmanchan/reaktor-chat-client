<template>
  <div class="rooms-view">
    <h1>Pick a channel</h1>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data () {
    return {
      channels: [],
      newChannelName: ''
    }
  },
  methods: {
    join (channel) {
      console.log(channel)
    },
    createChannel (name) {
      console.log(name)
    }
  }
}
</script>

<style lang="scss" scoped>
.rooms-view {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
