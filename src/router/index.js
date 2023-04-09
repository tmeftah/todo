import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../firebase'
import HomeView from '../views/HomeView.vue'
import Login from '../views/LoginView.vue'
import PageNotFound from '../components/PageNotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        authRequired: true
      }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    { path: '/:pathMatch(.*)*', name: 'PageNotFound', component: PageNotFound }
  ]
})

router.beforeEach((to, from, next) => {
  if (!auth.currentUser && to.name !== 'login') {
    next('/login')
  } else if (auth.currentUser && to.name === 'login') {
    next('/')
  } else {
    next()
  }
})

export default router
