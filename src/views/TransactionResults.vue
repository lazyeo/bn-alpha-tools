<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 头部 -->
    <div class="bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 px-4 py-6 text-white">
      <div class="mb-4">
        <h1 class="text-2xl font-bold mb-2">{{ currentViewTitle }}</h1>
        <p v-if="bscStore.currentAddress" class="text-blue-100 text-sm break-all">
          {{ bscStore.currentAddress }}
        </p>
      </div>

      <!-- 功能按钮行 -->
      <div class="flex items-center justify-between mb-4 gap-3">
        <!-- 视图切换按钮 -->
        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-1 flex flex-1 max-w-xs">
          <button
            @click="currentView = 'list'"
            :class="[
              'flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center',
              currentView === 'list'
                ? 'bg-white/20 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            ]"
          >
            <i class="fas fa-list mr-2"></i>
            列表
          </button>
          <button
            @click="currentView = 'statistics'"
            :class="[
              'flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center',
              currentView === 'statistics'
                ? 'bg-white/20 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            ]"
          >
            <i class="fas fa-chart-bar mr-2"></i>
            15日统计
          </button>
        </div>

        <!-- 刷新按钮 -->
        <button
          @click="refreshData"
          :disabled="loading"
          class="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all duration-300 disabled:opacity-50 flex items-center whitespace-nowrap"
        >
          <i :class="[loading ? 'fas fa-spinner fa-spin' : 'fas fa-sync-alt', 'mr-2']"></i>
          <span class="hidden sm:inline">{{ loading ? '刷新中' : '刷新' }}</span>
          <span class="sm:hidden">{{ loading ? '...' : '' }}</span>
        </button>
      </div>

      <!-- 统计卡片 -->
      <div class="grid grid-cols-2 gap-3 mb-4" v-if="currentView === 'list'">
        <div class="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
          <div class="text-2xl font-bold">{{ bscStore.statistics.totalTransactions }}</div>
          <div class="text-xs text-blue-100">总交易笔数</div>
        </div>
        <div class="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
          <div class="text-2xl font-bold">{{ formatNumber(bscStore.statistics.totalVolume) }}</div>
          <div class="text-xs text-blue-100">总交易量</div>
        </div>
      </div>

      <!-- 统计视图的顶部卡片 -->
      <div class="grid grid-cols-3 gap-3 mb-4" v-if="currentView === 'statistics'">
        <div class="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
          <div class="text-xl font-bold">{{ statistics15Days.totalTransactions }}</div>
          <div class="text-xs text-blue-100">15日交易数</div>
        </div>
        <div class="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
          <div class="text-xl font-bold">{{ formatNumber(statistics15Days.totalVolume) }}</div>
          <div class="text-xs text-blue-100">15日交易量</div>
        </div>
        <div class="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
          <div class="text-xl font-bold">{{ formatNumber(statistics15Days.totalProfit) }}</div>
          <div class="text-xs text-blue-100">15日盈亏</div>
        </div>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="errorMessage" class="px-4 py-4">
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
        {{ errorMessage }}
      </div>
    </div>

    <!-- 数值显示弹窗 -->
    <div v-if="showTooltip" class="fixed inset-0 pointer-events-none z-50">
      <div
        class="absolute bg-gray-800/90 backdrop-blur-sm text-white px-3 py-2 rounded-lg shadow-xl text-sm pointer-events-none border border-gray-600/50 max-w-xs"
        :style="tooltipStyle"
      >
        <div class="font-semibold text-white">{{ tooltipData.date }}</div>
        <div class="text-gray-200">{{ tooltipData.label }}：{{ tooltipData.value }}</div>
        <!-- 小箭头指示器 -->
        <div
          v-if="!isMobile"
          class="absolute w-2 h-2 bg-gray-800 rotate-45 border-l border-t border-gray-600/50"
          :style="arrowStyle"
        ></div>
      </div>
    </div>

    <!-- 统计视图 -->
    <div v-if="currentView === 'statistics' && transactionData.length > 0" class="px-4 py-6" @click="hideTooltip">
      <!-- 15日交易量柱状图 -->
      <div class="bg-white rounded-xl p-4 mb-6 shadow-sm">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-chart-bar text-blue-500 mr-2"></i>
          15日交易量统计
        </h3>
        <div class="h-64 w-full overflow-hidden" @click.stop>
          <svg class="w-full h-full" viewBox="0 0 450 220" v-if="chartData.volume.length > 0">
            <!-- 背景网格线 -->
            <defs>
              <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" stroke-width="1"/>
              </pattern>
            </defs>
            <rect x="60" y="10" width="380" height="180" fill="url(#grid)" />

            <!-- Y轴标签 -->
            <g v-for="(tick, index) in yAxisTicks.volume" :key="'y-' + index">
              <text :x="55" :y="200 - (index * 36)" text-anchor="end" class="text-xs fill-gray-500">
                {{ formatNumber(tick) }}
              </text>
            </g>

            <!-- 柱状图 -->
            <g v-for="(item, index) in chartData.volume" :key="'bar-' + index">
              <rect
                :x="70 + index * 24"
                :y="200 - (item.value / maxValues.volume * 160)"
                width="20"
                :height="item.value / maxValues.volume * 160"
                :fill="`hsl(${220 + index * 8}, 60%, 55%)`"
                class="hover:opacity-80 transition-opacity cursor-pointer"
                @click="showBarTooltip($event, item, '交易量', formatNumber(item.value))"
                @mouseenter="!isMobile && showBarTooltip($event, item, '交易量', formatNumber(item.value))"
                @mouseleave="!isMobile && hideTooltip()"
                @touchstart="showBarTooltip($event, item, '交易量', formatNumber(item.value))"
              />
              <!-- X轴标签 -->
              <text
                :x="80 + index * 24"
                y="215"
                text-anchor="middle"
                class="text-xs fill-gray-500"
              >
                {{ item.date.slice(-2) }}
              </text>
            </g>
          </svg>
          <div v-else class="h-full flex items-center justify-center text-gray-500">
            暂无数据
          </div>
        </div>
      </div>

      <!-- 15日盈亏柱状图 -->
      <div class="bg-white rounded-xl p-4 mb-6 shadow-sm">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-chart-bar text-green-500 mr-2"></i>
          15日盈亏统计
        </h3>
        <div class="h-64 w-full overflow-hidden" @click.stop>
          <svg class="w-full h-full" viewBox="0 0 450 220" v-if="chartData.profit.length > 0">
            <!-- 背景网格线 -->
            <rect x="60" y="10" width="380" height="180" fill="url(#grid)" />

            <!-- 零轴线 -->
            <line x1="60" y1="110" x2="440" y2="110" stroke="#e5e7eb" stroke-width="2"/>

            <!-- Y轴标签 -->
            <g v-for="(tick, index) in yAxisTicks.profit" :key="'profit-y-' + index">
              <text :x="55" :y="200 - (index * 36)" text-anchor="end" class="text-xs fill-gray-500">
                {{ formatNumber(tick) }}
              </text>
            </g>

            <!-- 柱状图 -->
            <g v-for="(item, index) in chartData.profit" :key="'profit-bar-' + index">
              <rect
                :x="70 + index * 24"
                :y="item.value >= 0 ? (110 - Math.abs(item.value) / maxAbsValues.profit * 80) : 110"
                width="20"
                :height="Math.abs(item.value) / maxAbsValues.profit * 80"
                :fill="item.value >= 0 ? '#10b981' : '#ef4444'"
                class="hover:opacity-80 transition-opacity cursor-pointer"
                @click="showBarTooltip($event, item, '盈亏', formatNumber(item.value))"
                @mouseenter="!isMobile && showBarTooltip($event, item, '盈亏', formatNumber(item.value))"
                @mouseleave="!isMobile && hideTooltip()"
                @touchstart="showBarTooltip($event, item, '盈亏', formatNumber(item.value))"
              />
              <!-- X轴标签 -->
              <text
                :x="80 + index * 24"
                y="215"
                text-anchor="middle"
                class="text-xs fill-gray-500"
              >
                {{ item.date.slice(-2) }}
              </text>
            </g>
          </svg>
          <div v-else class="h-full flex items-center justify-center text-gray-500">
            暂无数据
          </div>
        </div>
      </div>

      <!-- 15日积分柱状图 -->
      <div class="bg-white rounded-xl p-4 mb-6 shadow-sm">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-chart-bar text-purple-500 mr-2"></i>
          15日积分统计
        </h3>
        <div class="h-64 w-full overflow-hidden" @click.stop>
          <svg class="w-full h-full" viewBox="0 0 450 220" v-if="chartData.points.length > 0">
            <!-- 背景网格线 -->
            <rect x="60" y="10" width="380" height="180" fill="url(#grid)" />

            <!-- Y轴标签 -->
            <g v-for="(tick, index) in yAxisTicks.points" :key="'points-y-' + index">
              <text :x="55" :y="200 - (index * 36)" text-anchor="end" class="text-xs fill-gray-500">
                {{ Math.round(tick) }}
              </text>
            </g>

            <!-- 柱状图 -->
            <g v-for="(item, index) in chartData.points" :key="'points-bar-' + index">
              <rect
                :x="70 + index * 24"
                :y="200 - (item.value / maxValues.points * 160)"
                width="20"
                :height="item.value / maxValues.points * 160"
                :fill="`hsl(${270 + index * 5}, 60%, 55%)`"
                class="hover:opacity-80 transition-opacity cursor-pointer"
                @click="showBarTooltip($event, item, '积分', item.value.toString())"
                @mouseenter="!isMobile && showBarTooltip($event, item, '积分', item.value.toString())"
                @mouseleave="!isMobile && hideTooltip()"
                @touchstart="showBarTooltip($event, item, '积分', item.value.toString())"
              />
              <!-- X轴标签 -->
              <text
                :x="80 + index * 24"
                y="215"
                text-anchor="middle"
                class="text-xs fill-gray-500"
              >
                {{ item.date.slice(-2) }}
              </text>
            </g>
          </svg>
          <div v-else class="h-full flex items-center justify-center text-gray-500">
            暂无数据
          </div>
        </div>
      </div>

      <!-- 详细数据表格 -->
      <div class="bg-white rounded-xl p-4 shadow-sm">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-table text-gray-500 mr-2"></i>
          详细数据
        </h3>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="text-left py-2">日期</th>
                <th class="text-right py-2">交易量</th>
                <th class="text-right py-2">盈亏</th>
                <th class="text-right py-2">积分</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in chartData.volume" :key="item.date" class="border-b border-gray-100">
                <td class="py-2">{{ item.date }}</td>
                <td class="text-right py-2">{{ formatNumber(item.value) }}</td>
                <td class="text-right py-2" :class="getProfitByDate(item.date) >= 0 ? 'text-green-600' : 'text-red-600'">
                  {{ formatNumber(getProfitByDate(item.date)) }}
                </td>
                <td class="text-right py-2 text-blue-600">{{ getPointsByDate(item.date) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 交易数据列表 -->
    <div v-if="currentView === 'list' && transactionData.length > 0" class="px-4 py-4 pb-8">
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
    <div v-else-if="!bscStore.loading && transactionData.length === 0" class="px-4 py-12 text-center">
      <i v-if="currentView === 'list'" class="fas fa-search text-4xl text-gray-300 mb-4"></i>
      <i v-else-if="currentView === 'statistics'" class="fas fa-chart-bar text-4xl text-gray-300 mb-4"></i>

      <p v-if="currentView === 'list'" class="text-gray-500">暂无交易数据</p>
      <p v-else-if="currentView === 'statistics'" class="text-gray-500">暂无统计数据</p>

      <p v-if="currentView === 'statistics'" class="text-gray-400 text-sm mt-2">请先搜索BSC地址获取交易数据</p>

      <router-link to="/" class="text-blue-500 hover:text-blue-600 mt-2 inline-block">
        返回搜索页面
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
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
const currentView = ref('list')

// 统计相关响应式数据
const showTooltip = ref(false)
const tooltipPosition = ref({ x: 0, y: 0 })
const tooltipData = ref({ date: '', label: '', value: '' })

// 移动端检测
const isMobile = ref(false)

// 检测设备类型
const checkIfMobile = () => {
  isMobile.value = window.innerWidth < 768 || 'ontouchstart' in window
}

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

const currentViewTitle = computed(() => {
  if (currentView.value === 'list') {
    return '交易数据'
  } else if (currentView.value === 'statistics') {
    return '15日统计'
  }
  return ''
})

// 15日统计数据
const statistics15Days = computed(() => {
  // 获取最近15天的数据，从远到近排序
  const last15Days = transactionData.value.slice(0, 15).reverse()

  let totalTransactions = 0
  let totalVolume = 0
  let totalProfit = 0

  last15Days.forEach(item => {
    totalTransactions += item?.transactions?.length || 0
    totalVolume += item.tokenStats?.['BSC-USD']?.outflow || 0
    totalProfit += calculateLoss(item.tokenStats)
  })

  return {
    totalTransactions,
    totalVolume,
    totalProfit
  }
})

// 统计图表数据
const chartData = computed(() => {
  const volume = []
  const profit = []
  const points = []

  // 获取最近15天的数据，从远到近排序
  const dataToUse = transactionData.value.slice(0, 15).reverse()

  dataToUse.forEach(item => {
    const volumeValue = item.tokenStats?.['BSC-USD']?.outflow || 0
    const profitValue = calculateLoss(item.tokenStats)
    const pointsValue = calculatePoints(item.tokenStats)

    volume.push({
      date: item.date,
      value: volumeValue
    })

    profit.push({
      date: item.date,
      value: profitValue
    })

    points.push({
      date: item.date,
      value: pointsValue
    })
  })

  return { volume, profit, points }
})

// 图表最大值
const maxValues = computed(() => {
  const maxVolume = Math.max(...chartData.value.volume.map(item => item.value), 1)
  const maxPoints = Math.max(...chartData.value.points.map(item => item.value), 1)

  return {
    volume: maxVolume,
    points: maxPoints
  }
})

const maxAbsValues = computed(() => {
  const maxAbsProfit = Math.max(
    ...chartData.value.profit.map(item => Math.abs(item.value)),
    1
  )

  return {
    profit: maxAbsProfit
  }
})

// Y轴刻度
const yAxisTicks = computed(() => {
  const volumeTicks = []
  const profitTicks = []
  const pointsTicks = []

  // 交易量Y轴刻度
  for (let i = 0; i <= 5; i++) {
    volumeTicks.push((maxValues.value.volume / 5) * i)
  }

  // 盈亏Y轴刻度（包含正负值）
  const maxAbsProfit = maxAbsValues.value.profit
  for (let i = 0; i <= 5; i++) {
    profitTicks.push((maxAbsProfit / 2.5) * i - maxAbsProfit)
  }

  // 积分Y轴刻度
  for (let i = 0; i <= 5; i++) {
    pointsTicks.push((maxValues.value.points / 5) * i)
  }

  return {
    volume: volumeTicks,
    profit: profitTicks,
    points: pointsTicks
  }
})

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
  checkIfMobile()
  window.addEventListener('resize', checkIfMobile)

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

onUnmounted(() => {
  window.removeEventListener('resize', checkIfMobile)
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

const getProfitByDate = (date) => {
  const item = transactionData.value.find(i => i.date === date)
  return item ? calculateLoss(item.tokenStats) : 0
}

const getPointsByDate = (date) => {
  const item = transactionData.value.find(i => i.date === date)
  return item ? calculatePoints(item.tokenStats) : 0
}

const showBarTooltip = (event, item, label, value) => {
  // 阻止默认行为
  event.preventDefault()
  event.stopPropagation()

  // 获取鼠标或触摸位置
  const clientX = event.clientX || (event.touches && event.touches[0]?.clientX) || 0
  const clientY = event.clientY || (event.touches && event.touches[0]?.clientY) || 0

  tooltipPosition.value = { x: clientX, y: clientY }
  tooltipData.value = { date: item.date, label, value }
  showTooltip.value = true

  // 移动端点击显示3秒后自动隐藏
  if (isMobile.value && (event.type === 'click' || event.type === 'touchstart')) {
    setTimeout(() => {
      showTooltip.value = false
    }, 3000)
  }
}

// 智能tooltip定位计算属性
const tooltipStyle = computed(() => {
  const { x, y } = tooltipPosition.value
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight
  const tooltipWidth = 200 // 估算tooltip宽度
  const tooltipHeight = 60 // 估算tooltip高度
  const padding = 10 // 边距

  let left = x
  let top = y

  if (isMobile.value) {
    // 移动端：居中显示，避免被手指遮挡
    left = Math.max(padding, Math.min(windowWidth - tooltipWidth - padding, x - tooltipWidth / 2))
    top = Math.max(padding, y - tooltipHeight - 20) // 显示在点击位置上方

    // 如果上方空间不够，显示在下方
    if (top < padding) {
      top = y + 20
    }
  } else {
    // PC端：跟随鼠标，智能避免超出屏幕
    left = x + 15 // 鼠标右侧
    top = y - 10  // 鼠标稍微上方

    // 右边界检测
    if (left + tooltipWidth > windowWidth - padding) {
      left = x - tooltipWidth - 15 // 显示在鼠标左侧
    }

    // 下边界检测
    if (top + tooltipHeight > windowHeight - padding) {
      top = y - tooltipHeight - 15 // 显示在鼠标上方
    }

    // 上边界检测
    if (top < padding) {
      top = padding
    }

    // 左边界检测
    if (left < padding) {
      left = padding
    }
  }

  return {
    left: `${left}px`,
    top: `${top}px`,
    transform: isMobile.value ? 'none' : 'translateY(-50%)'
  }
})

// 箭头位置计算属性
const arrowStyle = computed(() => {
  const { x } = tooltipPosition.value
  const tooltipLeft = parseInt(tooltipStyle.value.left)
  const arrowLeft = Math.max(8, Math.min(180, x - tooltipLeft - 4)) // 箭头相对tooltip的位置

  return {
    left: `${arrowLeft}px`,
    bottom: '-4px'
  }
})

const hideTooltip = () => {
  showTooltip.value = false
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
