import keytar from 'keytar';

export const SET_APP_TOKEN = 'SET_APP_TOKEN';
export const CLEAR_ACCESS_TOKEN = 'CLEAR_ACCESS_TOKEN';
export const SET_API_URL = 'SET_API_URL';
export const SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN';
export const SET_CREDENTIAL = 'SET_CREDENTIAL';

export const state = {
  name: 'OC',
  // service: `oc-timetrack-${process.env.NODE_ENV}`,
  service: 'oc',
  accessToken: undefined,
  scopes: [
    'activities:read',
    'activities:write',
    'projects:read',
    'projects:write',
    'suggestions:read'
  ],
  email: undefined,
  password: undefined,
  webUrl: 'https://app.oc.plus',
  apiUrl: 'https://app.oc.plus'
};

export const mutations = {
  [SET_API_URL](state, payload) {
    state.apiUrl = payload;
  },
  [SET_APP_TOKEN](state, payload) {
    state.email = payload.email;
    state.webUrl = payload.webUrl;
    state.password = payload.password;
  },
  [SET_CREDENTIAL](state, payload) {
    state.email = payload.email;
    state.password = payload.password;
  },
  [SET_ACCESS_TOKEN](state, payload) {
    state.accessToken = payload;
  },
  [CLEAR_ACCESS_TOKEN](state, payload) {
    state.accessToken = undefined;
  }
};

export const actions = {
  async fetchAppToken({ state, commit, dispatch }) {
    try {
      console.log('Got into fetchAppToken func.');
      return true;
    } catch (e) {
      dispatch('toast/error', e, { root: true });
      return false;
    }
  },
  async fetchAccessToken({ state, commit, dispatch }, payload) {
    try {
      console.log('Got into fetchAccessToken func.');
      commit(SET_CREDENTIAL, {
        email: payload.Eml,
        password: payload.Pass
      });
      console.log('Email : ' + state.email);
      console.log('Password : ' + state.password);
      const { data } = await dispatch(
        'api/request',
        {
          url: '/api/v1/login',
          method: 'post',
          data: {
            user_tenant_res: 'long',
            email: state.email,
            password: state.password
          }
        },
        { root: true }
      );
      console.log(data.token);
      if (data.token === null || data.token === '') {
        console.log('token is null or empty.');
        dispatch('toast/error', data.message, { root: true });
        return false;
      }
      commit(SET_ACCESS_TOKEN, data.token);
      return true;
    } catch (e) {
      console.log(e);
      dispatch('toast/error', e, { root: true });
      return false;
    }
  },
  async logout({ state, commit, dispatch }) {
    try {
      await dispatch(
        'auth-api/request',
        {
          url: '/api/v1/logout',
          method: 'get',
          data: {
            user_tenant_res: 'long'
          }
        },
        { root: true }
      );
    } catch (e) {
      // dispatch('toast/error', e, { root: true });
      console.log(e);
    }
    await keytar.deletePassword(state.service, state.email);
    commit(CLEAR_ACCESS_TOKEN);
  },
  async restoreAccessToken({ state, commit }, url) {
    console.log('Got into restoreAccessToken func.');
    if (state.accessToken) return state.accessToken;
    try {
      console.log('accessToken is undefined.');
      const accessToken = await keytar.getPassword(state.service, state.email);
      console.log('Token : ' + accessToken);
      commit(SET_ACCESS_TOKEN, accessToken);
      return accessToken;
    } catch (e) {
      console.log('ERROR : ' + e.message);
      return null;
    }
  },
  storeAccessToken({ state, commit }, accessToken) {
    commit(SET_ACCESS_TOKEN, accessToken);
    keytar.setPassword(state.service, state.email, accessToken);
  }
};

export const getters = {
  apiUrl: state => {
    return state.apiUrl;
  },
  webUrl: (state, getters) => {
    return state.webUrl;
  },
  persistKey: (state, getters) => {
    const toBase64 = value => Buffer.from(value).toString('base64');
    return toBase64(`${state.apiUrl}}`);
  },
  accessToken: state => {
    return state.accessToken;
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
