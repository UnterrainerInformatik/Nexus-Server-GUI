import store from '@/store'

function removeTokensFromLocalStorage () {
  localStorage.removeItem('kc-token')
  localStorage.removeItem('kc-refresh-token')
}

function persistTokensToLocalStorage (keycloak) {
  console.log('Saving tokens.')
  if (keycloak.token !== undefined) {
    localStorage.setItem('kc-token', keycloak.token)
  } else {
    console.warn('"keycloak.token" is undefined.')
  }
  if (keycloak.refreshToken !== undefined) {
    localStorage.setItem('kc-refresh-token', keycloak.refreshToken)
  } else {
    console.warn('"keycloak.refreshToken" is undefined.')
  }
}

export default {
  persist: function (keycloak) {
    store.commit('keycloak/instance', keycloak)
    const token = keycloak.tokenParsed
    console.log(token)
    if (token !== undefined) {
      store.commit('keycloak/realmRoles', token.realm_access.roles)
      if (token.resource_access && token.resource_access[token.azp]) {
        store.commit('keycloak/clientRoles', token.resource_access[token.azp].roles)
      }
      store.commit('keycloak/givenName', token.given_name)
      store.commit('keycloak/familyName', token.family_name)
      store.commit('keycloak/email', token.email)
      store.commit('keycloak/emailVerified', token.email_verified)
    }
    persistTokensToLocalStorage(keycloak)
  },
  reset: function () {
    store.commit('keycloak/instance', null)
    store.commit('keycloak/realmRoles', [])
    store.commit('keycloak/clientRoles', [])
    store.commit('keycloak/givenName', '')
    store.commit('keycloak/familyName', '')
    store.commit('keycloak/email', '')
    store.commit('keycloak/emailVerified', false)
    removeTokensFromLocalStorage()
  },
  logout: function () {
    const keycloak = store.getters['keycloak/instance']
    if (keycloak != null) {
      keycloak.logout().then(() => keycloak.clearToken())
    }
    this.reset()
  }
}
