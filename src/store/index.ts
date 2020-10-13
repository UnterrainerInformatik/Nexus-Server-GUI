import Vue from 'vue'
import Vuex from 'vuex'
import gui from '@/store/gui'
import rest from '@/store/rest'
import keycloak from '@/store/keycloak'

Vue.use(Vuex)

const store = new Vuex.Store({

  modules: {
    gui,
    rest,
    keycloak
  },

  state: () => ({
    version: '0.0.1'
  }),

  mutations: {
  },

  actions: {
  },

  getters: {
    version: state => {
      return state.version
    }
  }
})

export default store
