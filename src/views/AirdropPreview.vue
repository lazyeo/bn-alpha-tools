<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 头部 -->
    <div class="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 px-4 py-6 text-white">
      <div class="mb-4">
        <h1 class="text-2xl font-bold flex items-center">
          <i class="fas fa-gift mr-2"></i>
          空投预告
        </h1>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="px-4 py-4">
      <!-- 动态空投列表 -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-4">
        <div v-if="loading" class="flex flex-col items-center justify-center py-8">
          <div class="flex justify-center items-center space-x-2 mb-4">
            <div class="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
            <div class="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
            <div class="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
          </div>
          <div class="text-gray-500">正在加载空投活动...</div>
        </div>
        <div v-else-if="error" class="text-center text-red-500 py-8">
          <i class="fas fa-exclamation-triangle mr-2"></i>{{ error }}
        </div>
        <div v-else-if="airdropList.length === 0" class="text-center text-gray-500 py-8">
          <i class="fas fa-rocket mr-2"></i>暂无空投活动，敬请期待！
        </div>
        <div v-else>
          <h2 class="text-xl font-bold text-gray-800 mb-4 text-center">即将上线的空投活动</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full bg-white rounded-lg shadow-sm">
              <thead>
                <tr class="bg-gradient-to-r from-purple-100 to-pink-100">
                  <th class="px-4 py-2 text-left text-gray-700 font-semibold">日期</th>
                  <th class="px-4 py-2 text-left text-gray-700 font-semibold">币种</th>
                  <th class="px-4 py-2 text-left text-gray-700 font-semibold">积分门槛</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in airdropList" :key="item.id" class="border-b border-purple-50 hover:bg-purple-50">
                  <td class="px-4 py-2">{{ formatDate(item.date) }}</td>
                  <td class="px-4 py-2">{{ item.name }}</td>
                  <td class="px-4 py-2">
                    <span v-if="item.points !== null && item.points !== undefined">{{ item.points }}</span>
                    <span v-else>暂未公布</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 预期功能介绍 -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-star text-yellow-500 mr-2"></i>
          预期功能
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <h4 class="font-medium text-gray-800 mb-2 flex items-center">
              <i class="fas fa-coins text-yellow-500 mr-2"></i>
              代币空投
            </h4>
            <p class="text-sm text-gray-600">优质项目代币空投活动</p>
          </div>
          <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <h4 class="font-medium text-gray-800 mb-2 flex items-center">
              <i class="fas fa-trophy text-green-500 mr-2"></i>
              奖励活动
            </h4>
            <p class="text-sm text-gray-600">社区互动奖励机制</p>
          </div>
          <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
            <h4 class="font-medium text-gray-800 mb-2 flex items-center">
              <i class="fas fa-users text-purple-500 mr-2"></i>
              社区福利
            </h4>
            <p class="text-sm text-gray-600">专属社区成员福利</p>
          </div>
          <div class="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
            <h4 class="font-medium text-gray-800 mb-2 flex items-center">
              <i class="fas fa-calendar text-orange-500 mr-2"></i>
              定期活动
            </h4>
            <p class="text-sm text-gray-600">定期举办空投活动</p>
          </div>
        </div>
      </div>

      <!-- 关注提醒 -->
      <div class="bg-white rounded-xl shadow-sm p-4">
        <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-bell text-blue-500 mr-2"></i>
          关注提醒
        </h3>
        <div class="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
          <div class="text-center space-y-3">
            <div class="text-2xl">🔔</div>
            <h4 class="font-medium text-gray-800">不要错过精彩活动！</h4>
            <div class="text-sm text-gray-700 space-y-2">
              <p>• 关注我们的社交媒体获取最新消息</p>
              <p>• 定期检查本页面了解活动进展</p>
              <p>• 保持BSC地址钱包活跃度</p>
              <p>• 积极使用平台功能提升参与资格</p>
            </div>
          </div>
        </div>
        <div class="mt-4 text-center">
          <p class="text-xs text-gray-500">
            空投活动详情将在合适时机公布 ✨
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 响应式状态
const airdropList = ref([])
const loading = ref(true)
const error = ref('')

// 时间戳格式化函数
function formatDate(ts) {
  if (!ts) return '-'
  const d = new Date(Number(ts))
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
}

// 获取空投活动数据
async function fetchAirdropList() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch('http://api.soouu.com/bn-alpha-airdrop/list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({}) // 如有参数可在此处填写
    })
    const json = await res.json()
    if (json.code === 0 && Array.isArray(json.data)) {
      airdropList.value = json.data
    } else {
      error.value = json.message || '数据格式异常'
    }
  } catch {
    error.value = '数据加载失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

onMounted(fetchAirdropList)

// 定义组件名
defineOptions({
  name: 'AirdropPreview'
})
</script>

<style scoped>
/* 渐变背景动画 */
.bg-gradient-to-br {
  background-size: 200% 200%;
  animation: gradientShift 8s ease infinite;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* 渐变卡片动画 */
.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradientFloat 6s ease-in-out infinite;
}

@keyframes gradientFloat {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* 卡片悬停效果 */
.bg-white:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 字体平滑 */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 动画延迟 */
.animate-bounce:nth-child(2) {
  animation-delay: 0.1s;
}

.animate-bounce:nth-child(3) {
  animation-delay: 0.2s;
}
</style>
