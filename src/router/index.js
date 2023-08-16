// Composables
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/Home.vue'),
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('@/views/Settings.vue'),
        children: [
          {
            path: 'ingredients',
            name: 'ingredients',
            component: () => import('@/views/settings/ingredients.vue')
          },
          {
            path: 'pills',
            name: 'pills',
            component: () => import('@/views/settings/pills.vue')
          },
          {
            path: 'security',
            name: 'security',
            component: () => import('@/views/settings/security.vue')
          },
          {
            path: 'export',
            name: 'export',
            component: () => import('@/views/settings/export.vue')
          },
        ]
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
})

export default router
