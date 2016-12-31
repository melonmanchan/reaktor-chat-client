<template>
  <div id="layout" v-bind:class="{ 'menu-hidden': shouldHideSideMenu }">
    <side-menu></side-menu>
    <div id="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Menu from '../components/Menu.vue'

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
  margin-left: 150px;
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
