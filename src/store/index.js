import Vue from 'vue';
import Vuex from 'vuex';

import user from './user';
import cycle from './cycle';
import schedule from './schedule';
import professionals from './professionals';
import informativeContent from './informative-content';

Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function(/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      user,
      cycle,
      informativeContent,
      schedule,
      professionals,
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV,
  });

  return Store;
}
