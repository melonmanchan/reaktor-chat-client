<template>
  <div id="layout" v-bind:class="{ 'menu-hidden': shouldHideSideMenu }">
    <side-menu></side-menu>
    <div id="content">
      <router-view :key="$route.path"></router-view>
    </div>
  </div>
</template>

<script>
import Menu    from '../components/Menu.vue'
import Storage from '../localstorage'

import { deleteAuthorizationToken } from '../api'
import { disconnectSocket }         from '../socketio/connection'

export default {
  name: 'app',

  data () {
    return { }
  },

  computed: {
    shouldHideSideMenu () {
      return (this.$route.path === '/login' || this.$route.path === '/register')
    }
  },

  mounted () {
    document.getElementById('preload').classList = 'hidden'
    this.$bus.on('logout', this.logOut)
  },

  methods: {
    logOut () {
      disconnectSocket()
      deleteAuthorizationToken()
      Storage.clearStorage()

      if (this.$route.path !== '/login') {
        this.$router.push({ name: 'login' })
      }
    }
  },

  components: {
    'side-menu': Menu
  }
}
</script>

<style lang="scss">
body {
  height: 100vh;
  width: 100vw;
}

#layout {
    height: 100vh;
    width: 100vw;
    position: relative;
    left: 0;
}

#content {
  right: 0;
  margin-left: 170px;
  height: 100%;
}

@media(max-width: 600px) {
  #content {
    margin-left: 0;
  }
}

#layout.menu-hidden {
  #menu, .menu-link {
    display: none;
  }

  #content {
    margin-left: 0;
  }
}
</style>
