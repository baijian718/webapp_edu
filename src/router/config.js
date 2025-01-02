import TabsView from '@/layouts/tabs/TabsView'
import PageView from '@/layouts/PageView'

// 路由配置
const options = {
  routes: [
    {
      path: '/login',
      name: '登录页',
      component: () => import('@/pages/login')
    },
    {
      path: '*',
      name: '404',
      component: () => import('@/pages/exception/404'),
    },
    {
      path: '/403',
      name: '403',
      component: () => import('@/pages/exception/403'),
    },
    {
      path: '/',
      name: '首页',
      component: TabsView,
      redirect: '/login',
      children: [
        {
          path: 'demo',
          name: '工作台',
          meta: {
            icon: 'file-ppt'
          },
          component: () => import('@/pages/workbench')
        },
        {
          path: 'course',
          name: '课程管理',
          meta: {
            icon: 'dashboard',
            authority: {
              permission: '',
              role: 'teacher'
            },
          },
          component: PageView,
          children: [
            {
              path: 'course/list',
              name: '课程列表',
              component: () => import('@/pages/course/List'),
            }
          ]
        },
        {
          path: 'invoice',
          name: '账单管理',
          meta: {
            icon: 'form',
            authority: {
              permission: '',
              role: 'teacher'
            },
          },
          component: PageView,
          children: [
            {
              path: 'invoice/list',
              name: '账单列表',
              component: () => import('@/pages/invoice/List'),
            }
          ]
        },
        {
          path: 'course/student',
          name: '我的课程',
          meta: {
            icon: 'form',
            authority: {
              permission: '',
              role: 'student'
            },
          },
          component: PageView,
          children: [
            {
              path: 'my/list',
              name: '课程列表',
              component: () => import('@/pages/course/my/List'),
            }
          ]
        },
        {
          path: 'invoice/student',
          name: '我的账单',
          meta: {
            icon: 'form',
            authority: {
              permission: '',
              role: 'student'
            },
          },
          component: PageView,
          children: [
            {
              path: 'list',
              name: '账单列表',
              component: () => import('@/pages/invoice/student/List'),
            }
          ]
        },
      ]
    }
  ]
}

export default options
