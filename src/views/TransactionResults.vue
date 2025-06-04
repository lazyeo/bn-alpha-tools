<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 头部 -->
    <div class="bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 px-4 py-6 text-white">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h1 class="text-2xl font-bold">交易数据</h1>
          <p v-if="bscStore.currentAddress" class="text-blue-100 text-sm">
            {{ bscStore.currentAddressShort }}
          </p>
        </div>
        <button
          @click="refreshData"
          :disabled="loading"
          class="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all duration-300 disabled:opacity-50 flex items-center"
        >
          <i :class="[loading ? 'fas fa-spinner fa-spin' : 'fas fa-sync-alt', 'mr-2']"></i>
          {{ loading ? '刷新中' : '刷新' }}
        </button>
      </div>

      <!-- 统计卡片 -->
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
          <div class="text-2xl font-bold">{{ bscStore.statistics.totalTransactions }}</div>
          <div class="text-xs text-blue-100">总交易笔数</div>
        </div>
        <div class="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
          <div class="text-2xl font-bold">{{ formatNumber(bscStore.statistics.totalVolume) }}</div>
          <div class="text-xs text-blue-100">总交易量</div>
        </div>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="errorMessage" class="px-4 py-4">
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
        {{ errorMessage }}
      </div>
    </div>

    <!-- 交易数据列表 -->
    <div v-if="transactionData.length > 0" class="px-4 py-4 pb-8">
      <!-- 排序和筛选 -->
      <div class="bg-white rounded-lg p-4 mb-4 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-gray-800">排序方式</h3>
          <div class="flex space-x-2">
            <button
              @click="sortBy = 'date'; sortOrder = sortOrder === 'desc' ? 'asc' : 'desc'"
              class="px-3 py-1 text-sm border rounded-lg"
              :class="sortBy === 'date' ? 'bg-blue-500 text-white' : 'text-gray-600'"
            >
              按日期 {{ sortBy === 'date' && sortOrder === 'desc' ? '↓' : '↑' }}
            </button>
            <button
              @click="sortBy = 'volume'; sortOrder = sortOrder === 'desc' ? 'asc' : 'desc'"
              class="px-3 py-1 text-sm border rounded-lg"
              :class="sortBy === 'volume' ? 'bg-blue-500 text-white' : 'text-gray-600'"
            >
              按交易量 {{ sortBy === 'volume' && sortOrder === 'desc' ? '↓' : '↑' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 交易列表 -->
      <div class="space-y-3">
        <div
          v-for="(item, index) in sortedTransactionData"
          :key="index"
          class="bg-white rounded-lg shadow-sm"
        >
          <!-- 主要信息 -->
          <div class="p-4">
            <div class="flex items-center justify-between mb-2">
              <div class="font-semibold text-gray-800">{{ item.date }}</div>
              <button
                @click="toggleExpanded(index)"
                class="text-blue-500 hover:text-blue-600"
              >
                <i :class="expandedRows.has(index) ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
              </button>
            </div>

            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-500">交易笔数:</span>
                <span class="font-medium ml-1">{{ item?.transactions?.length || 0 }}</span>
              </div>
              <div>
                <span class="text-gray-500">交易量:</span>
                <span class="font-medium ml-1">{{ formatNumber(item?.tokenStats?.['BSC-USD']?.outflow) }}</span>
              </div>
              <div>
                <span class="text-gray-500">盈亏:</span>
                <span class="font-medium ml-1" :class="calculateLoss(item?.tokenStats) >= 0 ? 'text-green-600' : 'text-red-600'">
                  {{ formatNumber(calculateLoss(item?.tokenStats)) }}
                </span>
              </div>
              <div>
                <span class="text-gray-500">积分:</span>
                <span class="font-medium ml-1 text-blue-600">{{ calculatePoints(item?.tokenStats) }}</span>
              </div>
            </div>
          </div>

          <!-- 展开的详细信息 -->
          <div v-if="expandedRows.has(index)" class="border-t border-gray-100">
            <div class="p-4">
              <h4 class="font-medium text-gray-800 mb-3">交易详情</h4>

              <!-- 交易列表 -->
              <div class="space-y-2 max-h-64 overflow-y-auto">
                <div
                  v-for="tx in item.transactions"
                  :key="tx.hash"
                  class="bg-gray-50 rounded-lg p-3 text-sm"
                >
                  <div class="flex items-center justify-between mb-2">
                    <div class="font-mono text-xs text-gray-600">
                      <a
                        :href="`https://bscscan.com/tx/${tx.hash}`"
                        target="_blank"
                        class="text-blue-600 hover:text-blue-800 underline"
                      >
                        {{ tx.hash.slice(0, 8) }}...{{ tx.hash.slice(-6) }}
                      </a>
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ formatTime(tx.timeStamp) }}
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span class="text-gray-500">发送方:</span>
                      <div class="font-mono">{{ tx.from.slice(0, 6) }}...{{ tx.from.slice(-4) }}</div>
                    </div>
                    <div>
                      <span class="text-gray-500">接收方:</span>
                      <div class="font-mono">{{ tx.to.slice(0, 6) }}...{{ tx.to.slice(-4) }}</div>
                    </div>
                  </div>

                  <!-- 代币流向 -->
                  <div class="mt-2">
                    <div v-for="(tokenData, tokenSymbol) in tx.tokens" :key="tokenSymbol" class="text-xs">
                      <div v-if="tokenData.inflow > 0 || tokenData.outflow > 0">
                        <span class="font-medium">{{ tokenSymbol }}:</span>
                        <span v-if="tokenData.inflow > 0" class="text-green-600 ml-1">
                          +{{ formatNumber(tokenData.inflow) }}
                        </span>
                        <span v-if="tokenData.outflow > 0" class="text-red-600 ml-1">
                          -{{ formatNumber(tokenData.outflow) }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- 状态 -->
                  <div class="mt-2">
                    <span
                      :class="{
                        'text-green-600 bg-green-100': tx.status === '成功',
                        'text-red-600 bg-red-100': tx.status === '失败'
                      }"
                      class="px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {{ tx.status }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载更多 -->
      <div v-if="hasMore" class="text-center py-6">
        <button
          @click="loadMore"
          class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          加载更多
        </button>
      </div>
    </div>

    <!-- 无数据提示 -->
    <div v-else-if="!bscStore.loading" class="px-4 py-12 text-center">
      <i class="fas fa-search text-4xl text-gray-300 mb-4"></i>
      <p class="text-gray-500">暂无交易数据</p>
      <router-link to="/" class="text-blue-500 hover:text-blue-600 mt-2 inline-block">
        返回搜索页面
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBscStore } from '@/stores/bsc'
import { ApiUtils } from '@/utils/api'
import { TransactionUtils } from '@/utils/transaction'

const router = useRouter()
const route = useRoute()
const bscStore = useBscStore()

const errorMessage = ref('')
const loading = ref(false)
const sortBy = ref('date')
const sortOrder = ref('desc')
const expandedRows = ref(new Set())
const displayCount = ref(10)

// 计算属性
const transactionData = computed(() => bscStore.searchResults)

const sortedTransactionData = computed(() => {
  const data = [...transactionData.value].slice(0, displayCount.value)

  return data.sort((a, b) => {
    let aValue, bValue

    if (sortBy.value === 'date') {
      aValue = new Date(a.date)
      bValue = new Date(b.date)
    } else if (sortBy.value === 'volume') {
      aValue = a.tokenStats?.['BSC-USD']?.outflow || 0
      bValue = b.tokenStats?.['BSC-USD']?.outflow || 0
    } else {
      return 0
    }

    if (sortOrder.value === 'desc') {
      return bValue > aValue ? 1 : -1
    } else {
      return aValue > bValue ? 1 : -1
    }
  })
})

const hasMore = computed(() => displayCount.value < transactionData.value.length)

// 查询交易数据
const queryTransactionData = async (address) => {
  loading.value = true
  errorMessage.value = ''

  try {
    // 获取交易数据
    const filteredTransactions = await ApiUtils.fetchAddressData(address)

    if (filteredTransactions.length === 0) {
      errorMessage.value = '未找到与目标合约的交易记录'
      loading.value = false
      return
    }

    // 处理交易数据
    const sortedDays = TransactionUtils.groupTransactionsByDay(filteredTransactions)
    const processedData = sortedDays.map((item) => item['1'])

    // 更新store中的数据
    bscStore.setSearchResults(processedData)
    bscStore.setCurrentAddress(address)

  } catch (error) {
    console.error('查询失败:', error)
    errorMessage.value = '查询失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  // 从URL参数获取地址
  const addressFromParams = route.params.address

  if (addressFromParams) {
    // 如果有地址参数，直接查询
    await queryTransactionData(addressFromParams)
  } else if (!bscStore.searchResults.length && bscStore.currentAddress) {
    // 如果没有地址参数但有store中的地址，尝试生成模拟数据
    try {
      const mockData = bscStore.generateMockData(bscStore.currentAddress)
      bscStore.setSearchResults(mockData)
    } catch (error) {
      console.error('生成模拟数据失败:', error)
      errorMessage.value = '数据加载失败'
    }
  } else if (!bscStore.searchResults.length && !bscStore.currentAddress) {
    // 如果既没有数据也没有地址，跳转到首页
    router.push('/')
  }
})

// 方法
const toggleExpanded = (index) => {
  if (expandedRows.value.has(index)) {
    expandedRows.value.delete(index)
  } else {
    expandedRows.value.add(index)
  }
}

const loadMore = () => {
  displayCount.value += 10
}

const formatNumber = (value) => {
  if (value === undefined || value === null) return '0.00'
  return parseFloat(value).toFixed(2)
}

const formatTime = (timestamp) => {
  const date = new Date(parseInt(timestamp) * 1000)
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const calculateLoss = (tokenStats) => {
  const outflow = tokenStats?.['BSC-USD']?.outflow || 0
  const inflow = tokenStats?.['BSC-USD']?.inflow || 0
  return inflow - outflow
}

const calculatePoints = (tokenStats) => {
  const outflow = tokenStats?.['BSC-USD']?.outflow || 0
  // 如果亏损为0或负数，返回0积分
  if (outflow <= 0) return 0

  // 将亏损转换为正数并向下取整
  const absoluteLoss = Math.floor(Math.abs(outflow * 2))

  // 计算2的幂次方
  const power = Math.floor(Math.log2(absoluteLoss))

  // 返回2的幂次方作为积分
  return power
}

// 刷新数据
const refreshData = async () => {
  const currentAddress = route.params.address || bscStore.currentAddress
  if (currentAddress) {
    await queryTransactionData(currentAddress)
  }
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

/* 展开动画 */
.border-t {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 滚动条样式 */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>
