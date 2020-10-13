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
import keycloakUtils from '@/utils/keycloakUtils'

Vue.config.productionTip = false

Vue.use(VueGoogleCharts)
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'en',
  messages
})
Vue.use(VueAxios, axios)

const keycloak = Keycloak({
  url: store.getters['keycloak/host'],
  realm: store.getters['keycloak/realm'],
  clientId: store.getters['keycloak/client']
})

keycloak.init({
  onLoad: 'login-required',
  checkLoginIframe: false,
  token: localStorage.getItem('kc-token') ?? undefined,
  refreshToken: localStorage.getItem('kc-refresh-token') ?? undefined
}).then((auth) => {
  if (!auth) {
    console.log('Authentication failed. Deleting localStorate tokens.')
    keycloakUtils.reset()
    window.location.reload()
  } else {
    console.log('Authenticated')
    keycloakUtils.persist(keycloak)
  }

  setInterval(() => {
    keycloak.updateToken(70).then((refreshed) => {
      if (refreshed) {
        console.log('Token refreshed. Persisting.')
        keycloakUtils.persist(keycloak)
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
  keycloakUtils.reset()
})

new Vue({
  vuetify,
  i18n,
  store,
  router,
  render: h => h(App)
}).$mount('#app')

store.commit('keycloak/instance', keycloak)
