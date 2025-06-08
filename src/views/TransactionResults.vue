<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 头部 -->
    <div class="bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 px-4 py-6 text-white shadow-lg sticky top-0 z-10">
      <div class="mb-4">
        <h1 class="text-2xl font-bold mb-2">{{ currentViewTitle }}</h1>
        <p v-if="currentAddress" class="text-blue-100 text-sm break-all">
          {{ currentAddress }}
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
                ? 'bg-white/20 text-white shadow-inner'
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
                ? 'bg-white/20 text-white shadow-inner'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            ]"
          >
            <i class="fas fa-chart-bar mr-2"></i>
            统计
          </button>
        </div>

        <!-- 刷新按钮 -->
        <div class="flex items-center gap-2">
          <button
            @click="refreshData"
            :disabled="loading"
            class="bg-white/20 backdrop-blur-sm text-white px-3 py-2 rounded-lg hover:bg-white/30 transition-all duration-300 disabled:opacity-50 flex items-center whitespace-nowrap text-sm"
          >
            <i :class="[loading ? 'fas fa-spinner fa-spin' : 'fas fa-sync-alt', 'mr-1']"></i>
            <span class="hidden sm:inline">{{ loading ? '刷新中' : '刷新' }}</span>
          </button>
        </div>
      </div>

      <!-- 数据状态指示器 -->
      <div class="mb-4 text-center">
          <div class="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 text-xs text-blue-100">
              <span v-if="hasHistoricalPrices" class="flex items-center">
                  <span class="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                  历史价格已缓存
              </span>
              <span v-else class="flex items-center">
                  <span class="w-2 h-2 bg-yellow-400 rounded-full mr-1"></span>
                  需要获取历史价格
              </span>
              <span class="text-blue-200">|</span>
              <span>{{ transactionData.length }}天数据</span>
          </div>
      </div>

      <!-- 统计卡片 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div class="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <div class="text-2xl font-bold">{{ statistics.totalTransactions }}</div>
              <div class="text-xs text-blue-100">总交易笔数</div>
          </div>
          <div class="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <div class="text-lg font-bold">
                ${{ formatNumber(statistics.totalAlphaInflow) }}
                <div v-if="statistics.totalBscBonus && statistics.totalBscBonus > 0" class="text-sm text-orange-300">
                  +${{ formatNumber(statistics.totalBscBonus) }} bonus
                </div>
              </div>
              <div class="text-xs text-blue-100">Alpha代币总流入</div>
          </div>
          <div class="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <div class="text-2xl font-bold">{{ formatPoints(statistics.totalPoints) }}</div>
              <div class="text-xs text-blue-100">累计Alpha积分</div>
          </div>
          <div class="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <div class="text-lg font-bold">${{ formatNumber(statistics.averageDailyVolume) }}</div>
              <div class="text-xs text-blue-100">日均交易额</div>
          </div>
      </div>

    </div>

    <!-- 错误提示 -->
    <div v-if="errorMessage" class="px-4 py-4">
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
        {{ errorMessage }}
      </div>
    </div>

    <!-- Loading Spinner -->
    <div v-if="loading && transactionData.length === 0" class="flex justify-center items-center h-64">
        <i class="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
    </div>

    <!-- Transaction List View -->
    <div v-if="currentView === 'list' && transactionData.length > 0" class="px-2 sm:px-4 py-4">
      <div v-for="day in transactionData" :key="day.date" class="mb-6 bg-white rounded-xl shadow-md overflow-hidden">
        <div class="bg-gray-50 p-3 border-b border-gray-200 flex justify-between items-center cursor-pointer" @click="toggleDayExpansion(day.date)">
          <div class="flex items-center">
            <h3 class="text-lg font-semibold text-gray-800 mr-3">{{ day.date }}</h3>
            <span class="text-sm text-gray-500">({{ day.transactions.length }} 笔交易)</span>
            <i :class="[expandedDays.has(day.date) ? 'fas fa-chevron-up' : 'fas fa-chevron-down', 'ml-2 text-gray-400 transition-transform']"></i>
          </div>
          <button
            @click.stop="calculateDailyStatisticsForDay(day)"
            :disabled="loading"
            class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm shadow-md hover:shadow-lg"
          >
            <i :class="[loading && dayBeingProcessed === day.date ? 'fas fa-spinner fa-spin' : 'fas fa-calculator', 'mr-2']"></i>
            <span>{{ day.statistics ? '重新统计' : '统计交易' }}</span>
          </button>
        </div>

        <!-- Daily Statistics Summary -->
        <div v-if="day.statistics" class="p-3 bg-blue-50 border-b border-gray-200">
            <!-- Main Stats Row -->
            <div class="grid grid-cols-2 gap-2 text-sm mb-3">
                <div class="text-center">
                    <span class="font-semibold text-gray-700">Alpha Inflow: </span>
                    <span class="text-green-600 font-bold">
                      ${{ formatNumber(day.statistics.alphaInflowUsd) }}
                      <span v-if="day.statistics.bscBonusUsd && day.statistics.bscBonusUsd > 0" class="text-orange-600 ml-1">
                        (bonus+${{ formatNumber(day.statistics.bscBonusUsd) }})
                      </span>
                    </span>
                </div>
                <div class="text-center">
                    <span class="font-semibold text-gray-700">Alpha Points: </span>
                    <span class="text-purple-600 font-bold">{{ formatPoints(day.statistics.points) }}</span>
                </div>
            </div>

                                                <!-- Extended Stats Row -->
            <div v-if="day.statistics.gasStats || day.statistics.flowStats" class="space-y-2">
                <!-- Simplified stats: Gas and Total Net only -->
                <div class="grid grid-cols-2 gap-2 text-xs">
                    <div v-if="day.statistics.gasStats" class="text-center bg-white/50 rounded p-2">
                        <div class="font-medium text-red-600">
                            {{ formatGas(day.statistics.gasStats.totalGasBnb) }} BNB
                            <div class="text-xs text-gray-500">≈${{ formatNumber(day.statistics.gasStats.totalGasBnb * 600) }}</div>
                        </div>
                        <div class="text-gray-600">Gas消耗</div>
                    </div>

                    <!-- Total net result -->
                    <div v-if="day.statistics.flowStats && day.statistics.flowStats.totalNetUsd !== undefined" class="text-center">
                        <div class="bg-gray-100 rounded-lg p-2 border-2" :class="day.statistics.flowStats.totalNetUsd >= 0 ? 'border-green-300' : 'border-red-300'">
                            <div class="font-bold text-base" :class="day.statistics.flowStats.totalNetUsd >= 0 ? 'text-green-700' : 'text-red-700'">
                                {{ day.statistics.flowStats.totalNetUsd >= 0 ? '+' : '-' }}${{ formatNumber(Math.abs(day.statistics.flowStats.totalNetUsd)) }}
                            </div>
                            <div class="text-xs text-gray-600">综合损益</div>
                        </div>
                    </div>
                </div>

                <!--
                TODO: Individual net amounts (commented out for now, may be optimized later)
                <div class="grid grid-cols-3 gap-2 text-xs">
                    <div v-if="day.statistics.flowStats" class="text-center bg-white/50 rounded p-2">
                        <div class="font-medium" :class="day.statistics.flowStats.netAlphaUsd >= 0 ? 'text-green-600' : 'text-red-600'">
                            {{ day.statistics.flowStats.netAlphaUsd >= 0 ? '+' : '-' }}${{ formatNumber(Math.abs(day.statistics.flowStats.netAlphaUsd)) }}
                        </div>
                        <div class="text-gray-600">Alpha净额</div>
                    </div>

                    <div v-if="day.statistics.flowStats" class="text-center bg-white/50 rounded p-2">
                        <div class="font-medium" :class="day.statistics.flowStats.netStablecoinUsd >= 0 ? 'text-green-600' : 'text-red-600'">
                            {{ day.statistics.flowStats.netStablecoinUsd >= 0 ? '+' : '-' }}${{ formatNumber(Math.abs(day.statistics.flowStats.netStablecoinUsd)) }}
                        </div>
                        <div class="text-gray-600">稳定币净额</div>
                    </div>

                    <div v-if="day.statistics.flowStats" class="text-center bg-white/50 rounded p-2">
                        <div class="font-medium" :class="day.statistics.flowStats.netBnbUsd >= 0 ? 'text-green-600' : 'text-red-600'">
                            {{ day.statistics.flowStats.netBnbUsd >= 0 ? '+' : '-' }}${{ formatNumber(Math.abs(day.statistics.flowStats.netBnbUsd)) }}
                        </div>
                        <div class="text-gray-600">BNB净额</div>
                    </div>
                </div>
                -->
            </div>

            <!-- 计算方法说明 -->
            <div class="mt-2 text-xs text-gray-500 bg-gray-50 rounded p-2">
                <details>
                    <summary class="cursor-pointer font-medium">📊 统计计算说明</summary>
                    <div class="mt-2 space-y-1 text-xs">
                        <p><strong>Alpha Inflow:</strong> 当日所有Alpha代币流入的USD价值总和</p>
                        <p><strong>BSC Bonus:</strong> BSC链Alpha代币流入额外计算一次（双倍奖励）</p>
                        <p><strong>积分计算:</strong> floor(log₂(Alpha Inflow + BSC Bonus))</p>
                        <p><strong>Gas消耗:</strong> 当日所有交易的BNB gas费用总和（按BNB≈$600计算USD）</p>
                        <p><strong>综合损益:</strong> 所有代币净流入流出差额 - Gas费用，绿色(+)盈利，红色(-)亏损</p>
                        <p><strong>总交易量:</strong> 只统计流入避免重复计算（交换中的流出通常对应其他代币流入）</p>
                        <p><strong>💾 缓存优化:</strong> 历史价格数据已缓存，无需重复获取</p>
                    </div>
                </details>
            </div>
        </div>

        <!-- 可收缩的交易列表 -->
        <div v-show="expandedDays.has(day.date)" class="transition-all duration-300">
          <ul class="divide-y divide-gray-200">
            <li v-for="tx in day.transactions" :key="tx.hash" class="p-3 hover:bg-gray-50 transition-colors duration-200">
              <div class="flex justify-between items-center text-xs mb-2">
                  <a :href="`https://bscscan.com/tx/${tx.hash}`" target="_blank" class="font-mono text-blue-600 hover:underline">
                      {{ tx.hash.slice(0, 10) }}...{{ tx.hash.slice(-8) }}
                  </a>
                  <span class="text-gray-500">{{ new Date(tx.timeStamp * 1000).toLocaleTimeString() }}</span>
              </div>
              <div v-if="tx.flows && tx.flows.length > 0" class="mt-2 pl-4 border-l-4 border-gray-200">
                <div v-for="(flow, index) in tx.flows" :key="index" class="text-sm py-1 flex justify-between items-center">
                  <div>
                      <span :class="flow.isInflow ? 'text-green-600' : 'text-red-600'">
                      {{ flow.isInflow ? '↓ In' : '↑ Out' }}
                      </span>
                      <strong class="mx-1">{{ formatNumber(flow.amount) }}</strong>
                      <span class="text-gray-800 font-semibold">{{ flow.token.symbol }}</span>
                  </div>
                  <div class="text-right">
                      <span v-if="flow.historicalPrice" class="text-gray-600 font-mono">
                      (@ ${{ formatPrice(flow.historicalPrice) }})
                      <span class="font-bold text-black ml-2">
                          ${{ formatNumber(flow.amount * flow.historicalPrice) }}
                      </span>
                      </span>
                      <span v-else class="text-gray-400 font-mono">
                      (No price data)
                      </span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && transactionData.length === 0 && !errorMessage" class="text-center py-16">
        <p class="text-gray-500">没有找到交易记录。</p>
    </div>

    <!-- Statistics View (Placeholder) -->
    <div v-if="currentView === 'statistics'" class="p-4">
        <div class="bg-white p-6 rounded-xl shadow-md text-center">
            <h3 class="text-lg font-semibold">统计视图正在建设中</h3>
            <p class="text-gray-600 mt-2">详细的图表和数据分析即将推出。</p>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useBscStore } from '@/stores/bsc'
import { storeToRefs } from 'pinia'

const route = useRoute()
const bscStore = useBscStore()

// Use storeToRefs to keep reactivity on state and getters
const {
  searchResults: transactionData,
  statistics,
  loading,
  error: errorMessage,
  currentAddress
} = storeToRefs(bscStore)

// Check if data has historical prices
const hasHistoricalPrices = computed(() => {
    return transactionData.value.some(day =>
        day.transactions?.some(tx =>
            tx.flows?.some(flow => flow.historicalPrice !== null && flow.historicalPrice !== undefined)
        )
    );
});

const currentView = ref('list') // 'list' or 'statistics'
const dayBeingProcessed = ref(null) // To track which day's stats are being calculated
const expandedDays = ref(new Set()) // To track expanded days

const currentViewTitle = computed(() => {
  return currentView.value === 'list' ? '交易记录' : '全局统计'
})

// Function to format numbers for better readability
const formatNumber = (num) => {
  if (num === null || num === undefined) return '0.00'
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const formatPrice = (num) => {
    if (num === null || num === undefined) return 'N/A';
    if (num < 0.01) {
        return num.toPrecision(4);
    }
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 });
};

const formatPoints = (num) => {
    if (num === null || num === undefined) return '0';
    return Math.floor(num).toString();
};

const formatGas = (num) => {
    if (num === null || num === undefined) return '0.000000';
    if (num < 0.000001) {
        return num.toExponential(2);
    }
    return num.toLocaleString(undefined, { minimumFractionDigits: 6, maximumFractionDigits: 6 });
};

// Wrapper for the store action to track which day is being processed
const calculateDailyStatisticsForDay = async (day) => {
    dayBeingProcessed.value = day.date;
    try {
        await bscStore.calculateDailyStatistics(day);
    } finally {
        dayBeingProcessed.value = null;
    }
}

// Refresh data function
const refreshData = () => {
  if (currentAddress.value) {
    bscStore.fetchAndProcessTransactions(currentAddress.value, true)
  }
}

// Fetch initial data on component mount or when route changes
onMounted(() => {
  const address = route.params.address
  if (address && address !== currentAddress.value) {
    bscStore.fetchAndProcessTransactions(address)
  }
})

watch(() => route.params.address, (newAddress) => {
    if (newAddress && newAddress !== currentAddress.value) {
        bscStore.fetchAndProcessTransactions(newAddress);
    }
});

// Function to toggle day expansion
const toggleDayExpansion = (date) => {
  if (expandedDays.value.has(date)) {
    expandedDays.value.delete(date);
  } else {
    expandedDays.value.add(date);
  }
}
</script>

<style scoped>
/* Scoped styles for any specific adjustments */
.shadow-inner {
    box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
}
</style>
