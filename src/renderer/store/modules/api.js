import merge from 'lodash.merge';
import axios from 'axios';
// import { app } from 'electron';
import camelcaseKeys from 'camelcase-keys';
// import snakecaseKeys from 'snakecase-keys';

export const actions = {
  async request({ state, rootGetters }, config) {
    console.log(rootGetters['auth/apiUrl']);
    const res = await axios.request(
      merge(
        {
          ...config,
          // data: snakecaseKeys(config.data || {}),
          // params: snakecaseKeys(config.params || {})
          data: config.data || {},
          params: config.params || {}
        },
        {
          baseURL: rootGetters['auth/apiUrl'],
          timeout: 10000,
          headers: {
            // 'Accept-Language': app.getLocale()
            Accept: 'application/json'
          }
        }
      )
    );
    return {
      data: camelcaseKeys(res.data || {}, { deep: true }),
      headers: res.headers
    };
  }
};

export default {
  actions
};
