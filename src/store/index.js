import { createStore } from "vuex";

export default createStore({
  state: {
    user: null,
    token: null,
    isAuthenticated: false,
    isAdmin: false,
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
      state.isAuthenticated = true;
    },
    SET_TOKEN(state, token) {
      state.token = token;
    },
    SET_ADMIN(state) {
      state.isAdmin = true;
    },
    LOGOUT(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
    },
  },
  actions: {
    login({ commit }, { user, token }) {
      commit("SET_USER", user);
      commit("SET_TOKEN", token);
    },
    adminLogin({ commit }, { user, token }) {
      commit("SET_USER", user);
      commit("SET_TOKEN", token);
      commit("SET_ADMIN");
    },
    logout({ commit }) {
      commit("LOGOUT");
    },
  },
  getters: {
    isAuthenticated: (state) => state.isAuthenticated,
    isAdmin: (state) => state.isAdmin,
    currentUser: (state) => state.user,
    getToken: (state) => state.token,
  },
});
