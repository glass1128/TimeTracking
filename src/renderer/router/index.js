import Vue from 'vue';
import Router from 'vue-router';
import store from '../store';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Task',
      component: require('@/pages/task').default
    },
    {
      path: '/auth',
      name: 'Auth',
      component: require('@/pages/auth').default
    },
    {
      path: '/maintrack',
      name: 'Maintrack',
      component: require('@/pages/maintrack').default
    },
    {
      path: '/settings/power-monitor',
      name: 'PowerMonitor',
      component: require('@/pages/settings/power-monitor').default
    },
    {
      path: '/settings/licenses',
      name: 'Licenses',
      component: require('@/pages/settings/licenses').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
});

router.beforeEach(async (to, from, next) => {
  const accessToken = await store.dispatch('auth/restoreAccessToken');
  if (to.path === '/maintrack') {
    window.resizeTo(730, 600);
  } else if (to.path === '/') {
    window.resizeTo(370, 600);
  } else if (to.path === '/auth') {
    window.resizeTo(300, 500);
  }
  return !accessToken && to.path !== '/auth' ? next('/auth') : next();
});

router.afterEach((to, from) => {
  router.app.$ga.pageView(to);
});

export default router;
