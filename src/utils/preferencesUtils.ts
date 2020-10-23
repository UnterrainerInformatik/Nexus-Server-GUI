import store from '@/store'
import { getList, post, put } from '@/utils/axiosUtils'

export default {
  load: async function (userName) {
    return this.loadUser(userName).then(() => {
      return this.loadPreferences(userName)
    })
  },
  save: async function () {
    return this.saveUser().then(() => {
      return this.savePreferences()
    })
  },
  /**
   * Loads the user from the REST-service into VUEX.
   * @param userName the userName to load the user-object for
   */
  loadUser: async function (userName) {
    return getList('nexus', 'users', 1, 0, () => { return undefined }, () => { return undefined }, `&userName=${encodeURIComponent(userName)}`).then((response) => {
      if (response != null && response !== undefined && response.entries.size() > 0) {
        const user = response.entries[0]
        store.dispatch('preferences/userId', user.userId)
        store.dispatch('preferences/userName', user.userName)
        store.dispatch('preferences/client', user.client)
        store.dispatch('preferences/givenName', user.givenName)
        store.dispatch('preferences/familyName', user.familyName)
        store.dispatch('preferences/email', user.email)
        store.dispatch('preferences/emailVerified', user.emailVerified)
        store.dispatch('preferences/realmRoles', user.realmRoles)
        store.dispatch('preferences/clientRoles', user.clientRoles)
        store.dispatch('preferences/isActive', user.isActive)
        store.dispatch('preferences/isBearer', user.isBearer)
      }
      return Promise.resolve()
    })
  },
  /**
   * Loads the preferences from the REST-service into VUEX.
   * @param userName the userName to load the preferences-object for
   */
  loadPreferences: async function (userName) {
    return getList('nexus', 'preferences', 1, 0, () => { return undefined }, () => { return undefined }, `&userName=${encodeURIComponent(userName)}`).then((response) => {
      if (response != null && response !== undefined && response.entries.size() > 0) {
        const pref = response.entries[0]
        store.dispatch('preferences/darktheme', pref.darkTheme)
        store.dispatch('preferences/languageKey', pref.languageKey)
      }
      return Promise.resolve()
    })
  },
  /**
   * Persists the user stored in VUEX to the REST-service.
   */
  saveUser: async function () {

  }
  /**
   * Persists the preferences stored in VUEX to the REST-service.
   */
  savePreferences: async function () {
    return getList('nexus', 'preferences', 1, 0, () => { return undefined }, () => { return undefined }, `&userName=${encodeURIComponent(userName)}`).then((response) => {
      if (response == null || response === undefined || response.entries.size() == 0) {
        // Make new.
        const entity = response.entries[0]
        if (lang != null && lang !== undefined) {
          entity.languageKey = lang
        }
        if (dark != null && dark !== undefined) {
          entity.darkTheme = dark
        }
        return getList('nexus', 'users', 1, 0, () => { return undefined }, () => { return undefined }, `&userName=${encodeURIComponent(userName)}`).then((response) => {
          if (response == null || response === undefined || response.entries.size() == 0) {
            return null
          }
          return post('nexus', 'preferences', () => { return undefined }, () => { return entity }, () => { return undefined })
        })
      }
      // Update old.
      const entity = response.entries[0]
      entity.languageKey = lang
      entity.darkTheme = dark
      return put('nexus', 'preferences', entity.id, () => { return undefined }, () => { return entity }, () => { return undefined })
    })
  }
}