<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 头部 -->
    <div class="bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 px-4 py-6 text-white">
      <div class="mb-4">
        <h1 class="text-2xl font-bold flex items-center">
          <i class="fas fa-gift mr-2"></i>
          空投预告
        </h1>
      </div>
      <p class="text-purple-100">精彩空投活动即将上线，敬请期待！</p>
    </div>

    <!-- 主要内容 -->
    <div class="px-4 py-4">
      <!-- 敬请期待主要内容 -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-4">
        <div class="text-center">
          <!-- 主要图标 -->
          <div class="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <i class="fas fa-rocket text-white text-4xl"></i>
          </div>

          <!-- 主标题 -->
          <h2 class="text-2xl font-bold text-gray-800 mb-4">敬请期待</h2>

          <!-- 副标题 -->
          <p class="text-lg text-gray-600 mb-6">精彩的空投活动正在筹备中...</p>

          <!-- 详细说明 -->
          <div class="max-w-md mx-auto">
            <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200 mb-6">
              <div class="text-center space-y-3">
                <div class="text-3xl">🎁</div>
                <h3 class="font-medium text-gray-800">即将到来的惊喜</h3>
                <div class="text-sm text-gray-700 space-y-2">
                  <p>我们正在精心策划各种空投活动</p>
                  <p>为社区用户准备丰厚奖励</p>
                  <p>请持续关注最新动态</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 动态加载动画 -->
          <div class="flex justify-center items-center space-x-2 mb-6">
            <div class="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
            <div class="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
            <div class="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
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
