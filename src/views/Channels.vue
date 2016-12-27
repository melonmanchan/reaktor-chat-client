<template>
  <div class="rooms-view">
    <div class="pure-g">
      <div class="pure-u-1">
        <h1>Pick a channel</h1>
      </div>

      <div class="channels pure-u-1">
        <div class="pure-u-7-8 channel" v-for="channel in channels" v-on:click="join(channel)">
          <p>{{channel.name}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getChannels } from '../api/channels'

export default {
  data () {
    return {
      channels: [],
      newChannelName: ''
    }
  },

  mounted () {
    this.loadChannels()
  },

  methods: {
    loadChannels () {
      getChannels()
        .then(resp => {
          this.channels = resp.data.channels
        })
        .catch(e => {
          console.log(e)
        })
    },
    join (channel) {
      this.$router.push({ name: 'channel', params: { id: channel.key } })
    }
  }
}
</script>

<style lang="scss" scoped>
.rooms-view {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  h1 {
    text-align: center;
  }

  .channels {
    max-height: 50vh;
    overflow-y: auto;
    display: flex;
    align-items: center;
    flex-direction: column;

    .channel {
      padding: 5px;
      margin-bottom: 5px;
      border: 1px solid #e5e5e5;
      cursor: pointer;

      &:active {
        opacity: 0.5;
      }
    }
  }
}
</style>
