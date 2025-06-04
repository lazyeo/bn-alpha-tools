<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 头部 -->
    <div class="bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 px-4 py-6 text-white">
      <div class="mb-4">
        <h1 class="text-2xl font-bold">数据统计</h1>
        <p v-if="bscStore.currentAddress" class="text-blue-100 text-sm">
          {{ bscStore.currentAddressShort }}
        </p>
      </div>

      <!-- 总体统计卡片 -->
      <div class="grid grid-cols-3 gap-3 mb-4">
        <div class="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
          <div class="text-xl font-bold">{{ bscStore.statistics.totalTransactions }}</div>
          <div class="text-xs text-blue-100">总交易数</div>
        </div>
        <div class="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
          <div class="text-xl font-bold">{{ formatNumber(bscStore.statistics.totalVolume) }}</div>
          <div class="text-xs text-blue-100">总交易量</div>
        </div>
        <div class="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
          <div class="text-xl font-bold">{{ formatNumber(totalProfit) }}</div>
          <div class="text-xs text-blue-100">总盈亏</div>
        </div>
      </div>
    </div>

    <!-- 数值显示弹窗 -->
    <div v-if="showTooltip" class="fixed inset-0 pointer-events-none z-50">
      <div
        class="absolute bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg text-sm pointer-events-none"
        :style="{ left: tooltipPosition.x + 'px', top: tooltipPosition.y + 'px' }"
      >
        <div class="font-semibold">{{ tooltipData.date }}</div>
        <div>{{ tooltipData.label }}：{{ tooltipData.value }}</div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="px-4 py-6">
      <!-- 15日交易量柱状图 -->
      <div class="bg-white rounded-xl p-4 mb-6 shadow-sm">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-chart-bar text-blue-500 mr-2"></i>
          15日交易量统计
        </h3>
        <div class="h-64 w-full overflow-hidden">
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
        <div class="h-64 w-full overflow-hidden">
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
        <div class="h-64 w-full overflow-hidden">
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
              <tr v-for="(item, index) in detailData" :key="index" class="border-b border-gray-100">
                <td class="py-2">{{ formatDate(item.date) }}</td>
                <td class="text-right py-2">{{ formatNumber(item.volume) }}</td>
                <td class="text-right py-2" :class="item.profit >= 0 ? 'text-green-600' : 'text-red-600'">
                  {{ formatNumber(item.profit) }}
                </td>
                <td class="text-right py-2 text-blue-600">{{ item.points }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 底部导航 -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div class="flex justify-around">
        <router-link to="/" class="flex flex-col items-center py-2 text-gray-400">
          <i class="fas fa-home text-xl mb-1"></i>
          <span class="text-xs">首页</span>
        </router-link>
        <router-link
          v-if="bscStore.currentAddress || bscStore.searchResults.length > 0"
          to="/results"
          class="flex flex-col items-center py-2 text-gray-400"
        >
          <i class="fas fa-list text-xl mb-1"></i>
          <span class="text-xs">结果</span>
        </router-link>
        <router-link to="/statistics" class="flex flex-col items-center py-2 text-blue-500">
          <i class="fas fa-chart-bar text-xl mb-1"></i>
          <span class="text-xs">统计</span>
        </router-link>
        <router-link to="/settings" class="flex flex-col items-center py-2 text-gray-400">
          <i class="fas fa-cog text-xl mb-1"></i>
          <span class="text-xs">设置</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useBscStore } from '@/stores/bsc'

// 组件名称（解决linter错误）
defineOptions({
  name: 'StatisticsView'
})

const bscStore = useBscStore()

// 提示框相关状态
const showTooltip = ref(false)
const tooltipPosition = ref({ x: 0, y: 0 })
const tooltipData = ref({ date: '', label: '', value: '' })
let tooltipTimer = null

onMounted(() => {
  // 如果没有数据，生成模拟数据
  if (!bscStore.searchResults.length && bscStore.currentAddress) {
    const mockData = bscStore.generateMockData(bscStore.currentAddress)
    bscStore.setSearchResults(mockData)
  } else if (!bscStore.searchResults.length && !bscStore.currentAddress) {
    // 如果没有地址，生成默认模拟数据
    const mockData = bscStore.generateMockData('0x1234567890123456789012345678901234567890')
    bscStore.setSearchResults(mockData)
  }
})

// 显示柱状图提示
const showBarTooltip = (event, item, label, value) => {
  const rect = event.target.getBoundingClientRect()

  // 计算提示框位置，避免超出屏幕
  let x = rect.left + rect.width / 2
  let y = rect.top - 60

  // 确保提示框不超出屏幕左边界
  if (x < 100) x = 100
  // 确保提示框不超出屏幕右边界
  if (x > window.innerWidth - 100) x = window.innerWidth - 100
  // 确保提示框不超出屏幕上边界
  if (y < 10) y = rect.bottom + 10

  tooltipPosition.value = { x, y }
  tooltipData.value = {
    date: formatDate(item.date),
    label,
    value
  }

  showTooltip.value = true

  // 自动隐藏提示框
  if (tooltipTimer) {
    clearTimeout(tooltipTimer)
  }
  tooltipTimer = setTimeout(() => {
    showTooltip.value = false
  }, 3000)
}

// 计算最近15天的数据（用于图表）
const last15DaysData = computed(() => {
  return bscStore.searchResults.slice(0, 15).reverse()
})

// 计算盈亏
const calculateProfit = (tokenStats) => {
  const outflow = tokenStats?.['BSC-USD']?.outflow || 0
  const inflow = tokenStats?.['BSC-USD']?.inflow || 0
  return inflow - outflow
}

// 计算积分
const calculatePoints = (tokenStats) => {
  const outflow = tokenStats?.['BSC-USD']?.outflow || 0
  if (outflow <= 0) return 0
  const absoluteLoss = Math.floor(Math.abs(outflow * 2))
  const power = Math.floor(Math.log2(absoluteLoss))
  return Math.max(0, power)
}

// 总盈亏
const totalProfit = computed(() => {
  return last15DaysData.value.reduce((sum, item) => {
    return sum + calculateProfit(item.tokenStats)
  }, 0)
})

// 图表数据
const chartData = computed(() => {
  const volume = []
  const profit = []
  const points = []

  last15DaysData.value.forEach(item => {
    const volumeValue = item.tokenStats?.['BSC-USD']?.outflow || 0
    const profitValue = calculateProfit(item.tokenStats)
    const pointsValue = calculatePoints(item.tokenStats)

    volume.push({ date: item.date, value: volumeValue })
    profit.push({ date: item.date, value: profitValue })
    points.push({ date: item.date, value: pointsValue })
  })

  return { volume, profit, points }
})

// 最大值
const maxValues = computed(() => {
  const volumeMax = Math.max(...chartData.value.volume.map(item => item.value), 1)
  const pointsMax = Math.max(...chartData.value.points.map(item => item.value), 1)

  return {
    volume: volumeMax,
    points: pointsMax
  }
})

// 盈亏最大绝对值
const maxAbsValues = computed(() => {
  const profitValues = chartData.value.profit.map(item => Math.abs(item.value))
  const profitMax = Math.max(...profitValues, 1)

  return {
    profit: profitMax
  }
})

// Y轴刻度
const yAxisTicks = computed(() => {
  const generateTicks = (max, count = 5) => {
    const step = max / count
    return Array.from({ length: count + 1 }, (_, i) => i * step)
  }

  const generateProfitTicks = (maxAbs) => {
    const step = maxAbs / 2
    return [-maxAbs, -step, 0, step, maxAbs]
  }

  return {
    volume: generateTicks(maxValues.value.volume),
    profit: generateProfitTicks(maxAbsValues.value.profit),
    points: generateTicks(maxValues.value.points)
  }
})

// 详细数据（单独排序，使用日期正序）
const detailData = computed(() => {
  // 获取最近15天的数据并按日期正序排列（从旧到新）
  const sortedData = [...bscStore.searchResults].slice(0, 15).sort((a, b) => {
    return new Date(a.date) - new Date(b.date)
  })

  return sortedData.map(item => ({
    date: item.date,
    volume: item.tokenStats?.['BSC-USD']?.outflow || 0,
    profit: calculateProfit(item.tokenStats),
    points: calculatePoints(item.tokenStats)
  }))
})

// 工具函数
const formatNumber = (value) => {
  if (value === undefined || value === null) return '0.00'
  return parseFloat(value).toFixed(2)
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit'
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

/* SVG文本样式 */
.fill-gray-500 {
  fill: #6b7280;
  font-size: 12px;
}

/* 表格样式 */
table {
  border-collapse: collapse;
}

/* 悬停效果 */
.hover\:opacity-80:hover {
  opacity: 0.8;
}

/* 卡片动画 */
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
