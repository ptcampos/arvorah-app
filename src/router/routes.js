import * as UserService from '../services/User';

const routes = [
  {
    path: '/',
    redirect: '/signup',
    name: 'default',
    component: () => import('layouts/PublicLayout.vue'),
    children: [
      { path: 'account-type', name: 'auth', component: () => import('pages/auth/AccountType.vue') },
      { path: 'login', component: () => import('pages/auth/Login.vue') },
      { path: 'signup', component: () => import('pages/auth/Signup.vue') },
      { path: 'signup-professional', component: () => import('pages/auth/SignupProfessional.vue') },
      { path: 'forgot-password', component: () => import('pages/auth/ForgotPassword.vue') },
    ],
  },
  {
    path: '/plan-subscription',
    redirect: '/select',
    name: 'planSubscription',
    component: () => import('layouts/BlankLayout.vue'),
    children: [
      {
        path: 'select',
        name: 'planSubscriptionSelect',
        component: () => import('pages/plans/SelectPlan.vue'),
      },
      {
        path: 'select/:planType',
        name: 'planSubscriptionConfirm',
        props: true,
        component: () => import('pages/plans/PlanDetails.vue'),
      },
    ],
  },
  {
    path: '/app',
    component: () => import('layouts/MainLayout.vue'),
    redirect: () => {
      const user = UserService.getUser();
      if (user && user.data && user.data.roles === 'user') {
        // const userPlan = UserService.getUserPlan();
        // if (!userPlan) {
        //   return '/plan-subscription/select';
        // }
        return '/app/client/home';
      }
      return '/app/professional/home';
    },
    children: [
      {
        path: 'client/home',
        meta: { requiresAuth: true, allowedUsers: ['user'] },
        component: () => import('pages/clients/Home.vue'),
      },
      {
        path: 'client/informative-content',
        meta: { requiresAuth: true, allowedUsers: ['user'] },
        component: () => import('pages/clients/informative-content/List.vue'),
      },
      {
        path: 'client/informative-content/:informativeContentId',
        props: true,
        meta: { requiresAuth: true, allowedUsers: ['user'] },
        component: () => import('pages/clients/informative-content/Details.vue'),
      },
      {
        path: 'client/schedule-select-professional',
        meta: { requiresAuth: true, allowedUsers: ['user'] },
        component: () => import('pages/clients/schedule/SelectProfessional.vue'),
      },
      {
        path: 'client/schedule-select-date/:professionalId',
        props: true,
        meta: { requiresAuth: true, allowedUsers: ['user'] },
        component: () => import('pages/clients/schedule/SelectDate.vue'),
      },
      {
        path: 'client/schedule-select-hour/:professionalId/:date',
        props: true,
        meta: { requiresAuth: true, allowedUsers: ['user'] },
        component: () => import('pages/clients/schedule/SelectHour.vue'),
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
