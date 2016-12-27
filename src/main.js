// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue       from 'vue'
import VueRouter from 'vue-router'

import App      from './views/App'
import Channels from './views/Channels'
import Login    from './views/Login'

Vue.use(VueRouter)

const routes = [
  { path: '/login', component: Login },
  { path: '/channels', component: Channels }
]

const router = new VueRouter({
  routes
})

// Redirect to login if socket not connected
router.beforeEach((to, from, next) => {
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
