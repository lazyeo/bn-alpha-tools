<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 头部 -->
    <div class="bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 px-4 py-6 text-white">
      <div class="mb-4">
        <h1 class="text-2xl font-bold">币安Alpha积分规则</h1>
      </div>
      <p class="text-blue-100">了解币安Alpha计划的积分获取和计算规则</p>
    </div>

    <!-- 积分规则详情 -->
    <div class="px-4 py-4">
      <!-- 概述 -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-info-circle text-blue-500 mr-2"></i>
          积分规则概述
        </h3>
        <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
          <p class="text-sm text-gray-700 leading-relaxed">
            币安Alpha积分系统基于用户的<strong>资产余额</strong>和<strong>交易活动</strong>两个维度进行计算。
            通过持有合格资产和进行Alpha代币交易，用户可以获得相应的积分奖励。
            积分将用于获得Alpha项目的投资优先权和其他专属福利。
          </p>
        </div>
      </div>

      <!-- 余额积分规则 -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-wallet text-blue-500 mr-2"></i>
          余额积分规则
        </h3>

        <div class="bg-blue-50 rounded-lg p-4 mb-4">
          <div class="flex items-start">
            <i class="fas fa-exclamation-triangle text-amber-500 mr-3 mt-1"></i>
            <div>
              <h4 class="font-medium text-gray-800 mb-2">合格资产说明</h4>
              <p class="text-sm text-gray-700 leading-relaxed">
                资产积分包括在币安中心化交易所和币安钱包中持有的总资产。其中，中心化交易所资产仅限于所有账户中已上币安现货的代币以及Alpha账户中的资产；币安钱包资产仅限于Alpha代币和已上币安现货的代币。其他未在Alpha区展示以及未能在币安现货市场上交易的代币，例如LSD代币，均不被视为合格资产。
              </p>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex justify-between items-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                <span class="text-yellow-700 font-bold text-sm">1</span>
              </div>
              <span class="text-sm font-medium text-gray-700">≥$100 &lt;$1,000</span>
            </div>
            <span class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">1积分</span>
          </div>

          <div class="flex justify-between items-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                <span class="text-yellow-700 font-bold text-sm">2</span>
              </div>
              <span class="text-sm font-medium text-gray-700">≥$1,000 &lt;$10,000</span>
            </div>
            <span class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">2积分</span>
          </div>

          <div class="flex justify-between items-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                <span class="text-yellow-700 font-bold text-sm">3</span>
              </div>
              <span class="text-sm font-medium text-gray-700">≥$10,000 &lt;$100,000</span>
            </div>
            <span class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">3积分</span>
          </div>

          <div class="flex justify-between items-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                <span class="text-yellow-700 font-bold text-sm">4</span>
              </div>
              <span class="text-sm font-medium text-gray-700">≥$100,000</span>
            </div>
            <span class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">4积分</span>
          </div>
        </div>
      </div>

      <!-- 交易量积分规则 -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-chart-line text-green-500 mr-2"></i>
          交易量积分规则
        </h3>

        <!-- 限时活动公告 -->
        <div class="bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 border-l-4 border-red-500 rounded-lg p-4 mb-4">
          <div class="flex items-start">
            <i class="fas fa-fire text-red-500 mr-3 mt-1 animate-pulse"></i>
            <div class="flex-1">
              <h4 class="font-medium text-red-800 mb-2 flex items-center">
                🔥 限时活动：BSC链交易双倍积分
                <span class="ml-2 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold">限时</span>
              </h4>
              <p class="text-sm text-red-700 mb-2">
                在BSC链进行Alpha代币交易可获得<strong>双倍交易量积分</strong>（积分+1）！
              </p>
              <a
                href="https://www.binance.com/zh-CN/support/announcement/detail/37f90caac9c24988bbd9ce3595a136a2"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center text-sm text-red-600 hover:text-red-800 font-medium underline transition-colors"
              >
                <i class="fas fa-external-link-alt mr-1"></i>
                查看官方公告
              </a>
            </div>
          </div>
        </div>

        <div class="bg-green-50 rounded-lg p-4 mb-4">
          <div class="flex items-start">
            <i class="fas fa-coins text-green-500 mr-3 mt-1"></i>
            <div>
              <h4 class="font-medium text-gray-800 mb-2">交易量计算方式</h4>
              <p class="text-sm text-gray-700 mb-2">
                你在币安交易所和/或币安Web3钱包上购买的Alpha代币：
              </p>
              <div class="space-y-1">
                <p class="text-sm text-gray-700">• 积分计算公式：floor(log₂(总交易额))</p>
                <p class="text-sm text-gray-700">• 总交易额 = Alpha代币购买金额 + BSC链bonus</p>
                <p class="text-sm text-red-600 font-medium">• BSC链交易：额外+等额bonus（限时活动）</p>
                <p class="text-sm text-gray-500">• 例如：$16 Alpha + $16 BSC bonus = floor(log₂(32)) = 5积分</p>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <span class="text-sm font-medium text-gray-700">$2</span>
            <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">1积分</span>
          </div>

          <div class="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <span class="text-sm font-medium text-gray-700">$4</span>
            <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">2积分</span>
          </div>

          <div class="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <span class="text-sm font-medium text-gray-700">$8</span>
            <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">3积分</span>
          </div>

          <div class="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <span class="text-sm font-medium text-gray-700">$16</span>
            <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">4积分</span>
          </div>

          <div class="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <span class="text-sm font-medium text-gray-700">$32</span>
            <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">5积分</span>
          </div>

          <div class="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <span class="text-sm font-medium text-gray-700">$64</span>
            <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">6积分</span>
          </div>

          <div class="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <span class="text-sm font-medium text-gray-700">$128</span>
            <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">7积分</span>
          </div>

          <div class="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <span class="text-sm font-medium text-gray-700">$256</span>
            <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">8积分</span>
          </div>

          <div class="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <span class="text-sm font-medium text-gray-700">$512</span>
            <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">9积分</span>
          </div>
        </div>

        <div class="text-center py-3 mt-3">
          <span class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">...以此类推，每翻倍增加1分</span>
        </div>
      </div>

      <!-- 积分计算示例 -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-calculator text-purple-500 mr-2"></i>
          积分计算示例
        </h3>

        <div class="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
          <div class="space-y-3">
            <div class="bg-white rounded-lg p-3 border border-purple-200">
              <h4 class="font-medium text-gray-800 mb-2">示例用户A</h4>
              <div class="text-sm text-gray-600 space-y-1">
                <p>• 持有合格资产：$5,000 → <span class="text-blue-600 font-medium">2积分</span></p>
                <p>• Alpha代币购买：$16 (BSC链) → <span class="text-green-600 font-medium">floor(log₂(16+16)) = 5积分</span></p>
                <p class="text-xs text-orange-600">  含BSC bonus: $16</p>
                <p class="border-t pt-2 mt-2">
                  <span class="font-medium text-gray-800">总积分：</span>
                  <span class="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-bold">7积分</span>
                </p>
              </div>
            </div>

            <div class="bg-white rounded-lg p-3 border border-purple-200">
              <h4 class="font-medium text-gray-800 mb-2">示例用户B</h4>
              <div class="text-sm text-gray-600 space-y-1">
                <p>• 持有合格资产：$150,000 → <span class="text-blue-600 font-medium">4积分</span></p>
                <p>• Alpha代币购买：$128 (其他链) → <span class="text-green-600 font-medium">floor(log₂(128)) = 7积分</span></p>
                <p class="text-xs text-gray-500">  无BSC bonus</p>
                <p class="border-t pt-2 mt-2">
                  <span class="font-medium text-gray-800">总积分：</span>
                  <span class="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-bold">11积分</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 重要提醒 -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-exclamation-circle text-red-500 mr-2"></i>
          重要提醒
        </h3>

        <div class="space-y-3">
          <div class="bg-red-50 border border-red-200 rounded-lg p-3">
            <div class="flex items-start">
              <i class="fas fa-clock text-red-500 mr-2 mt-0.5"></i>
              <div>
                <h4 class="font-medium text-red-800 mb-1">积分快照时间</h4>
                <p class="text-sm text-red-700">积分计算基于特定时间点的快照，具体时间以官方公告为准。</p>
              </div>
            </div>
          </div>

          <div class="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div class="flex items-start">
              <i class="fas fa-shield-alt text-amber-500 mr-2 mt-0.5"></i>
              <div>
                <h4 class="font-medium text-amber-800 mb-1">资产安全</h4>
                <p class="text-sm text-amber-700">请确保在官方平台进行交易，谨防钓鱼网站和诈骗行为。</p>
              </div>
            </div>
          </div>

          <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div class="flex items-start">
              <i class="fas fa-info-circle text-blue-500 mr-2 mt-0.5"></i>
              <div>
                <h4 class="font-medium text-blue-800 mb-1">规则更新</h4>
                <p class="text-sm text-blue-700">币安保留随时调整积分规则的权利，请关注官方最新公告。</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 相关链接 -->
      <div class="bg-white rounded-xl shadow-sm p-4">
        <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-external-link-alt text-gray-500 mr-2"></i>
          相关链接
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a href="https://www.binance.com/zh-CN/alpha" target="_blank" class="block bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-3 border border-yellow-200 hover:shadow-md transition-shadow">
            <div class="flex items-center">
              <i class="fab fa-ethereum text-yellow-600 mr-3"></i>
              <div>
                <h4 class="font-medium text-gray-800 text-sm">币安Alpha项目</h4>
                <p class="text-xs text-gray-600">访问官方Alpha页面</p>
              </div>
            </div>
          </a>

          <a href="https://www.binance.com/zh-CN/web3wallet" target="_blank" class="block bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-3 border border-blue-200 hover:shadow-md transition-shadow">
            <div class="flex items-center">
              <i class="fas fa-wallet text-blue-600 mr-3"></i>
              <div>
                <h4 class="font-medium text-gray-800 text-sm">币安Web3钱包</h4>
                <p class="text-xs text-gray-600">下载和使用钱包</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 定义组件名
defineOptions({
  name: 'AlphaPointsRulesPage'
})

// Alpha积分规则页面主要是静态内容展示
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
</style>
