const store = {

  namespaced: true,

  state: () => ({
    config: {
      servers: {
        uinf: {
          protocol: 'https',
          address: 'nexus.unterrainer.info', // DEV
          port: '443'
        }
      },
      endpoint: {
        application: {
          name: '/',
          version: '/version',
          health: '/health',
          datetime: '/datetime'
        },
        crontab: {
          runs: '/crontab/runs'
        },
        logs: '/logs'
      }
    }
  }),

  mutations: {
  },

  actions: {
  },

  getters: {
    config: state => {
      return state.config
    }
  }

}

export default store
