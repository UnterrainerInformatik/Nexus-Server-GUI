import { getList, post, put } from '@/utils/axiosUtils'

export default {
  loadPreferences: async function (userName) {
    return getList('nexus', 'preferences', 1, 0, () => { return undefined }, () => { return undefined }, `&userName=${encodeURIComponent(userName)}`).then((response) => {
      if (response == null || response === undefined || response.entries.size() == 0) {
        return null
      }
      return { lang: response.entries[0].languageKey, dark: response.entries[0].darkTheme }
    })
  },
  savePreferences: async function (userName, lang, dark) {
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
        getList('nexus', 'users', 1, 0, () => { return undefined }, () => { return undefined }, `&userName=${encodeURIComponent(userName)}`).then((response) => {
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