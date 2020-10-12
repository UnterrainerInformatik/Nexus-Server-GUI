import Vue from 'vue'
import Vuex from 'vuex'
import gui from '@/store/gui'
import rest from '@/store/rest'

Vue.use(Vuex)

const store = new Vuex.Store({

  modules: {
    gui,
    rest
  },

  state: () => ({
    version: '0.0.1',
    keycloak: null
  }),

  mutations: {
    keycloak (state, value) {
      state.keycloak = value
    }
  },

  actions: {
    keycloak (context, value) {
      context.commit('keycloak', value)
      return Promise.resolve()
    }
  },

  getters: {
    version: state => {
      return state.version
    },
    keycloak: state => {
      return state.keycloak
    }
  }
})

export default store
