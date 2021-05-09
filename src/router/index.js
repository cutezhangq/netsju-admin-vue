import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [{
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/',
      component: () => import('../components/common/Home.vue'),
      meta: {
        title: '自述文件'
      },
      children: [{
          path: '/dashboard',
          component: () => import('../components/page/Dashboard.vue'),
          meta: {
            title: '系统首页',
            permission: false
          }
        },
        {
          path: '/quality',
          component: () => import('../components/page/shProduct/BasicInfoManage/quality.vue'),
          meta: {
            title: '商品管理',
            permission: true,
            auth_admin: true
          }
        },

        // 地址管理
        {
          path: '/address',
          component: () => import('../components/page/shProduct/address/address.vue'),
          meta: {
            title: '地址管理',
            permission: true,
            auth_admin: true
          }
        },

        //订单管理
        {
          path: '/order',
          component: () => import('../components/page/shProduct/order/order.vue'),
          meta: {
            title: '订单管理',
            permission: true,
            auth_admin: true
          }
        },

        //购物车
        {
          path: '/cart',
          component: () => import('../components/page/shProduct/cart/cart.vue'),
          meta: {
            title: '购物车',
            permission: true,
            auth_admin: true
          }
        },

        //商品留言/评论
        {
          path: '/comment',
          component: () => import('../components/page/shProduct/comment/comment.vue'),
          meta: {
            title: '商品留言评论',
            permission: true,
            auth_admin: true
          }
        },

        // 系统管理
        {
          path: '/user',
          component: () => import('../components/page/shProduct/systemManage/user.vue'),
          meta: {
            title: '用户信息维护',
            permission: true,
            auth_admin: true
          }
        },

        {
          // 权限页面
          path: '/permission',
          component: () => import( /* webpackChunkName: "permission" */ '../components/page/Permission.vue'),
          meta: {
            title: '权限测试',
            permission: true
          }
        },
        {
          path: '/404',
          component: () => import( /* webpackChunkName: "404" */ '../components/page/404.vue'),
          meta: {
            title: '404'
          }
        },
        {
          path: '/403',
          component: () => import( /* webpackChunkName: "403" */ '../components/page/403.vue'),
          meta: {
            title: '403'
          }
        }
      ]
    },
    {
      path: '/login',
      component: () => import( /* webpackChunkName: "login" */ '../components/page/Login.vue'),
      meta: {
        title: '登录'
      }
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
});