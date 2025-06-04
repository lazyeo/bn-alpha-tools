import { createRouter, createWebHistory } from 'vue-router'
import BscHome from '@/views/BscHome.vue'
import TransactionResults from '@/views/TransactionResults.vue'
import Settings from '@/views/Settings.vue'
import Help from '@/views/Help.vue'
import AlphaPointsRules from '@/views/AlphaPointsRules.vue'
import Contact from '@/views/Contact.vue'
import Donation from '@/views/Donation.vue'
import NotFound from '@/views/NotFound.vue'
import AddressManager from '@/views/AddressManager.vue'

// BSC地址验证函数
const isValidBscAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: BscHome,
    meta: { title: 'BSC交易量查询工具' }
  },
  {
    path: '/results',
    redirect: '/'
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
    },
    meta: { title: '交易查询结果' }
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings
  },
  {
    path: '/help',
    name: 'help',
    component: Help,
    meta: { title: '使用帮助' }
  },
  {
    path: '/alpha-points-rules',
    name: 'alpha-points-rules',
    component: AlphaPointsRules,
    meta: { title: '币安Alpha积分规则' }
  },
  {
    path: '/contact',
    name: 'contact',
    component: Contact,
    meta: { title: '联系我们' }
  },
  {
    path: '/donation',
    name: 'donation',
    component: Donation,
    meta: { title: '打赏猪脚饭' }
  },
  {
    path: '/address-manager',
    name: 'address-manager',
    component: AddressManager,
    meta: { title: '多地址管理' }
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
