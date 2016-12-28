// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue       from 'vue'
import VueRouter from 'vue-router'
import VueMoment from 'vue-moment'

import App      from './views/App'
import Channel  from './views/Channel'
import Channels from './views/Channels'
import Login    from './views/Login'

Vue.use(VueRouter)
Vue.use(VueMoment)

const routes = [
  { path: '/login', name: 'login', component: Login, meta: { title: 'Login' } },
  { path: '/channels', name: 'channels', component: Channels, meta: { title: 'Channels' } },
  { path: '/channel/:id', name: 'channel', component: Channel, meta: { title: 'Channel' } }
]

const router = new VueRouter({
  routes
})

// Redirect to login if socket not connected
router.beforeEach((to, from, next) => {
  document.title = to.meta.title

  if (to.fullPath === '/login') {
    return next()
  }

  if (!window._socket || !window._socket.connected) {
    return next('login')
  }

  next()
})

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
