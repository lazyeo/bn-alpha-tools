<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="text-center px-4">
      <!-- 404图标 -->
      <div class="mb-8">
        <i class="fas fa-search text-6xl text-gray-300"></i>
      </div>

      <!-- 错误信息 -->
      <h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 class="text-2xl font-semibold text-gray-600 mb-4">页面未找到</h2>
      <p class="text-gray-500 mb-8 max-w-md mx-auto">
        抱歉，您访问的页面不存在。可能是地址输入错误或页面已被移除。
      </p>

      <!-- 操作按钮 -->
      <div class="space-y-4">
        <router-link
          to="/"
          class="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
        >
          <i class="fas fa-home mr-2"></i>
          回到首页
        </router-link>

        <div class="text-center">
          <button
            @click="$router.go(-1)"
            class="text-gray-500 hover:text-blue-500 transition-colors"
          >
            <i class="fas fa-arrow-left mr-1"></i>
            返回上一页
          </button>
        </div>
      </div>

      <!-- 建议链接 -->
      <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-lg mx-auto">
        <router-link
          to="/"
          class="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all text-center"
        >
          <i class="fas fa-search text-blue-500 text-xl mb-2"></i>
          <p class="text-sm font-medium text-gray-800">地址查询</p>
        </router-link>

        <router-link
          to="/statistics"
          class="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all text-center"
        >
          <i class="fas fa-chart-bar text-green-500 text-xl mb-2"></i>
          <p class="text-sm font-medium text-gray-800">数据统计</p>
        </router-link>

        <router-link
          to="/help"
          class="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all text-center"
        >
          <i class="fas fa-question-circle text-orange-500 text-xl mb-2"></i>
          <p class="text-sm font-medium text-gray-800">使用帮助</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// 404页面不需要复杂逻辑
</script>

<style scoped>
/* 渐入动画 */
.text-center {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 悬停效果 */
.block:hover {
  transform: translateY(-2px);
}
</style>
