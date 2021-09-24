import store from '@/store'
import { singleton as usersService } from '@/utils/webservices/usersService'
import { singleton as preferencesService } from '@/utils/webservices/preferencesService'

class PreferencesUtils {
  private static instanceField: PreferencesUtils

  public static getInstance () {
    if (!this.instanceField) {
      this.instanceField || (this.instanceField = new PreferencesUtils())
    }
    return this.instanceField
  }

  public async load (userName): Promise<any> {
    return this.loadUser(userName).then(() => {
      return this.loadPreferences(userName)
    })
  }

  public async save (): Promise<object | undefined> {
    return this.saveUser().then(() => {
      return this.savePreferences()
    })
  }

  /**
   * Loads the user from the REST-service into VUEX.
   * @param userName the userName to load the user-object for
   */
  public async loadUser (userName: string) {
    return usersService.getByUserName(userName).then((user) => {
      if (user != null) {
        store.dispatch('preferences/userId', user.id)
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
  }

  /**
   * Loads the preferences from the REST-service into VUEX.
   * @param userName the userName to load the preferences-object for
   */
  public async loadPreferences (userName: string): Promise<any> {
    return preferencesService.getByUserName(userName).then((entity) => {
      store.dispatch('preferences/darkTheme', entity.darkTheme)
      store.dispatch('preferences/languageKey', entity.languageKey)
      return Promise.resolve()
    })
  }

  /**
   * Persists the user stored in VUEX to the REST-service.
   */
  public async saveUser (): Promise<object | undefined> {
    const userId = store.getters['preferences/userId']
    return usersService.put(userId, () => {
      return {
        userId: userId,
        userName: store.getters['preferences/userName'],
        client: store.getters['preferences/client'],
        givenName: store.getters['preferences/givenName'],
        familyName: store.getters['preferences/familyName'],
        email: store.getters['preferences/email'],
        emailVerified: store.getters['preferences/emailVerified'],
        realmRoles: store.getters['preferences/realmRoles'],
        clientRoles: store.getters['preferences/clientRoles'],
        isActive: store.getters['preferences/isActive'],
        isBearer: store.getters['preferences/isBearer']
      }
    })
  }

  /**
   * Persists the preferences stored in VUEX to the REST-service.
   */
  public async savePreferences (): Promise<object | undefined> {
    const userName = store.getters['preferences/userName']
    return preferencesService.upsertByUserName(userName, () => {
      return {
        languageKey: store.getters['preferences/languageKey'],
        darkTheme: store.getters['preferences/darkTheme']
      }
    })
  }
}

export const singleton = PreferencesUtils.getInstance()
