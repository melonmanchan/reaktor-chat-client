<template>
  <div class="channel-view">

  </div>
</template>

<script>
export default {
  data () {
    return {
      messages: []
    }
  },

  mounted () {
    const room = this.$route.params.id
    console.log(room)
  }
}
</script>

<style lang="scss" scoped>

</style>
