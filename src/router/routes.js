import * as UserService from '../services/User';

const routes = [
  {
    path: '/',
    redirect: '/welcome',
    name: 'default',
    component: () => import('layouts/PublicLayout.vue'),
    children: [
      { path: 'welcome', component: () => import('pages/welcome/Welcome.vue') },
      { path: 'account-type', name: 'auth', component: () => import('pages/auth/AccountType.vue') },
      { path: 'login', component: () => import('pages/auth/Login.vue') },
      { path: 'signup', component: () => import('pages/auth/Signup.vue') },
      { path: 'forgot-password', component: () => import('pages/auth/ForgotPassword.vue') },
    ],
  },
  {
    path: '/app',
    component: () => import('layouts/MainLayout.vue'),
    redirect: () => {
      const user = UserService.getUser();
      if (user && user.data && user.data.roles === 'user') {
        return '/app/client/home';
      }
      return '/app/professional/home';
    },
    children: [
      {
        path: 'client/home',
        meta: { requiresAuth: true, allowedUsers: ['user'] },
        component: () => import('pages/Index.vue'),
      },
      {
        path: 'professional/home',
        meta: { requiresAuth: true, allowedUsers: ['professional'] },
        component: () => import('pages/Index.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
