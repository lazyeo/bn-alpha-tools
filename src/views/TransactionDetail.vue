<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- 头部 -->
    <div class="bg-white px-4 py-6 pt-12 shadow-sm">
      <div class="flex items-center mb-4">
        <button @click="$router.go(-1)" class="mr-4">
          <i class="fas fa-arrow-left text-gray-600"></i>
        </button>
        <h1 class="text-xl font-bold text-gray-800">交易详情</h1>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <i class="fas fa-spinner fa-spin text-3xl text-blue-500 mb-4"></i>
        <p class="text-gray-600">正在加载详情...</p>
      </div>
    </div>

    <!-- 详情内容 -->
    <div v-else-if="dayDetails">
      <!-- 日期选择 -->
      <div class="px-4 py-4">
        <div class="bg-white rounded-xl p-4 shadow-sm mb-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-semibold text-gray-800">{{ formatDateFull(selectedDate) }}</h3>
              <p class="text-sm text-gray-500">交易详细数据</p>
            </div>
            <i class="fas fa-calendar-alt text-blue-500 text-xl"></i>
          </div>
        </div>
      </div>

      <!-- 详细统计 -->
      <div class="px-4">
        <div class="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
          <div class="px-4 py-3 bg-gray-50 border-b">
            <h3 class="font-semibold text-gray-800">详细数据</h3>
          </div>

          <div class="p-4 space-y-4">
            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <i class="fas fa-exchange-alt text-blue-500 w-8"></i>
                <span class="text-gray-700 ml-2">交易笔数</span>
              </div>
              <span class="font-semibold text-gray-800">{{ dayDetails.transactionCount }} 笔</span>
            </div>

            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <i class="fas fa-coins text-green-500 w-8"></i>
                <span class="text-gray-700 ml-2">交易总量</span>
              </div>
              <span class="font-semibold text-gray-800">${{ dayDetails.volume.toLocaleString() }}</span>
            </div>

            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <i class="fas fa-chart-line text-purple-500 w-8"></i>
                <span class="text-gray-700 ml-2">平均交易额</span>
              </div>
              <span class="font-semibold text-gray-800">${{ dayDetails.avgTransactionAmount.toFixed(2) }}</span>
            </div>

            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <i class="fas fa-fire text-red-500 w-8"></i>
                <span class="text-gray-700 ml-2">磨损金额</span>
              </div>
              <span class="font-semibold text-red-500">${{ dayDetails.wearAmount.toFixed(2) }}</span>
            </div>

            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <i class="fas fa-star text-yellow-500 w-8"></i>
                <span class="text-gray-700 ml-2">获得积分</span>
              </div>
              <span class="font-semibold text-green-600">+{{ dayDetails.points }} 积分</span>
            </div>

            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <i class="fas fa-clock text-gray-500 w-8"></i>
                <span class="text-gray-700 ml-2">活跃时段</span>
              </div>
              <span class="font-semibold text-gray-800">{{ dayDetails.activeHours }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 交易类型分布 -->
      <div class="px-4 mb-4">
        <div class="bg-white rounded-xl shadow-sm p-4">
          <h3 class="font-semibold text-gray-800 mb-4">交易类型分布</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                <span class="text-gray-700">Swap</span>
              </div>
              <div class="flex items-center">
                <span class="text-gray-500 text-sm mr-2">{{ getPercentage(dayDetails.transactionTypes.swap, dayDetails.transactionCount) }}%</span>
                <span class="font-semibold">{{ dayDetails.transactionTypes.swap }}笔</span>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-4 h-4 bg-green-500 rounded mr-3"></div>
                <span class="text-gray-700">Transfer</span>
              </div>
              <div class="flex items-center">
                <span class="text-gray-500 text-sm mr-2">{{ getPercentage(dayDetails.transactionTypes.transfer, dayDetails.transactionCount) }}%</span>
                <span class="font-semibold">{{ dayDetails.transactionTypes.transfer }}笔</span>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-4 h-4 bg-purple-500 rounded mr-3"></div>
                <span class="text-gray-700">Liquidity</span>
              </div>
              <div class="flex items-center">
                <span class="text-gray-500 text-sm mr-2">{{ getPercentage(dayDetails.transactionTypes.liquidity, dayDetails.transactionCount) }}%</span>
                <span class="font-semibold">{{ dayDetails.transactionTypes.liquidity }}笔</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 时间分布图 -->
      <div class="px-4 mb-4">
        <div class="bg-white rounded-xl shadow-sm p-4">
          <h3 class="font-semibold text-gray-800 mb-4">24小时交易分布</h3>
          <div class="h-40 bg-gray-50 rounded-lg relative p-4">
            <!-- 图表容器 -->
            <div class="h-full flex items-end justify-center space-x-1">
              <div
                v-for="(count, hour) in dayDetails.hourlyDistribution"
                :key="hour"
                class="bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                :style="{
                  width: '12px',
                  height: `${getBarHeight(count, Math.max(...dayDetails.hourlyDistribution))}%`,
                  minHeight: count > 0 ? '4px' : '0px'
                }"
                :title="`${hour}:00 - ${count}笔交易`"
              ></div>
            </div>

            <!-- 时间轴标签 -->
            <div class="flex justify-between text-xs text-gray-500 mt-2 px-2">
              <span>00</span>
              <span>06</span>
              <span>12</span>
              <span>18</span>
              <span>24</span>
            </div>
          </div>

          <!-- 图表说明 -->
          <div class="mt-4 text-sm text-gray-600">
            <div class="flex items-center justify-between">
              <span>峰值时段: {{ getPeakHours() }}</span>
              <span>最高: {{ Math.max(...dayDetails.hourlyDistribution) }}笔</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 性能分析 -->
      <div class="px-4 mb-4">
        <div class="bg-white rounded-xl shadow-sm p-4">
          <h3 class="font-semibold text-gray-800 mb-4">性能分析</h3>
          <div class="grid grid-cols-2 gap-4">
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-500 mb-1">
                {{ ((dayDetails.volume / dayDetails.wearAmount) * 100).toFixed(1) }}%
              </div>
              <div class="text-xs text-gray-500">效率比率</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-green-500 mb-1">
                {{ (dayDetails.points / dayDetails.transactionCount).toFixed(1) }}
              </div>
              <div class="text-xs text-gray-500">单笔积分</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="flex items-center justify-center py-20">
      <div class="text-center">
        <i class="fas fa-calendar-times text-6xl text-gray-300 mb-4"></i>
        <p class="text-gray-500 mb-2">该日期暂无交易数据</p>
        <button
          @click="$router.go(-1)"
          class="text-blue-500 hover:text-blue-600"
        >
          返回列表
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useBscStore } from '@/stores/bsc'

const route = useRoute()
const bscStore = useBscStore()

// 响应式数据
const isLoading = ref(true)
const selectedDate = computed(() => route.params.date)
const dayDetails = ref(null)

// 方法
const formatDateFull = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
}

const getPercentage = (value, total) => {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

const getBarHeight = (value, max) => {
  if (max === 0) return 0
  return Math.max((value / max) * 100, 0)
}

const getPeakHours = () => {
  if (!dayDetails.value?.hourlyDistribution) return '无数据'

  const distribution = dayDetails.value.hourlyDistribution
  const maxCount = Math.max(...distribution)
  const peakHours = []

  distribution.forEach((count, hour) => {
    if (count === maxCount && count > 0) {
      peakHours.push(`${hour}:00`)
    }
  })

  return peakHours.length > 0 ? peakHours.join(', ') : '无数据'
}

// 加载详情数据
const loadDayDetails = async () => {
  isLoading.value = true

  try {
    // 如果没有交易数据，先获取
    if (bscStore.transactionData.length === 0 && route.params.address) {
      await bscStore.fetchTransactionData(route.params.address)
    }

    // 获取单日详情
    const details = bscStore.getDayDetails(selectedDate.value)
    dayDetails.value = details

  } catch (error) {
    console.error('Failed to load day details:', error)
  } finally {
    isLoading.value = false
  }
}

// 组件挂载
onMounted(() => {
  loadDayDetails()
})
</script>

<style scoped>
/* 工具提示样式 */
[title] {
  cursor: help;
}

/* 柱状图动画 */
.bg-blue-500 {
  transition: all 0.3s ease;
}

/* 性能指标样式 */
.grid > div {
  padding: 12px;
  border: 1px solid #f3f4f6;
  border-radius: 8px;
}
</style>
