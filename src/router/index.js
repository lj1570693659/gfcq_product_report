import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/achieve/files'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/product',
    component: Layout,
    name: 'Product',
    meta: { title: '项目管理', icon: 'list' },
    children: [
      {
        path: 'index',
        name: 'Product',
        component: () => import('@/views/product/index'),
        meta: { title: '项目清单', noCache: true, icon: 'list' }
      },
      {
        path: 'member',
        name: 'Product',
        hidden: true,
        component: () => import('@/views/product/member'),
        meta: { title: '项目成员', noCache: true, icon: 'people' }
      },
      {
        path: 'import',
        component: () => import('@/views/product/import'),
        name: 'import',
        hidden: true,
        meta: { title: '文件上传', icon: 'edit' }
      },
      {
        path: 'info',
        component: () => import('@/views/product/info'),
        name: 'info',
        hidden: true,
        meta: { title: '项目详情', icon: 'edit' }
      },
      {
        path: 'deliverable',
        component: () => import('@/views/product/deliverable'),
        name: 'deliverable',
        hidden: true,
        meta: { title: '交付物统计', icon: 'edit' }
      },
      {
        path: 'create',
        component: () => import('@/views/product/create'),
        name: 'CreateProduct',
        hidden: true,
        meta: { title: '新增项目', icon: 'edit' }
      }
    ]
  },
  {
    path: '/achieve',
    component: Layout,
    name: 'Achieve',
    meta: { title: '项目文件', icon: 'example' },
    children: [
      {
        path: 'index',
        name: 'Achieve',
        component: () => import('@/views/achieve/'),
        meta: { title: '项目清单', icon: 'money' }
      },
      {
        path: 'files',
        name: 'files',
        component: () => import('@/views/achieve/files'),
        meta: { title: '文件统计', noCache: true, icon: 'star' }
      },
      {
        path: 'statistics',
        component: () => import('@/views/achieve/statistics'),
        name: 'statistics',
        hidden: true,
        meta: { title: '交付物统计', icon: 'edit' }
      },
      {
        path: 'task',
        component: () => import('@/views/achieve/task'),
        name: 'task',
        hidden: true,
        meta: { title: '项目绩效更新', icon: 'edit' }
      },
      {
        path: 'product',
        component: () => import('@/views/achieve/product'),
        name: 'product',
        hidden: true,
        meta: { title: '绩效详情', icon: 'edit' }
      },
      {
        path: 'depart',
        component: () => import('@/views/achieve/depart'),
        name: 'depart',
        hidden: true,
        meta: { title: '奖金分配', icon: 'edit' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
