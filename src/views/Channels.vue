<template>
  <div>
  <div class="rooms-view">
    <div class="pure-g channels-grid">
      <div class="pure-u-1">
        <h1>Public channels</h1>
      </div>

      <div class="channels pure-u-1">
        <div class="pure-u-7-8 channel" v-for="channel in channels" v-on:click="join(channel)">
          <p>
            <span class="channel-name">{{channel.name}}</span>
            <span class="channel-online">{{channel.onlineCount}} user{{channel.onlineCount === 1 ? '' : 's'}} online</span>
          </p>
        </div>
      </div>
      <div class="form-wrapper">
        <div class="pure-u-1">
          <create-channel-form></create-channel-form>
        </div>
        <div class="pure-u-1">
          <random-channel-form></random-channel-form>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import { getChannels } from '../api/channels'
import { ChannelStore }  from '../store'

import CreateChannelForm        from '../components/CreateChannelForm'
import PrivateRandomChannelForm from '../components/PrivateRandomChannelForm'

export default {
  name: 'channels',

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
          ChannelStore.refreshPublicChannels(resp.data.channels)

          this.channels = resp.data.channels
          ChannelStore.refreshPublicChannels(resp.data.channels)
          this.$bus.emit('channel:refresh', this.channels)
        })
        .catch(e => {
          console.log(e)
        })
    },
    join (channel) {
      this.$router.push({ name: 'channel', params: { id: channel.key, name: channel.name } })
    }
  },

  components: {
    'create-channel-form': CreateChannelForm,
    'random-channel-form': PrivateRandomChannelForm
  }
}
</script>

<style lang="scss" scoped>
.channels-grid {
  width: 80%;
}

@media(max-width: 600px) {
  .channels-grid {
    width: 90%;
  }
}

.form-wrapper {
  width: 100%;
  margin-top: 7vh;
}

.rooms-view {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;

  h1 {
    text-align: center;
  }

  .channels {
    max-height: 65vh;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    align-items: center;
    flex-direction: column;

    .channel {
      .channel-online {
        opacity: 0.6;
        float: right;
        font-size: 0.8em;
      }

      width: 98%;
      padding: 5px;
      margin-bottom: 5px;
      border: 1px solid #e5e5e5;
      border-radius: 4px;
      cursor: pointer;

      &:active {
        opacity: 0.5;
      }
    }
  }
}
</style>
