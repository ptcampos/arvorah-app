import Vue from 'vue';
import VueRouter from 'vue-router';
import { Notify } from 'quasar';

import routes from './routes';

import { getUser, getUserPlan } from '../services/User';

Vue.use(VueRouter);

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function(/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE,
  });

  Router.beforeEach((to, from, next) => {
    const user = getUser();
    const userPlan = getUserPlan();
    if (user && to.name === 'default') {
      return next('/app');
    }
    if (
      user &&
      userPlan &&
      (to.name === 'planSubscriptionSelect' || to.name === 'planSubscriptionConfirm')
    ) {
      return next('/app');
    }
    if (user && to.matched && to.matched.length && to.matched[0].name === 'default') {
      return next('/app');
    }
    if (!user && to.meta.requiresAuth) {
      return next({ path: '/login', query: { type: 'client' } });
    }
    if (!to.meta.allowedUsers) {
      return next();
    }
    if (to.meta.allowedUsers.indexOf(user.data.roles) > -1) {
      return next();
    }
    Notify.create({
      message: 'Você não tem permissão para acessar essa rota.',
    });
    return next('/app');
  });

  return Router;
}
