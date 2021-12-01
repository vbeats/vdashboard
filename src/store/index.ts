import {createStore} from 'vuex'
import actions from './actions'
import user from './modules/user'
import app from './modules/app'
import getters from './getters'

export default createStore({
  state: {},
  mutations: {},
  actions,
  modules: {
    user,
    app,
  },
  getters,
})
