import store from '@/store'

async function removeTokensFromLocalStorage () {
  console.log('Removing keycloak tokens from local storage.')
  localStorage.removeItem('kc-token')
  localStorage.removeItem('kc-refresh-token')
  return Promise.resolve()
}

async function persistTokensToLocalStorage (keycloak) {
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
  return Promise.resolve()
}

export default {
  getTokenFromLocalStorage: function () {
    const token = localStorage.getItem('kc-token')
    if (token == null || token === undefined) {
      console.log('Keycloak token persisted in local storage is missing.')
      return undefined
    }
    return token
  },
  getRefreshTokenFromLocalStorage: function () {
    const token = localStorage.getItem('kc-refresh-token')
    if (token == null || token === undefined) {
      console.log('Keycloak refresh-token persisted in local storage is missing.')
      return undefined
    }
    return token
  },
  persist: async function (keycloak) {
    store.commit('keycloak/instance', keycloak)
    const token = keycloak.tokenParsed
    console.log(token)
    if (token !== undefined) {
      store.commit('keycloak/token', keycloak.token)
      store.commit('keycloak/realmRoles', token.realm_access.roles)
      if (token.resource_access && token.resource_access[token.azp]) {
        store.commit('keycloak/clientRoles', token.resource_access[token.azp].roles)
      }
      store.commit('keycloak/givenName', token.given_name)
      store.commit('keycloak/familyName', token.family_name)
      store.commit('keycloak/email', token.email)
      store.commit('keycloak/emailVerified', token.email_verified)
    }
    return persistTokensToLocalStorage(keycloak)
  },
  reset: async function () {
    store.commit('keycloak/instance', null)
    store.commit('keycloak/token')
    store.commit('keycloak/realmRoles', [])
    store.commit('keycloak/clientRoles', [])
    store.commit('keycloak/givenName', '')
    store.commit('keycloak/familyName', '')
    store.commit('keycloak/email', '')
    store.commit('keycloak/emailVerified', false)
    return removeTokensFromLocalStorage()
  },
  logout: async function () {
    const promise = this.reset()
    const keycloak = store.getters['keycloak/instance']
    if (keycloak != null) {
      return promise.then(() => keycloak.logout()).then(() => keycloak.clearToken()).then(() => this.reset())
    }
    return promise
  }
}
