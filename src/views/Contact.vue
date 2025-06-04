<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 头部 -->
    <div class="bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 px-4 py-6 text-white">
      <div class="mb-4">
        <h1 class="text-2xl font-bold">联系我们</h1>
      </div>
      <p class="text-blue-100">与我们取得联系，获得技术支持或提供反馈建议</p>
    </div>

    <!-- 联系方式详情 -->
    <div class="px-4 py-4">
      <!-- 主要联系方式 -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-address-book text-blue-500 mr-2"></i>
          主要联系方式
        </h3>

        <div class="space-y-4">
          <!-- 邮箱联系 -->
          <div class="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4 border border-red-200">
            <div class="flex items-start">
              <div class="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center mr-4">
                <i class="fas fa-envelope text-white text-xl"></i>
              </div>
              <div class="flex-1">
                <h4 class="font-medium text-gray-800 mb-2">邮箱联系</h4>
                <p class="text-sm text-gray-600 mb-3">
                  直接发送邮件与我们取得联系，获得技术支持
                </p>
                <a
                  href="mailto:songsongqaq@gmail.com"
                  class="inline-flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  <i class="fas fa-envelope mr-2"></i>
                  发送邮件
                  <i class="fas fa-external-link-alt ml-2 text-xs"></i>
                </a>
              </div>
            </div>
          </div>

          <!-- GitHub -->
          <div class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
            <div class="flex items-start">
              <div class="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mr-4">
                <i class="fab fa-github text-white text-xl"></i>
              </div>
              <div class="flex-1">
                <h4 class="font-medium text-gray-800 mb-2">GitHub 项目仓库</h4>
                <p class="text-sm text-gray-600 mb-3">
                  查看源码、提交问题、参与项目贡献
                </p>
                <a
                  href="https://github.com/songsongQAQ/bn-alpha-tools"
                  target="_blank"
                  class="inline-flex items-center bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  <i class="fab fa-github mr-2"></i>
                  访问 GitHub
                  <i class="fas fa-external-link-alt ml-2 text-xs"></i>
                </a>
              </div>
            </div>
          </div>

          <!-- X平台 -->
          <div class="bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg p-4 border border-blue-200">
            <div class="flex items-start">
              <div class="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mr-4">
                <i class="fab fa-x-twitter text-white text-xl"></i>
              </div>
              <div class="flex-1">
                <h4 class="font-medium text-gray-800 mb-2">X 平台</h4>
                <p class="text-sm text-gray-600 mb-3">
                  关注最新动态、产品更新和技术分享
                </p>
                <a
                  href="https://x.com/tiantongqaq"
                  target="_blank"
                  class="inline-flex items-center bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  <i class="fab fa-x-twitter mr-2"></i>
                  关注我们
                  <i class="fas fa-external-link-alt ml-2 text-xs"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 反馈与建议 -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-comments text-green-500 mr-2"></i>
          反馈与建议
        </h3>

        <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
          <div class="space-y-4">
            <div class="flex items-start">
              <i class="fas fa-lightbulb text-green-500 mr-3 mt-1"></i>
              <div>
                <h4 class="font-medium text-gray-800 mb-2">我们期待您的意见</h4>
                <div class="text-sm text-gray-700 space-y-2">
                  <p>• <strong>功能建议</strong>：希望增加什么新功能？</p>
                  <p>• <strong>用户体验</strong>：哪些地方可以改进？</p>
                  <p>• <strong>技术问题</strong>：遇到了什么bug或错误？</p>
                  <p>• <strong>界面设计</strong>：有什么设计建议？</p>
                </div>
              </div>
            </div>

            <div class="flex flex-wrap gap-3">
              <a
                href="https://github.com/songsongQAQ/bn-alpha-tools/issues"
                target="_blank"
                class="inline-flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                <i class="fas fa-bug mr-2"></i>
                提交问题
              </a>
              <a
                href="https://github.com/songsongQAQ/bn-alpha-tools/discussions"
                target="_blank"
                class="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                <i class="fas fa-comments mr-2"></i>
                参与讨论
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- 技术支持 -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-tools text-purple-500 mr-2"></i>
          技术支持
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-200">
            <div class="flex items-start">
              <i class="fas fa-question-circle text-purple-500 mr-3 mt-1"></i>
              <div>
                <h4 class="font-medium text-gray-800 mb-2">常见问题</h4>
                <p class="text-sm text-gray-600 mb-3">
                  查看使用指南和常见问题解答
                </p>
                <router-link
                  to="/help"
                  class="inline-flex items-center bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  <i class="fas fa-book mr-2"></i>
                  查看帮助
                </router-link>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
            <div class="flex items-start">
              <i class="fas fa-code text-orange-500 mr-3 mt-1"></i>
              <div>
                <h4 class="font-medium text-gray-800 mb-2">技术文档</h4>
                <p class="text-sm text-gray-600 mb-3">
                  了解项目架构和开发说明
                </p>
                <a
                  href="https://github.com/songsongQAQ/bn-alpha-tools/wiki"
                  target="_blank"
                  class="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  <i class="fas fa-file-code mr-2"></i>
                  查看文档
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 开发团队 -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-users text-indigo-500 mr-2"></i>
          开发团队
        </h3>

        <div class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
          <div class="flex items-start">
            <div class="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
              <i class="fas fa-user-tie text-white text-xl"></i>
            </div>
            <div class="flex-1">
              <h4 class="font-medium text-gray-800 mb-2">项目负责人</h4>
              <div class="text-sm text-gray-600 space-y-1">
                <p><strong>开发者</strong>：songsongQAQ</p>
                <p><strong>邮箱</strong>：songsongqaq@gmail.com</p>
                <p><strong>专业领域</strong>：Web3 前端开发、区块链数据分析</p>
                <p><strong>技术栈</strong>：Vue.js、React、Node.js、Solidity</p>
                <p><strong>经验</strong>：5年+ Web开发经验，2年+ Web3开发经验</p>
              </div>
              <div class="flex items-center mt-3 space-x-3">
                <a
                  href="mailto:songsongqaq@gmail.com"
                  class="text-gray-700 hover:text-gray-900 transition-colors"
                  title="发送邮件"
                >
                  <i class="fas fa-envelope text-lg"></i>
                </a>
                <a
                  href="https://x.com/tiantongqaq"
                  target="_blank"
                  class="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <i class="fab fa-x-twitter text-lg"></i>
                </a>
                <a
                  href="https://github.com/songsongQAQ"
                  target="_blank"
                  class="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <i class="fab fa-github text-lg"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 项目信息 -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-info-circle text-blue-500 mr-2"></i>
          项目信息
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-3">
            <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span class="text-sm font-medium text-gray-700">当前版本</span>
              <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">v1.0.0</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span class="text-sm font-medium text-gray-700">开发语言</span>
              <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Vue.js</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span class="text-sm font-medium text-gray-700">许可证</span>
              <span class="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">MIT</span>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span class="text-sm font-medium text-gray-700">最后更新</span>
              <span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">2025-06-04</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span class="text-sm font-medium text-gray-700">项目状态</span>
              <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">活跃开发</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span class="text-sm font-medium text-gray-700">支持平台</span>
              <span class="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium">Web</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 免责声明 -->
      <div class="bg-white rounded-xl shadow-sm p-4">
        <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-shield-alt text-amber-500 mr-2"></i>
          免责声明
        </h3>

        <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div class="space-y-3 text-sm text-gray-700">
            <p>
              <strong>• 数据准确性：</strong>本工具提供的数据仅供参考，请以官方数据为准。
            </p>
            <p>
              <strong>• 投资风险：</strong>区块链投资存在风险，请谨慎决策，本工具不构成投资建议。
            </p>
            <p>
              <strong>• 安全提醒：</strong>请确保在官方平台进行交易，谨防钓鱼网站和诈骗行为。
            </p>
            <p>
              <strong>• 服务变更：</strong>我们保留随时调整或终止服务的权利，恕不另行通知。
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 定义组件名
defineOptions({
  name: 'ContactPage'
})

// 联系页面主要是静态内容展示
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

/* 卡片悬停效果 */
.hover\:shadow-md:hover {
  transform: translateY(-1px);
}

/* 链接悬停效果 */
a {
  transition: all 0.2s ease-in-out;
}

/* 社交链接特殊效果 */
.fab {
  transition: transform 0.2s ease-in-out;
}

.fab:hover {
  transform: scale(1.1);
}
</style>
