import { createRouter, createWebHistory } from 'vue-router'
import BscHome from '@/views/BscHome.vue'
import TransactionResults from '@/views/TransactionResults.vue'
import TransactionDetail from '@/views/TransactionDetail.vue'
import Statistics from '@/views/Statistics.vue'
import Settings from '@/views/Settings.vue'
import Help from '@/views/Help.vue'
import NotFound from '@/views/NotFound.vue'

// BSC地址验证函数
const isValidBscAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: BscHome
  },
  {
    path: '/results',
    name: 'results',
    component: TransactionResults
  },
  {
    path: '/results/:address',
    name: 'transaction-results',
    component: TransactionResults,
    beforeEnter: (to, from, next) => {
      const address = to.params.address
      if (!isValidBscAddress(address)) {
        next('/404')
      } else {
        next()
      }
    }
  },
  {
    path: '/detail/:date',
    name: 'transaction-detail',
    component: TransactionDetail,
    beforeEnter: (to, from, next) => {
      const date = to.params.date
      // 验证日期格式 YYYY-MM-DD
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      if (!dateRegex.test(date)) {
        next('/404')
      } else {
        next()
      }
    }
  },
  {
    path: '/statistics',
    name: 'statistics',
    component: Statistics
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings
  },
  {
    path: '/help',
    name: 'help',
    component: Help
  },
  {
    path: '/404',
    name: 'not-found',
    component: NotFound
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - BSC交易查询工具`
  }

  // 验证BSC地址格式（如果路由包含地址参数）
  if (to.params.address) {
    const bscAddressRegex = /^0x[a-fA-F0-9]{40}$/
    if (!bscAddressRegex.test(to.params.address)) {
      next({ name: 'home' })
      return
    }
  }

  next()
})

// 路由错误处理
router.onError((error) => {
  console.error('Router error:', error)
})

export default router
