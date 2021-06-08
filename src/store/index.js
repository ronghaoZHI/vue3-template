import { createStore, createLogger } from 'vuex'

const INCREMENT = 'increment';

// Create a new store instance.
const store = createStore({
  state () {
    return {
      count: 0
    }
  },
  mutations: {
    [INCREMENT] (state, data) {
      state.count = data
    }
  },
	actions: {
		[INCREMENT] ({ commit }, data) {
      commit(INCREMENT, data)
    }
	},
	getters: {
		count: state => state.count,
	},
	plugins: process.env.NODE_ENV !== 'production' 
		? [createLogger()] 
		: [],
})

export default store;