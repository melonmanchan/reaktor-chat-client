<template>
  <div id="layout" v-bind:class="{ 'menu-hidden': isMenuHidden }">
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
    return {
      isMenuHidden: false
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
    padding-left: 150;
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
  #menu {
    display: none;
  }

  #content {
    margin-left: 0;
  }
}
</style>
