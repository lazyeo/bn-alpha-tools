<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- 头部 -->
    <div class="bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 px-4 py-6 pt-12 text-white">
      <div class="flex items-center mb-4">
        <button @click="$router.go(-1)" class="mr-4">
          <i class="fas fa-arrow-left text-white"></i>
        </button>
        <h1 class="text-2xl font-bold">使用帮助</h1>
      </div>
      <p class="text-blue-100">BSC交易查询工具使用指南</p>
    </div>

    <!-- 功能介绍 -->
    <div class="px-4 py-4">
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-star text-yellow-500 mr-2"></i>
          主要功能
        </h3>
        <div class="space-y-3">
          <div class="flex items-start">
            <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
              <i class="fas fa-search text-blue-500 text-sm"></i>
            </div>
            <div>
              <h4 class="font-medium text-gray-800">地址查询</h4>
              <p class="text-sm text-gray-600">输入BSC钱包地址，查看详细的交易历史记录</p>
            </div>
          </div>

          <div class="flex items-start">
            <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
              <i class="fas fa-chart-bar text-green-500 text-sm"></i>
            </div>
            <div>
              <h4 class="font-medium text-gray-800">数据统计</h4>
              <p class="text-sm text-gray-600">多维度的交易数据分析和可视化图表</p>
            </div>
          </div>

          <div class="flex items-start">
            <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-1">
              <i class="fas fa-history text-purple-500 text-sm"></i>
            </div>
            <div>
              <h4 class="font-medium text-gray-800">历史记录</h4>
              <p class="text-sm text-gray-600">自动保存查询历史，便于重复使用</p>
            </div>
          </div>

          <div class="flex items-start">
            <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3 mt-1">
              <i class="fas fa-fire text-red-500 text-sm"></i>
            </div>
            <div>
              <h4 class="font-medium text-gray-800">磨损分析</h4>
              <p class="text-sm text-gray-600">计算交易磨损和效率比率</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 使用步骤 -->
    <div class="px-4 mb-4">
      <div class="bg-white rounded-xl shadow-sm p-4">
        <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-list-ol text-blue-500 mr-2"></i>
          使用步骤
        </h3>
        <div class="space-y-4">
          <div class="flex items-start">
            <div class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">
              1
            </div>
            <div>
              <h4 class="font-medium text-gray-800">输入BSC地址</h4>
              <p class="text-sm text-gray-600">在首页输入框中输入有效的BSC钱包地址（0x开头的40位字符）</p>
            </div>
          </div>

          <div class="flex items-start">
            <div class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">
              2
            </div>
            <div>
              <h4 class="font-medium text-gray-800">查看交易数据</h4>
              <p class="text-sm text-gray-600">系统将显示该地址的交易历史，包括交易量、积分等信息</p>
            </div>
          </div>

          <div class="flex items-start">
            <div class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">
              3
            </div>
            <div>
              <h4 class="font-medium text-gray-800">查看详情</h4>
              <p class="text-sm text-gray-600">点击任意交易记录可查看该日的详细交易分布和类型</p>
            </div>
          </div>

          <div class="flex items-start">
            <div class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">
              4
            </div>
            <div>
              <h4 class="font-medium text-gray-800">数据分析</h4>
              <p class="text-sm text-gray-600">访问统计页面查看趋势图表和多维度数据分析</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 常见问题 -->
    <div class="px-4 mb-4">
      <div class="bg-white rounded-xl shadow-sm p-4">
        <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-question-circle text-orange-500 mr-2"></i>
          常见问题
        </h3>
        <div class="space-y-4">
          <div>
            <h4 class="font-medium text-gray-800 mb-2">Q: 什么是BSC地址？</h4>
            <p class="text-sm text-gray-600 pl-4 border-l-2 border-gray-200">
              BSC（币安智能链）地址是以0x开头的40位十六进制字符串，用于标识区块链上的钱包账户。
            </p>
          </div>

          <div>
            <h4 class="font-medium text-gray-800 mb-2">Q: 数据更新频率是多少？</h4>
            <p class="text-sm text-gray-600 pl-4 border-l-2 border-gray-200">
              当前版本使用模拟数据进行演示，实际部署时可以连接真实的BSC区块链数据源。
            </p>
          </div>

          <div>
            <h4 class="font-medium text-gray-800 mb-2">Q: 如何理解磨损金额？</h4>
            <p class="text-sm text-gray-600 pl-4 border-l-2 border-gray-200">
              磨损金额指交易过程中产生的Gas费用和滑点损失，帮助用户了解交易成本。
            </p>
          </div>

          <div>
            <h4 class="font-medium text-gray-800 mb-2">Q: 积分如何计算？</h4>
            <p class="text-sm text-gray-600 pl-4 border-l-2 border-gray-200">
              积分基于交易频率和交易量计算，公式为：交易笔数 × 2.5 + 交易量 × 0.05。
            </p>
          </div>

          <div>
            <h4 class="font-medium text-gray-800 mb-2">Q: 历史记录如何管理？</h4>
            <p class="text-sm text-gray-600 pl-4 border-l-2 border-gray-200">
              系统自动保存最近10条查询记录到本地存储，可在设置中清除所有数据。
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 技术说明 -->
    <div class="px-4 mb-4">
      <div class="bg-white rounded-xl shadow-sm p-4">
        <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-cogs text-gray-500 mr-2"></i>
          技术说明
        </h3>
        <div class="text-sm text-gray-600 space-y-2">
          <p>• 前端技术：Vue 3 + Vite + TailwindCSS</p>
          <p>• 状态管理：Pinia</p>
          <p>• 数据存储：LocalStorage</p>
          <p>• 图表渲染：原生SVG</p>
          <p>• 响应式设计：适配移动端和桌面端</p>
        </div>
      </div>
    </div>

    <!-- 联系方式 -->
    <div class="px-4 mb-4">
      <div class="bg-white rounded-xl shadow-sm p-4">
        <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-envelope text-blue-500 mr-2"></i>
          联系我们
        </h3>
        <div class="space-y-3">
          <div class="flex items-center">
            <i class="fas fa-at text-gray-400 w-6"></i>
            <span class="text-sm text-gray-600">support@bsc-tool.com</span>
          </div>
          <div class="flex items-center">
            <i class="fab fa-github text-gray-400 w-6"></i>
            <span class="text-sm text-gray-600">github.com/bsc-trading-tool</span>
          </div>
          <div class="flex items-center">
            <i class="fas fa-globe text-gray-400 w-6"></i>
            <span class="text-sm text-gray-600">www.bsc-tool.com</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 版本信息 -->
    <div class="px-4 mb-4">
      <div class="bg-gray-100 rounded-xl p-4 text-center">
        <div class="text-sm text-gray-500">
          <p>BSC交易查询工具</p>
          <p>版本 v1.0.0</p>
          <p class="mt-2">© 2024 All Rights Reserved</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 帮助页面不需要复杂的响应式逻辑，主要是静态内容展示
</script>

<style scoped>
/* 优化阅读体验 */
h4 {
  line-height: 1.4;
}

p {
  line-height: 1.6;
}

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
</style>
