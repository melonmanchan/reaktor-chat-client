import Vue       from 'vue'
import VueRouter from 'vue-router'
import VueMoment from 'vue-moment'
import VueBus    from 'vue-bus'

import Promise   from 'bluebird'

import Storage                   from './localstorage'
import { ChannelStore }          from './store'
import { connectSocket }         from './socketio/connection'
import { setAuthorizationToken } from './api'

import App      from './views/App'
import Channel  from './views/Channel'
import Channels from './views/Channels'
import Login    from './views/Login'
import Register from './views/Register'

Vue.use(VueBus)
Vue.use(VueRouter)
Vue.use(VueMoment)

ChannelStore.deserializeChannels()

const routes = [
  { path: '/login', name: 'login', component: Login, meta: { title: 'Login' } },
  { path: '/register', name: 'register', component: Register, meta: { title: 'Register an account' } },
  { path: '/channels', name: 'channels', component: Channels, meta: { title: 'Channels' } },
  { path: '/channel/:id', name: 'channel', component: Channel, meta: { title: 'Channel' } }
]

const router = new VueRouter({
  routes
})

// Redirect to login if socket not connected
router.beforeEach((to, from, next) => {
  document.title = to.meta.title

  const matchesAnyRoute = (router.match(to.fullPath).matched.length > 0)
  const isConnected = (window._socket && window._socket.connected)
  const goingToNonAuthView = (to.fullPath === '/login' || to.fullPath === '/register')

  if (goingToNonAuthView) {
    return next()
  }

  if (!isConnected) {
    return next('login')
  }

  if (isConnected && !matchesAnyRoute) {
    return next('channels')
  }

  next()
})

const possibleToken = Storage.getTokenIfValid()

if (possibleToken) {
  setAuthorizationToken(possibleToken)
}

const socketConnectPromise = (typeof possibleToken === 'undefined') ? Promise.resolve : connectSocket

socketConnectPromise(possibleToken)
.finally(() => {
  /* eslint-disable no-new */
  new Vue({
    router,
    render: h => h(App)
  }).$mount('#app')
})
