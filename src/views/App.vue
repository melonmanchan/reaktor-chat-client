<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {}
  },

  mounted () {
    document.getElementById('preload').classList = 'hidden'
  }
}
</script>

<style lang="scss">
body {
  height: 100vh;
  width: 100vw;
}
</style>
