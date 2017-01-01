<template>
  <div>
    <a href="#menu" class="menu-link" v-bind:class="{active: isResponsiveMenuActive}" v-on:click="toggleMenu">
      <span></span>
    </a>
    <div id="menu" class="pure-menu" v-bind:class="{active: isResponsiveMenuActive}" >
      <div v-if="shouldShowUsers">
        <span class="pure-menu-heading div-top div-bottom">Users</span>
        <ul class="pure-menu-list users-list">
          <li class="pure-menu-item user" v-for="u in users">
            <span class="username">{{u.username}}</span>
            <span class="status-indicator" v-bind:class="u.status"></span>
          </li>
        </ul>
      </div>
      <span class="pure-menu-heading div-bottom">Channels</span>
      <ul class="pure-menu-list">
        <router-link :to="{ name: 'channels'}" class="pure-menu-link">Lobby</router-link>
        <li class="pure-menu-item" v-for="c in channels">
          <router-link class="pure-menu-link" :to="{ name: 'channel', params: { id: c.key, name: c.name}}">{{c.name}}</router-link>
        </li>
      </ul>
      <ul class="pure-menu-list">
        <li class='pure-menu-item'>
          <a href="#" class="pure-menu-link div-top" v-on:click="$bus.emit('logout')">Log out</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Storage from '../localstorage'

export default {
  data () {
    return {
      isResponsiveMenuActive: false,
      channels: [],
      users: []
    }
  },

  mounted () {
    this.channels = Storage.getAvailableChannels()
  },

  created () {
    this.$bus.on('channel:refresh', this.channelRefresh)
    this.$bus.on('channel:add', this.channelAdd)

    this.$bus.on('users:refresh', this.usersRefresh)
    this.$bus.on('users:leave', this.removeUser)
    this.$bus.on('users:join', this.addUser)
    this.$bus.on('users:status_changed', this.changeUserStatus)
  },

  beforeDestroy () {
    this.$bus.off('channel:refresh', this.channelRefresh)
    this.$bus.off('channel:add', this.channelAdd)

    this.$bus.off('users:refresh', this.usersRefresh)
    this.$bus.off('users:leave', this.removeUser)
    this.$bus.off('users:join', this.addUser)
    this.$bus.off('users:status_changed', this.changeUserStatus)
  },

  methods: {
    sortUsers () {
      this.users.sort((a, b) => {
        if (a.username < b.username) {
          return -1
        } else if (a.username > b.username) {
          return 1
        }

        return 0
      })
    },

    channelRefresh (channels) {
      this.channels = channels
    },

    channelAdd (channels) {

    },

    usersRefresh (users) {
      users.sort()
      this.users = users
    },

    addUser (user) {
      this.users.push(user)
      this.sortUsers()
    },

    removeUser (user) {
      const userToRemove = this.users.findIndex((u) => {
        return u.username === user.username
      })

      if (userToRemove === -1) {
        return
      }

      this.users.splice(userToRemove, 1)
      this.sortUsers()
    },

    changeUserStatus ({username, status}) {
      const index = this.users.findIndex((u) => {
        return u.username === username
      })

      if (index === -1) {
        return
      }

      this.users[index].status = status
    },

    toggleMenu (e) {
      e.preventDefault()
      this.isResponsiveMenuActive = !this.isResponsiveMenuActive
      return false
    }
  },

  computed: {
    shouldShowUsers () {
      return this.$route.name === 'channel'
    }
  }
}
</script>

<style lang="scss">
.pure-menu {
  line-height: 1.7;
  background: #191818;
  position: fixed;
  width: 170px;
  top: 0;
  left: 0;
  bottom: 0;
  overflow-y: auto;
}

.menu-link {
  position: fixed;
  display: block; /* show this only on small screens */
  top: 0;
  left: 0; /* "#menu width" */
  background: #000;
  background: rgba(0,0,0,0.7);
  font-size: 10px; /* change this value to increase/decrease button size */
  z-index: 10;
  width: 2em;
  height: auto;
  padding: 2.1em 1.6em;
}

.menu-link:hover,
.menu-link:focus {
  background: #000;
}

.menu-link span {
  position: relative;
  display: block;
}

.menu-link span,
.menu-link span:before,
.menu-link span:after {
  background-color: #fff;
  width: 100%;
  height: 0.2em;
}

.menu-link span:before,
.menu-link span:after {
  position: absolute;
  margin-top: -0.6em;
  content: " ";
}

.div-bottom {
  border-bottom: 1px solid #333;
}

.div-top {
  border-top: 1px solid #333;
}

.menu-link span:after {
  margin-top: 0.6em;
}

.menu-link.active {
  left: 170px;
}

@media(max-width: 600px) {
  #menu:not(.active) {
    display: none;
  }
}

@media(min-width: 600px) {
  .menu-link {
    display: none;
  }
}

.users-list {
  .user {
    padding: .5em 1em;
    color: #fdfdfd;
  }

  .status-indicator {
    position: absolute;
    right: 26px;
    top: 16px;

    border-radius: 50%;
    display: inline-block;
    width: 10px;
    height: 10px;

    &.online {
      background-color: #5eb95e;
    }

    &.away {
      background-color: rgb(250, 210, 50);
    }
  }
}
</style>

