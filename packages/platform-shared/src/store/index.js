/**
 * Copyright 2019-2020 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */
import Vue from 'vue';
import Vuex from 'vuex';
import User from './modules/User';
import Application from './modules/Application';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    accessTokenKey: '',
    amBaseURL: null,
    company: '',
    email: '',
    enduserURL: '',
    firstName: '',
    idmAdminURL: '',
    idmBaseURL: '/openidm',
    idmClientID: null,
    lastName: '',
    loginURL: null,
    managedResource: '',
    realm: 'root',
    returnRoute: '',
    returnRouteText: '',
    theme: 'default',
    userId: null,
  },
  getters: {
    fullName: (state) => `${state.firstName} ${state.lastName}`,
  },
  mutations: {
    setUserId(state, id) {
      state.userId = id;
    },
    setUserDetails(state, userDetails) {
      state.firstName = userDetails.givenName;
      state.lastName = userDetails.sn;
      state.email = userDetails.mail;
      state.company = userDetails.company;
      state.managedResource = userDetails.managedResource;
    },
    setEnvironment(state, env) {
      if (env.VUE_APP_AM_URL) {
        state.amBaseURL = env.VUE_APP_AM_URL;
      }

      if (env.VUE_APP_GATEWAY_URL) {
        state.gatewayBaseUrl = env.VUE_APP_GATEWAY_URL;
      }

      if (env.VUE_APP_IDM_URL) {
        state.idmBaseURL = env.VUE_APP_IDM_URL;
      }

      if (env.VUE_APP_IDM_UPLOAD_URL) {
        state.idmUploadURL = env.VUE_APP_IDM_UPLOAD_URL;
      }

      if (env.VUE_APP_IDM_EXPORT_URL) {
        state.idmExportURL = env.VUE_APP_IDM_EXPORT_URL;
      }

      if (env.VUE_APP_IDM_ADMIN_URL) {
        state.idmAdminURL = env.VUE_APP_IDM_ADMIN_URL;
      }

      if (env.VUE_APP_ENDUSER_URL) {
        state.enduserURL = env.VUE_APP_ENDUSER_URL;
      }

      if (env.VUE_APP_LOGIN_URL) {
        state.loginURL = env.VUE_APP_LOGIN_URL;
      }

      if (env.VUE_APP_ADMIN_CLIENT_ID) {
        state.idmClientID = env.VUE_APP_ADMIN_CLIENT_ID;
      }

      if (env.VUE_APP_ACCESS_TOKEN_KEY) {
        state.accessTokenKey = env.VUE_APP_ACCESS_TOKEN_KEY;
      }

      if (env.THEME) {
        state.theme = env.THEME;
      }
    },
    setReturnRoute(state, newValue) {
      if (newValue.returnRoute || newValue.returnRoute === '') {
        state.returnRoute = newValue.returnRoute;
      }

      if (newValue.returnRouteText || newValue.returnRouteText === '') {
        state.returnRouteText = newValue.returnRouteText;
      }
    },
  },
  actions: {
    setUserId(context, id) {
      context.commit('setUserId', id);
    },
    setUserDetails(context, userDetails) {
      context.commit('setUserDetails', {
        givenName: userDetails.givenName,
        sn: userDetails.sn,
        mail: userDetails.mail,
        company: userDetails.company,
      });
    },
    setEnvironment(context, env) {
      context.commit('setEnvironment', env);
    },
    setReturnRoute(context, newValue) {
      context.commit('setReturnRoute', {
        returnRoute: newValue.returnRoute,
        returnRouteText: newValue.returnRouteText,
      });
    },
  },
  modules: {
    UserStore: {
      namespaced: true,
      state: User.state,
      getters: User.getters,
      actions: User.actions,
      mutations: User.mutations,
    },
    ApplicationStore: {
      namespaced: true,
      state: Application.state,
      getters: Application.getters,
      actions: Application.actions,
      mutations: Application.mutations,
    },
  },
});