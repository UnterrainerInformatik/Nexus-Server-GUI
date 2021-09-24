import store from '@/store'

class KeycloakUtils {
  private static instanceField: KeycloakUtils

  public static getInstance () {
    if (!this.instanceField) {
      this.instanceField || (this.instanceField = new KeycloakUtils())
    }
    return this.instanceField
  }

  private async removeTokensFromLocalStorage () {
    console.log('Removing keycloak tokens from local storage.')
    localStorage.removeItem('kc-token')
    localStorage.removeItem('kc-refresh-token')
    return Promise.resolve()
  }

  private async persistTokensToLocalStorage (keycloak) {
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

  public getTokenFromLocalStorage () {
    const token = localStorage.getItem('kc-token')
    console.log('Access-token from local storage:')
    // console.log(token)
    if (token == null || token === undefined) {
      console.log('Keycloak token persisted in local storage is missing.')
      return undefined
    }
    return token
  }

  public getRefreshTokenFromLocalStorage () {
    const token = localStorage.getItem('kc-refresh-token')
    console.log('Refresh-token from local storage:')
    // console.log(token)
    if (token == null || token === undefined) {
      console.log('Keycloak refresh-token persisted in local storage is missing.')
      return undefined
    }
    return token
  }

  public async persist (keycloak) {
    console.log('persist keycloak')
    store.dispatch('keycloak/instance', keycloak)
    // console.log(keycloak)
    const token = keycloak.tokenParsed
    // console.log(token)
    if (token !== undefined) {
      store.dispatch('keycloak/token', keycloak.token)
      store.dispatch('keycloak/realmRoles', token.realm_access.roles)
      if (token.resource_access && token.resource_access[token.azp]) {
        store.dispatch('keycloak/clientRoles', token.resource_access[token.azp].roles)
      }
      store.dispatch('keycloak/givenName', token.given_name)
      store.dispatch('keycloak/familyName', token.family_name)
      store.dispatch('keycloak/email', token.email)
      store.dispatch('keycloak/emailVerified', token.email_verified)
      store.dispatch('keycloak/userName', token.preferred_username)
    }
    return this.persistTokensToLocalStorage(keycloak)
  }

  public async reset () {
    store.dispatch('keycloak/instance', null)
    store.dispatch('keycloak/token')
    store.dispatch('keycloak/realmRoles', [])
    store.dispatch('keycloak/clientRoles', [])
    store.dispatch('keycloak/givenName', '')
    store.dispatch('keycloak/familyName', '')
    store.dispatch('keycloak/email', '')
    store.dispatch('keycloak/emailVerified', false)
    store.dispatch('keycloak/userName', null)
    return this.removeTokensFromLocalStorage()
  }

  public async logout () {
    console.log('getting keycloak from store')
    const keycloak = store.getters['keycloak/instance']
    console.log('resetting')
    const promise = this.reset()
    if (keycloak != null) {
      return promise.then(() => {
        console.log('resetting again')
        this.reset()
      }).then(() => {
        console.log('keycloak cleartoken')
        return keycloak.clearToken()
      }).then(() => {
        console.log('keycloak logout')
        return keycloak.logout()
      })
    }
    return promise
  }
}

export const singleton = KeycloakUtils.getInstance()
