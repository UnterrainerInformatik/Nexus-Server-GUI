const store = {

  namespaced: true,

  state: () => ({
    userId: null,
    darkTheme: false,
    languageKey: 'de'
  }),

  mutations: {
    userId (state, value) {
      state.userId = value
    },
    darkTheme (state, value) {
      state.darkTheme = value
    },
    languageKey (state, value) {
      state.languageKey = value
    }
  },

  actions: {
    userId (context, value) {
      context.commit('userId', value)
      return Promise.resolve()
    },
    darkTheme (context, value) {
      context.commit('darkTheme', value)
      return Promise.resolve()
    },
    languageKey (context, value) {
      context.commit('languageKey', value)
      return Promise.resolve()
    }
  },

  getters: {
    userId: state => {
      return state.userId
    },
    darkTheme: state => {
      return state.darkTheme
    },
    languageKey: state => {
      return state.languageKey
    }
  }

}

export default store
