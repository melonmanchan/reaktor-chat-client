<template>
  <div>
    <a href="#menu" class="menu-link" v-bind:class="{active: isResponsiveMenuActive}" v-on:click="toggleMenu">
      <span></span>
    </a>
    <div id="menu" class="pure-menu" v-bind:class="{active: isResponsiveMenuActive}" >
      <span class="pure-menu-heading">Channels</span>
      <ul class="pure-menu-list">
        <li class="pure-menu-item"><router-link class="pure-menu-link" :to="{ name: 'channel', params: { id: 'channel1', name: 'Channel 1'}}">Channel 1</router-link></li>
        <li class="pure-menu-item"><router-link class="pure-menu-link" :to="{ name: 'channel', params: { id: 'channel2', name: 'Channel 2'}}">Channel 2</router-link></li>
        <li class="pure-menu-item"><router-link class="pure-menu-link" :to="{ name: 'channel', params: { id: 'channel3', name: 'Channel 3'}}">Channel 3</router-link></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isResponsiveMenuActive: false
    }
  },
  methods: {
    toggleMenu (e) {
      e.preventDefault()
      this.isResponsiveMenuActive = !this.isResponsiveMenuActive
      console.log(this.isResponsiveMenuActive)
      return false
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
</style>

