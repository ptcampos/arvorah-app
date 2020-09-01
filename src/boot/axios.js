import Vue from 'vue';
import axios from 'axios';
import _ from 'lodash';

import { getUser, removeUser } from '../services/User';
import Router from '../router';

const axiosInstance = axios.create({
  baseURL: process.env.API_URL,
  timeout: 32000,
  headers: {
    'x-access-token': getUser() ? getUser().token : '',
  },
});

axiosInstance.interceptors.request.use(
  config => {
    config.headers['x-access-token'] = getUser() ? getUser().token : '';
    return config;
  },
  error => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (
      error.response &&
      error.response.data &&
      (error.response.data.message === 'Token Inválido' ||
        error.response.data.message === 'Acesso Restrito') &&
      error.response.status === 401
    ) {
      removeUser();
      Router().push({ name: 'auth' });
      window.location.reload();
      return Promise.reject(error.response.data.message);
    }
    if (
      error.response &&
      error.response.data === 'Invalid Token' &&
      error.response.status === 400
    ) {
      removeUser();
      return Router().push({ name: 'auth' });
    }
    if (error.request) {
      const { message } = JSON.parse(error.request.response);
      if (!_.isString(message) && !_.isNull(message) && !_.isEmpty(message)) {
        return Promise.reject(message.errmsg);
      }
      if (_.isString(message)) {
        if (message === 'Token Inválido' || message === 'Acesso Restrito') {
          removeUser();
          return Router().push({ name: 'auth' });
        }
        return Promise.reject(message);
      }
    }
    return Promise.reject(error);
  },
);

Vue.prototype.$axios = axiosInstance;

export { axiosInstance };
