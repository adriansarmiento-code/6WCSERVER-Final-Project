import { createStore } from "vuex";

export default createStore({
  state: {
    user: null,
    isAuthenticated: false,
    isAdmin: false,
  },
  getters: {
    isAuthenticated: (state) => state.isAuthenticated,
    currentUser: (state) => state.user,
    isAdmin: (state) => state.isAdmin,
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
      state.isAuthenticated = !!user;
      state.isAdmin = false;
    },
    SET_ADMIN(state, admin) {
      state.user = admin;
      state.isAuthenticated = !!admin;
      state.isAdmin = true;
    },
    LOGOUT(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
    },
  },
  actions: {
    login({ commit }, user) {
      commit("SET_USER", user);
    },
    adminLogin({ commit }, admin) {
      commit("SET_ADMIN", admin);
    },
    logout({ commit }) {
      commit("LOGOUT");
    },
  },
});
