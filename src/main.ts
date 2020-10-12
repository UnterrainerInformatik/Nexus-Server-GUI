import Vue from 'vue'
import App from './App.vue'

import router from './router'

import VueI18n from 'vue-i18n'
import messages from '@/locales/i18n'

import vuetify from '@/plugins/vuetify'
import store from '@/store'

import axios from 'axios'
import VueAxios from 'vue-axios'

import VueGoogleCharts from 'vue-google-charts'

import Keycloak from 'keycloak-js'

Vue.config.productionTip = false

Vue.use(VueGoogleCharts)
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'en',
  messages
})
Vue.use(VueAxios, axios)

function persistTokens (keycloak) {
  console.log('Saving tokens.')
  if (keycloak.token !== undefined) {
    localStorage.setItem('vue-token', keycloak.token)
  } else {
    console.warn('"keycloak.token" is undefined.')
  }
  if (keycloak.refreshToken !== undefined) {
    localStorage.setItem('vue-refresh-token', keycloak.refreshToken)
  } else {
    console.warn('"keycloak.refreshToken" is undefined.')
  }
}

const lsToken = localStorage.getItem('vue-token') ?? undefined
const lsRefreshToken = localStorage.getItem('vue-refresh-token') ?? undefined
const initOptions = {
  url: 'https://keycloak.unterrainer.info/auth', realm: 'Nexus', clientId: 'Nexus'
}
const keycloak = Keycloak(initOptions)

keycloak.init({
  onLoad: 'login-required',
  checkLoginIframe: false,
  token: lsToken,
  refreshToken: lsRefreshToken
}).then((auth) => {
  if (!auth) {
    console.log('Authentication failed. Deleting localStorate tokens.')
    localStorage.removeItem('vue-token')
    localStorage.removeItem('vue-refresh-token')
    window.location.reload()
  } else {
    console.log('Authenticated')
    persistTokens(keycloak)
  }

  setInterval(() => {
    keycloak.updateToken(70).then((refreshed) => {
      if (refreshed) {
        console.log('Token refreshed. Persisting.')
        persistTokens(keycloak)
      } else {
        if (keycloak.tokenParsed !== undefined && keycloak.tokenParsed.exp !== undefined && keycloak.timeSkew !== undefined) {
          console.warn('Token not refreshed, valid for ' + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds')
        } else {
          console.warn('Token not refreshed.')
        }
      }
    }).catch(() => {
      console.error('Failed to refresh token.')
    })
  }, 60000)
}).catch(() => {
  console.error('Authentication failed.')
})

new Vue({
  vuetify,
  i18n,
  store,
  router,
  render: h => h(App)
}).$mount('#app')

store.commit('keycloak', keycloak)
