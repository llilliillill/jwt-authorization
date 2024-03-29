import { AuthService } from '@/services/AuthService'
import { UserService } from '@/services/UserService'
import { createStore } from 'vuex'
import axios from 'axios'
import { API_URL } from '@/http'

export default createStore({
  state: {
    user: {},
    isAuth: false,
    isLoading: false,
    users: []
  },

  getters: {
    
  },

  mutations: {

    setUser(state, newUser) {
      state.user = newUser
    },

    setUsers(state, newUsers) {
      state.users = newUsers
    },

    setAuth(state, newAuth) {
      state.isAuth = newAuth
    },

    setLoading(state, newLoading) {
      state.isLoading = newLoading
    }

  },

  actions: {

    async login({ commit }, email, password) {
      try {
        const res = await AuthService.login(email, password);
        localStorage.setItem('token', res.data.accessToken);
        commit('setAuth', true);
        commit('setUser', res.data.user);
      } catch(e) {
        console.log(e.res?.data?.message);
      }
    }, 

    async registration({ commit }, email, username, password) {
      try {
        const res = await AuthService.registration(email, username, password);
        localStorage.setItem('token', res.data.accessToken);
        commit('setAuth', true);
        commit('setUser', res.data.user);
      } catch(e) {
        console.log(e.res?.data?.message);
      }
    }, 

    async logout({ commit }) {
      try {
        const res = await AuthService.logout();
        localStorage.removeItem('token');
        commit('setAuth', false);
        commit('setUser', {});
      } catch(e) {
        console.log(e.res?.data?.message);
      }
    },

    async checkAuth({ commit }) {
      commit('setLoading', true)
      try {
        const res = await axios.get(`${API_URL}/refresh`, { withCredentials: true })
        localStorage.setItem('token', res.data.accessToken);
        commit('setAuth', true);
        commit('setUser', res.data.user);
      } catch(e) {
        console.log(e.res?.data?.message);
      } finally {
        commit('setLoading', false);
      }
    },

    async getUsers({ state }) {
      try {
        const res = await UserService.featchUsers();
        state.users = res.data
      } catch(e) {
        console.log(e);
      }
    }

  }
  
})
