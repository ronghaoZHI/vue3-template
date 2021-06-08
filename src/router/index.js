import {
  createRouter,
  createWebHashHistory
} from 'vue-router'


const routes = []

// Create a new router instance.
const router = new createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, from) => {
  // console.log(to, from)

  return true
  // 返回 false 以取消导航
  // return false
})

export default router