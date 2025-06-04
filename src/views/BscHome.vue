<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 头部 -->
    <div class="bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 px-4 py-6 text-white">
      <div class="text-center mb-8">
        <p class="text-blue-100">专业的币安智能链交易数据分析工具</p>
      </div>

      <!-- 搜索框 -->
      <div class="max-w-lg mx-auto mb-6">
        <div class="bg-white rounded-2xl p-6 shadow-lg">
          <div class="relative">
            <input
              v-model="bscAddress"
              @keyup.enter="queryTransactions"
              type="text"
              placeholder="请输入BSC钱包地址..."
              class="w-full px-4 py-4 pl-12 border border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              :class="{ 'border-red-300': errorMessage }"
            />
            <i class="fas fa-search absolute left-4 top-5 text-gray-400"></i>
          </div>

          <!-- 错误提示 -->
          <div v-if="errorMessage" class="mt-3 text-red-500 text-sm">
            {{ errorMessage }}
          </div>

          <button
            @click="queryTransactions"
            :disabled="loading"
            class="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
            <i v-else class="fas fa-search-plus mr-2"></i>
            {{ loading ? '查询中...' : '开始查询' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="px-4 py-6 pb-8">
      <!-- 搜索历史 -->
      <div v-if="searchHistory.length > 0" class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <i class="fas fa-history text-blue-500 mr-2"></i>
          搜索记录
        </h3>
        <div class="space-y-2">
          <div
            v-for="(address, index) in searchHistory"
            :key="index"
            class="bg-white rounded-lg p-3 shadow-sm flex items-center justify-between"
          >
            <div
              @click="useHistoryAddress(address)"
              class="flex-1 cursor-pointer"
            >
              <div class="font-medium text-gray-800 truncate">
                {{ address.slice(0, 8) }}...{{ address.slice(-6) }}
              </div>
              <div class="text-sm text-gray-500">{{ formatAddressTime() }}</div>
            </div>
            <button
              @click="removeHistoryAddress(index)"
              class="text-red-400 hover:text-red-600 transition-colors"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- 功能介绍 -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <i class="fas fa-info-circle text-green-500 mr-2"></i>
          功能特色
        </h3>
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-white rounded-lg p-4 shadow-sm text-center">
            <i class="fas fa-chart-line text-blue-500 text-2xl mb-2"></i>
            <div class="font-medium text-gray-800">交易分析</div>
            <div class="text-sm text-gray-500">详细的交易数据统计</div>
          </div>
          <div class="bg-white rounded-lg p-4 shadow-sm text-center">
            <i class="fas fa-coins text-green-500 text-2xl mb-2"></i>
            <div class="font-medium text-gray-800">代币流向</div>
            <div class="text-sm text-gray-500">多维度资金流向分析</div>
          </div>
          <div class="bg-white rounded-lg p-4 shadow-sm text-center">
            <i class="fas fa-clock text-purple-500 text-2xl mb-2"></i>
            <div class="font-medium text-gray-800">时间分布</div>
            <div class="text-sm text-gray-500">交易时间分布图表</div>
          </div>
          <div class="bg-white rounded-lg p-4 shadow-sm text-center">
            <i class="fas fa-trophy text-orange-500 text-2xl mb-2"></i>
            <div class="font-medium text-gray-800">积分计算</div>
            <div class="text-sm text-gray-500">智能积分评价系统</div>
          </div>
        </div>
      </div>

      <!-- 实时时间显示 -->
      <div class="text-center">
        <div class="bg-white rounded-lg p-4 shadow-sm">
          <div class="text-2xl font-bold text-gray-800">{{ currentTime }}</div>
          <div class="text-sm text-gray-500">当前时间</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 搜索历史记录相关
const SEARCH_HISTORY_KEY = 'bsc_search_history'
const MAX_HISTORY_ITEMS = 10

const bscAddress = ref('')
const loading = ref(false)
const errorMessage = ref('')
const currentTime = ref('')
const searchHistory = ref([])

let timeInterval = null

onMounted(() => {
  loadSearchHistory()
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})

// 更新时间
const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 加载搜索历史
const loadSearchHistory = () => {
  try {
    const savedHistory = localStorage.getItem(SEARCH_HISTORY_KEY)
    if (savedHistory) {
      searchHistory.value = JSON.parse(savedHistory)
    }
  } catch (error) {
    console.error('加载搜索历史失败:', error)
    searchHistory.value = []
  }
}

// 保存搜索历史
const saveSearchHistory = () => {
  try {
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(searchHistory.value))
  } catch (error) {
    console.error('保存搜索历史失败:', error)
  }
}

// 添加地址到搜索历史
const addToSearchHistory = (address) => {
  // 如果地址已存在，先移除它
  const index = searchHistory.value.indexOf(address)
  if (index !== -1) {
    searchHistory.value.splice(index, 1)
  }

  // 添加到历史记录的开头
  searchHistory.value.unshift(address)

  // 如果超过最大数量，移除最旧的
  if (searchHistory.value.length > MAX_HISTORY_ITEMS) {
    searchHistory.value = searchHistory.value.slice(0, MAX_HISTORY_ITEMS)
  }

  // 保存到本地存储
  saveSearchHistory()
}

// 从搜索历史中移除地址
const removeHistoryAddress = (index) => {
  searchHistory.value.splice(index, 1)
  saveSearchHistory()
}

// 使用历史记录中的地址
const useHistoryAddress = (address) => {
  // 直接跳转到结果页面，带上地址参数
  router.push({
    name: 'transaction-results',
    params: { address: address }
  })
}

// 格式化地址时间（模拟）
const formatAddressTime = () => {
  // 这里可以根据实际需求实现，比如从本地存储获取查询时间
  return '最近查询'
}

// BSC地址验证函数
const isValidBscAddress = (address) => {
  return /^0x[0-9a-fA-F]{40}$/.test(address)
}

// 查询交易数据
const queryTransactions = async () => {
  // 重置状态
  errorMessage.value = ''

  // 验证地址
  if (!bscAddress.value.trim()) {
    errorMessage.value = '请输入BSC地址'
    return
  }

  if (!isValidBscAddress(bscAddress.value.trim())) {
    errorMessage.value = '请输入有效的BSC地址格式'
    return
  }

  const address = bscAddress.value.trim()

  // 添加到搜索历史
  addToSearchHistory(address)

  // 直接跳转到结果页面，带上地址参数
  router.push({
    name: 'transaction-results',
    params: { address: address }
  })
}
</script>

<style scoped>
/* 渐变背景动画 */
.bg-gradient-to-br {
  background-size: 200% 200%;
  animation: gradientShift 6s ease infinite;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* 按钮点击效果 */
.cursor-pointer:active {
  transform: scale(0.98);
}

/* 平滑过渡效果 */
.transition-all {
  transition: all 0.3s ease;
}

/* 输入框焦点效果 */
input:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* 搜索卡片动画 */
.bg-white {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
