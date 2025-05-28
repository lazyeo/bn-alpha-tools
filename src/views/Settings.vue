<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 头部 -->
    <div class="bg-white px-4 py-6 pt-12 shadow-sm">
      <div class="flex items-center mb-4">
        <button @click="$router.go(-1)" class="mr-4">
          <i class="fas fa-arrow-left text-gray-600"></i>
        </button>
        <h1 class="text-xl font-bold text-gray-800">设置</h1>
      </div>
    </div>

    <!-- 用户信息 -->
    <div class="px-4 py-4">
      <div class="bg-white rounded-xl p-4 shadow-sm mb-4">
        <div class="flex items-center">
          <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face"
               class="w-12 h-12 rounded-full mr-4">
          <div>
            <h3 class="font-semibold text-gray-800">用户{{ userInfo.id }}</h3>
            <p class="text-sm text-gray-500">积分: {{ userInfo.points.toLocaleString() }} 分</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 设置选项 -->
    <div class="px-4">
      <div class="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
        <div class="px-4 py-3 bg-gray-50 border-b">
          <h3 class="font-semibold text-gray-800">数据设置</h3>
        </div>

        <div class="divide-y divide-gray-100">
          <div class="px-4 py-4 flex items-center justify-between">
            <div class="flex items-center">
              <i class="fas fa-sync text-blue-500 w-8"></i>
              <span class="text-gray-700 ml-2">自动刷新</span>
            </div>
            <ToggleSwitch v-model="settings.autoRefresh" />
          </div>

          <div class="px-4 py-4 flex items-center justify-between">
            <div class="flex items-center">
              <i class="fas fa-bell text-yellow-500 w-8"></i>
              <span class="text-gray-700 ml-2">推送通知</span>
            </div>
            <ToggleSwitch v-model="settings.notifications" />
          </div>

          <div class="px-4 py-4 flex items-center justify-between">
            <div class="flex items-center">
              <i class="fas fa-clock text-green-500 w-8"></i>
              <span class="text-gray-700 ml-2">刷新间隔</span>
            </div>
            <select v-model="settings.refreshInterval" class="bg-gray-100 px-3 py-1 rounded text-sm">
              <option value="30">30秒</option>
              <option value="60">1分钟</option>
              <option value="300">5分钟</option>
            </select>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
        <div class="px-4 py-3 bg-gray-50 border-b">
          <h3 class="font-semibold text-gray-800">显示设置</h3>
        </div>

        <div class="divide-y divide-gray-100">
          <div class="px-4 py-4 flex items-center justify-between">
            <div class="flex items-center">
              <i class="fas fa-eye text-purple-500 w-8"></i>
              <span class="text-gray-700 ml-2">显示详情</span>
            </div>
            <ToggleSwitch v-model="settings.showDetails" />
          </div>

          <div class="px-4 py-4 flex items-center justify-between">
            <div class="flex items-center">
              <i class="fas fa-palette text-pink-500 w-8"></i>
              <span class="text-gray-700 ml-2">主题色彩</span>
            </div>
            <select v-model="settings.theme" class="bg-gray-100 px-3 py-1 rounded text-sm">
              <option value="blue">蓝色</option>
              <option value="green">绿色</option>
              <option value="purple">紫色</option>
            </select>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
        <div class="divide-y divide-gray-100">
          <router-link to="/help" class="px-4 py-4 flex items-center justify-between hover:bg-gray-50">
            <div class="flex items-center">
              <i class="fas fa-question-circle text-blue-500 w-8"></i>
              <span class="text-gray-700 ml-2">帮助与支持</span>
            </div>
            <i class="fas fa-chevron-right text-gray-400"></i>
          </router-link>

          <div class="px-4 py-4 flex items-center justify-between">
            <div class="flex items-center">
              <i class="fas fa-info-circle text-green-500 w-8"></i>
              <span class="text-gray-700 ml-2">关于我们</span>
            </div>
            <span class="text-gray-400 text-sm">v1.0.0</span>
          </div>

          <button @click="clearData" class="w-full px-4 py-4 flex items-center text-left hover:bg-gray-50">
            <i class="fas fa-trash text-red-500 w-8"></i>
            <span class="text-red-500 ml-2">清除数据</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useBscStore } from '@/stores/bsc'
import ToggleSwitch from '@/components/ToggleSwitch.vue'

const bscStore = useBscStore()

// 用户信息
const userInfo = reactive({
  id: '123456',
  points: bscStore.totalPoints || 1234
})

// 设置数据
const settings = reactive({
  autoRefresh: true,
  notifications: false,
  refreshInterval: '30',
  showDetails: true,
  theme: 'blue'
})

// 清除数据
const clearData = () => {
  if (confirm('确定要清除所有数据吗？此操作不可撤销。')) {
    bscStore.clearSearchHistory()
    bscStore.transactionData = []
    bscStore.statistics = {}
    alert('数据已清除')
  }
}
</script>
