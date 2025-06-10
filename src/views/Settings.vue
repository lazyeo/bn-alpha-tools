<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 头部 -->
    <div class="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 px-4 py-6 text-white shadow-lg sticky top-0 z-10">
      <div class="text-center mb-4">
        <h1 class="text-2xl font-bold mb-2">{{ $t('settings.systemSettings') }}</h1>
        <p class="text-blue-100">{{ $t('settings.description') }}</p>
      </div>

      <!-- 设置选项卡 -->
      <div class="bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 mb-4">
        <div class="flex">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            :class="[
              'flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 rounded-lg mx-1 my-1 flex items-center justify-center',
              activeTab === tab.key
                ? 'bg-white/30 text-white shadow-inner'
                : 'text-blue-100 hover:text-white hover:bg-white/10'
            ]"
          >
            <i :class="tab.icon" class="mr-2"></i>
            {{ tab.name }}
          </button>
        </div>
      </div>
    </div>

    <div class="px-4 py-6">
      <!-- API密钥管理 -->
      <div v-show="activeTab === 'api'" class="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
        <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
            <i class="fas fa-key text-white"></i>
          </div>
          {{ $t('settings.apiKeys.title') }}
        </h2>

        <!-- BSCScan API密钥 -->
        <div class="mb-8">
          <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <i class="fas fa-link text-green-600"></i>
            </div>
            {{ $t('settings.apiKeys.bscscan.title') }}
          </h3>
          <div class="space-y-4">
            <div class="flex items-center space-x-4">
              <div class="flex-1">
                <input
                  v-model="bscApiKey"
                  :type="showBscApiKey ? 'text' : 'password'"
                  :placeholder="$t('settings.apiKeys.bscscan.placeholder')"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <button
                @click="showBscApiKey = !showBscApiKey"
                class="px-4 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <i :class="showBscApiKey ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
              <button
                @click="saveBscApiKey"
                class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                {{ $t('settings.apiKeys.bscscan.save') }}
              </button>
              <button
                @click="resetBscApiKey"
                class="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                {{ $t('settings.apiKeys.bscscan.resetToDefault') }}
              </button>
            </div>
            <div class="text-sm text-gray-500 space-y-1 bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div class="flex items-center mb-2">
                <i class="fas fa-info-circle text-blue-600 mr-2"></i>
                <span class="font-medium text-blue-800">使用说明</span>
              </div>
              <p>• {{ $t('settings.apiKeys.bscscan.currentUsing') }}: {{ currentBscApiKey || $t('settings.apiKeys.bscscan.defaultKey') }}</p>
              <p>• {{ $t('settings.apiKeys.bscscan.getFromUrl') }}: <a href="https://bscscan.com/apidashboard" target="_blank" class="text-blue-600 hover:underline">https://bscscan.com/apidashboard</a></p>
              <p>• {{ $t('settings.apiKeys.bscscan.rateLimit') }}</p>
            </div>
          </div>
        </div>

        <!-- CoinMarketCap API密钥 -->
        <div class="mb-8">
          <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <i class="fas fa-chart-bar text-purple-600"></i>
            </div>
            {{ $t('settings.apiKeys.coinmarketcap.title') }}
          </h3>

          <!-- 数据源说明 -->
          <div class="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-4 mb-4">
            <div class="flex items-center mb-2">
              <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <i class="fas fa-info-circle text-white text-sm"></i>
              </div>
              <h4 class="text-sm font-semibold text-blue-800">{{ $t('settings.apiKeys.coinmarketcap.dataSourceTitle') }}</h4>
            </div>
            <p class="text-sm text-blue-700">
              {{ $t('settings.apiKeys.coinmarketcap.dataSourceDesc') }}
            </p>
          </div>

          <div class="space-y-4">
            <div class="flex items-center space-x-4">
              <div class="flex-1">
                <input
                  v-model="cmcApiKey"
                  :type="showCmcApiKey ? 'text' : 'password'"
                  :placeholder="$t('settings.apiKeys.coinmarketcap.placeholder')"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <button
                @click="showCmcApiKey = !showCmcApiKey"
                class="px-4 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <i :class="showCmcApiKey ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
              <button
                @click="saveCmcApiKey"
                class="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                {{ $t('settings.apiKeys.common.save') }}
              </button>
            </div>
            <div class="text-sm text-gray-500 space-y-1 bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div class="flex items-center mb-2">
                <i class="fas fa-info-circle text-purple-600 mr-2"></i>
                <span class="font-medium text-purple-800">使用说明</span>
              </div>
              <p>• {{ $t('settings.apiKeys.coinmarketcap.currentStatus') }}: {{ getApiKeyStatus() }}</p>
              <p>• {{ $t('settings.apiKeys.bscscan.getFromUrl') }}: <a href="https://pro.coinmarketcap.com/account" target="_blank" class="text-purple-600 hover:underline">https://pro.coinmarketcap.com/account</a></p>
              <p>• {{ $t('settings.apiKeys.coinmarketcap.usage') }}</p>
            </div>
          </div>
        </div>

        <!-- CoinGecko API密钥 -->
        <div>
          <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <i class="fas fa-globe text-green-600"></i>
            </div>
            {{ $t('settings.apiKeys.coingecko.title') }}
          </h3>
          <div class="space-y-4">
            <div class="flex items-center space-x-4">
              <div class="flex-1">
                <input
                  v-model="coingeckoApiKey"
                  :type="showCoingeckoApiKey ? 'text' : 'password'"
                  :placeholder="$t('settings.apiKeys.coingecko.placeholder')"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <button
                @click="showCoingeckoApiKey = !showCoingeckoApiKey"
                class="px-4 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <i :class="showCoingeckoApiKey ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
              <button
                @click="saveCoingeckoApiKey"
                class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                {{ $t('settings.apiKeys.common.save') }}
              </button>
            </div>
            <div class="text-sm text-gray-500 space-y-1 bg-green-50 rounded-lg p-4 border border-green-200">
              <div class="flex items-center mb-2">
                <i class="fas fa-info-circle text-green-600 mr-2"></i>
                <span class="font-medium text-green-800">使用说明</span>
              </div>
              <p>• {{ $t('settings.apiKeys.coinmarketcap.currentStatus') }}: {{ getCoingeckoApiKeyStatus() }}</p>
              <p>• {{ $t('settings.apiKeys.bscscan.getFromUrl') }}: <a href="https://www.coingecko.com/en/api/pricing" target="_blank" class="text-green-600 hover:underline">https://www.coingecko.com/en/api/pricing</a></p>
              <p>• {{ $t('settings.apiKeys.coingecko.usage') }}</p>
              <p v-if="coingeckoApiKey" class="text-green-600">
                • {{ $t('settings.apiKeys.coingecko.keyType') }}: {{ getCoingeckoKeyType() }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 钱包管理 -->
      <div v-show="activeTab === 'wallets'" class="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
        <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <div class="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
            <i class="fas fa-wallet text-white"></i>
          </div>
          {{ $t('settings.wallets.title') }}
        </h2>

        <!-- 添加新地址 -->
        <div class="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 mb-6 border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <i class="fas fa-plus text-blue-600"></i>
            </div>
            {{ $t('settings.wallets.addNew') }}
          </h3>
          <div class="space-y-4">
            <div>
              <input
                v-model="newAddress.address"
                :placeholder="$t('settings.wallets.addressPlaceholder')"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <input
                v-model="newAddress.remark"
                :placeholder="$t('settings.wallets.remarkPlaceholder')"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              @click="addAddress"
              :disabled="!newAddress.address || !isValidAddress(newAddress.address)"
              class="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
            >
              <i class="fas fa-plus mr-2"></i>
              {{ $t('settings.wallets.addButton') }}
            </button>
          </div>
        </div>

        <!-- 地址列表 -->
        <div v-if="addresses.length > 0">
          <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <i class="fas fa-list text-green-600"></i>
            </div>
            {{ $t('settings.wallets.savedAddresses') }}
            <span class="ml-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">{{ addresses.length }}{{ $t('common.count') }}</span>
          </h3>
          <div class="space-y-3">
            <div
              v-for="(address, index) in addresses"
              :key="index"
              class="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 border-2 border-gray-200 rounded-xl hover:shadow-md transition-all duration-200"
            >
              <div class="flex-1">
                <div class="font-mono text-sm text-gray-800 bg-white/60 rounded-lg px-3 py-2">{{ address.address }}</div>
                <div v-if="address.remark" class="text-sm text-gray-600 mt-2 font-medium">{{ address.remark }}</div>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click="copyAddress(address.address)"
                  class="px-3 py-2 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 font-medium"
                  :title="$t('common.copy')"
                >
                  <i class="fas fa-copy mr-1"></i>
                  {{ $t('common.copy') }}
                </button>
                <button
                  @click="editAddressModal(index)"
                  class="px-3 py-2 text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-all duration-200 font-medium"
                  :title="$t('settings.wallets.actions.edit')"
                >
                  <i class="fas fa-edit mr-1"></i>
                  {{ $t('settings.wallets.actions.edit') }}
                </button>
                <button
                  @click="deleteAddress(index)"
                  class="px-3 py-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200 font-medium"
                  :title="$t('settings.wallets.actions.delete')"
                >
                  <i class="fas fa-trash mr-1"></i>
                  {{ $t('settings.wallets.actions.delete') }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-12 text-gray-500">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-wallet text-2xl text-gray-400"></i>
          </div>
          <p class="text-lg font-medium">{{ $t('common.noData') }}</p>
          <p class="text-sm">{{ $t('settings.wallets.noAddressesHint') }}</p>
        </div>
      </div>

      <!-- 缓存管理 -->
      <div v-show="activeTab === 'cache'" class="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-800 flex items-center">
            <div class="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center mr-3">
              <i class="fas fa-database text-white"></i>
            </div>
            {{ $t('common.cache') }}{{ $t('common.management') }}
          </h2>
          <button
            @click="refreshCacheStats"
            class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg font-medium"
          >
            <i class="fas fa-sync-alt mr-2"></i>
            {{ $t('common.refreshStatistics') }}
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- 总览 -->
          <div class="bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
            <div class="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-chart-pie text-white text-xl"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-700 mb-2">{{ $t('common.overview') }}</h3>
            <p class="text-3xl font-bold text-teal-600 mb-1">{{ cacheStats.total?.count || 0 }}</p>
            <p class="text-sm text-gray-500 mb-3">{{ $t('common.totalCacheEntries') }}</p>
            <p class="text-2xl font-bold text-teal-600 mb-1">{{ cacheStats.total?.size || '0.00' }} KB</p>
            <p class="text-sm text-gray-500">{{ $t('common.totalSize') }} ({{ $t('common.approximately') }})</p>
          </div>

          <!-- 各类缓存详情 -->
          <div v-for="cache in cacheDetails" :key="cache.key" class="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center mb-4">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                <i class="fas fa-folder text-gray-600"></i>
              </div>
              <h3 class="text-lg font-semibold text-gray-800">{{ cache.name }}</h3>
            </div>
            <div class="space-y-3 mb-6">
              <div class="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2">
                <span class="text-gray-600 font-medium">{{ $t('common.cacheEntries') }}:</span>
                <span class="font-mono font-bold text-gray-800">{{ cacheStats[cache.key]?.count || 0 }}</span>
              </div>
              <div class="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2">
                <span class="text-gray-600 font-medium">{{ $t('common.size') }}:</span>
                <span class="font-mono font-bold text-gray-800">{{ cacheStats[cache.key]?.size || '0.00' }} KB</span>
              </div>
            </div>
            <button
              @click="clearCache(cache.key)"
              class="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg font-medium"
            >
              <i class="fas fa-trash mr-2"></i>
              {{ $t('common.clear') }}{{ cache.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- Alpha代币管理 -->
      <div v-show="activeTab === 'alpha'" class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-800 flex items-center">
            <div class="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center mr-3">
              <i class="fas fa-rocket text-white"></i>
            </div>
            {{ $t('settings.tokens.title') }}
          </h2>
          <div class="flex items-center space-x-4">
             <div class="text-sm text-gray-500 bg-gray-100 rounded-lg px-3 py-2">
              <span v-if="alphaTokenList.length > 0">
                {{ $t('common.total') }} {{ alphaTokenList.length }} {{ $t('common.tokens') }}
              </span>
            </div>
            <button
              @click="refreshAlphaTokens"
              :disabled="loading"
              class="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-all shadow-md hover:shadow-lg font-medium"
            >
              <i :class="loading ? 'fas fa-spinner fa-spin' : 'fas fa-sync-alt'" class="mr-2"></i>
              {{ loading ? $t('common.refreshing') : $t('common.manualRefresh') }}
            </button>
          </div>
        </div>

        <!-- 缓存信息 -->
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
          <div class="flex items-center justify-between">
            <div class="text-sm text-blue-800 flex items-center">
              <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <i class="fas fa-info-circle text-white text-sm"></i>
              </div>
              <p>{{ $t('settings.tokens.lastUpdate') }}: {{ alphaTokensLastUpdated }}</p>
            </div>
            <button
              @click="clearAlphaTokensCache"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg font-medium"
            >
              <i class="fas fa-trash mr-1"></i>
              {{ $t('common.clearCache') }}
            </button>
          </div>
        </div>

        <!-- Alpha代币列表 (Grouped) -->
        <div v-if="Object.keys(groupedAlphaTokenList).length > 0" class="space-y-4">
          <div
            v-for="(tokens, chainName) in groupedAlphaTokenList"
            :key="chainName"
            class="border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              @click="toggleChain(chainName)"
              class="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 cursor-pointer hover:from-gray-100 hover:to-gray-200 transition-all duration-200"
            >
              <h3 class="text-lg font-semibold text-gray-800 flex items-center">
                <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3 shadow-sm">
                  <i :class="getChainIcon(chainName)" class="text-gray-600"></i>
                </div>
                {{ chainName }}
                <span class="text-sm font-normal text-gray-500 ml-2 bg-gray-200 rounded-full px-3 py-1">({{ tokens.length }}{{ $t('common.tokens') }})</span>
              </h3>
              <div class="flex items-center">
                <i
                  :class="expandedChains.includes(chainName) ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"
                  class="text-gray-500 transition-transform duration-200"
                ></i>
              </div>
            </div>

            <div v-show="expandedChains.includes(chainName)" class="divide-y divide-gray-100 bg-white">
              <div
                v-for="token in tokens"
                :key="token.id"
                class="p-4 hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <div class="flex items-center space-x-3">
                      <div>
                        <div class="font-semibold text-gray-800">{{ token.name }}</div>
                        <div class="text-sm text-gray-500">{{ token.symbol }}</div>
                      </div>
                      <div v-if="token.cmc_rank" class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {{ $t('common.rank') }} #{{ token.cmc_rank }}
                      </div>
                    </div>
                    <div class="mt-2 space-y-1">
                      <div class="text-sm text-gray-600">
                        <span class="font-medium">{{ $t('common.contractAddress') }}:</span>
                        <code class="ml-2 bg-gray-100 px-2 py-1 rounded text-xs">{{ token.contractAddress }}</code>
                        <button
                          @click="copyAddress(token.contractAddress)"
                          class="ml-2 text-blue-600 hover:text-blue-800 transition-colors"
                          :title="$t('common.copyContractAddress')"
                        >
                          <i class="fas fa-copy text-xs"></i>
                        </button>
                      </div>
                      <div v-if="token.quote.price" class="text-sm text-gray-600">
                        <span class="font-medium">{{ $t('common.currentPrice') }}:</span>
                        <span class="ml-2">${{ formatPrice(token.quote.price) }}</span>
                        <span
                          v-if="token.quote.percent_change_24h"
                          :class="token.quote.percent_change_24h >= 0 ? 'text-green-600' : 'text-red-600'"
                          class="ml-2 text-xs"
                        >
                          {{ token.quote.percent_change_24h >= 0 ? '+' : '' }}{{ token.quote.percent_change_24h.toFixed(2) }}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else-if="!loading" class="text-center py-12 text-gray-500">
          <i class="fas fa-rocket text-6xl mb-4"></i>
          <h3 class="text-xl font-semibold mb-2">{{ $t('settings.tokens.noTokens') }}</h3>
          <p v-if="!cmcApiKey" class="mb-4">{{ $t('common.configureCmcApiFirst') }}</p>
          <p v-else class="mb-4">{{ $t('settings.tokens.refreshHint') }}</p>
          <button
            v-if="!cmcApiKey"
            @click="activeTab = 'api'"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {{ $t('common.configureApiKey') }}
          </button>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="text-center py-12">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <i class="fas fa-spinner fa-spin text-2xl text-blue-600"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ $t('common.fetchingAlphaTokens') }}</h3>
          <p class="text-gray-600">{{ $t('common.pleaseWait') }}</p>
        </div>
      </div>
    </div>

    <!-- 编辑地址模态框 -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-xl max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">{{ $t('settings.wallets.actions.edit') }}</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('settings.wallets.addressPlaceholder') }}</label>
            <input
              v-model="editingAddress.address"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              readonly
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('settings.wallets.remarkPlaceholder') }}</label>
            <input
              v-model="editingAddress.remark"
              :placeholder="$t('addressManager.remark')"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div class="flex justify-end space-x-3 mt-6">
          <button
            @click="showEditModal = false"
            class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {{ $t('common.cancel') }}
          </button>
          <button
            @click="saveEditedAddress"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {{ $t('common.save') }}
          </button>
        </div>
      </div>
    </div>

    <!-- 消息提示 -->
    <div
      v-if="showMessage"
      :class="[
        'fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300',
        messageType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      ]"
    >
      <i :class="messageType === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'" class="mr-2"></i>
      {{ message }}
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useBscStore } from '@/stores/bsc';
import { useWalletManagement } from '@/composables/useWalletManagement';
import { useApiKeys } from '@/composables/useApiKeys';
import { useCacheManagement } from '@/composables/useCacheManagement';
import { ElMessage } from 'element-plus';

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Settings',
  setup() {
    const { t } = useI18n();
    const bscStore = useBscStore();
    const activeTab = ref('api');

    const tabs = computed(() => [
      { key: 'api', name: t('settings.tabs.api'), icon: 'fas fa-key' },
      { key: 'wallets', name: t('settings.tabs.wallets'), icon: 'fas fa-wallet' },
      { key: 'alpha', name: t('settings.tabs.tokens'), icon: 'fas fa-rocket' },
      { key: 'cache', name: t('common.cache'), icon: 'fas fa-database' },
    ]);

    // Data Source Selection
    // CoinMarketCap API only - no data source switching

    // --- Composables ---
    const { addresses, newAddress, addAddress, editAddress, deleteAddress, copyAddress, isValidAddress } = useWalletManagement();
    const {
      bscApiKey, showBscApiKey, saveBscApiKey, resetBscApiKey,
      cmcApiKey, showCmcApiKey, saveCmcApiKey,
      coingeckoApiKey, showCoingeckoApiKey, saveCoingeckoApiKey
    } = useApiKeys();
    const { cacheStats, refreshCacheStats, clearCacheType, clearAllCaches } = useCacheManagement();

    // --- Modal State ---
    const showEditModal = ref(false);
    const editingAddress = ref({ address: '', remark: '' });
    const editingIndex = ref(-1);
    const showMessage = ref(false);
    const message = ref('');
    const messageType = ref('success');

    // --- Computed Properties ---
    const currentBscApiKey = computed(() => bscStore.apiKeys.bsc);

    const alphaTokenList = computed(() => {
      // Defensive check: If alphaTokens is null or not a Map, return an empty array.
      if (!bscStore.alphaTokens || !(bscStore.alphaTokens instanceof Map)) {
        return [];
      }
      // Transform the map into an array of objects for easier rendering
      return Array.from(bscStore.alphaTokens.entries()).map(([contractAddress, tokenData]) => ({
        ...tokenData,
        contractAddress,
      }));
    });

    const alphaTokensLastUpdated = computed(() => {
      if (bscStore.alphaTokensLastUpdated) {
        return new Date(bscStore.alphaTokensLastUpdated).toLocaleString();
      }
      return '从未';
    });



    // --- New properties and methods for chain grouping ---

    const expandedChains = ref([]);

    const groupedAlphaTokenList = computed(() => {
      if (!bscStore.alphaTokens || !(bscStore.alphaTokens instanceof Map)) {
        return {};
      }

      const grouped = {};

      for (const token of bscStore.alphaTokens.values()) {
        const chainName = token.platform?.name || 'Unknown Chain';
        if (!grouped[chainName]) {
          grouped[chainName] = [];
        }
        grouped[chainName].push({
          ...token,
          contractAddress: token.platform?.token_address || token.contract_address || 'N/A',
        });
      }

      // Set the first chain to be expanded by default
      if (Object.keys(grouped).length > 0 && expandedChains.value.length === 0) {
        expandedChains.value.push(Object.keys(grouped)[0]);
      }

      return grouped;
    });

    const toggleChain = (chainName) => {
      const index = expandedChains.value.indexOf(chainName);
      if (index > -1) {
        expandedChains.value.splice(index, 1);
      } else {
        expandedChains.value.push(chainName);
      }
    };

    const getChainIcon = (chainName) => {
      const name = chainName.toLowerCase();
      if (name.includes('bsc') || name.includes('binance')) return 'fab fa-btc'; // Using btc icon for bnb
      if (name.includes('ethereum')) return 'fab fa-ethereum';
      if (name.includes('polygon')) return 'fas fa-project-diagram';
      if (name.includes('solana')) return 'fas fa-feather-alt';
      if (name.includes('avalanche')) return 'fas fa-snowflake';
      return 'fas fa-link';
    };

    const formatPrice = (price) => {
      if (price === null || price === undefined) return 'N/A';
      return price.toFixed(6).replace(/\.?0+$/, '');
    };



    // --- Cache Details Configuration ---
    const cacheDetails = computed(() => [
      { key: 'alphaTokens', name: t('common.alphaTokensCache') },
      { key: 'transactions', name: t('common.transactionsCache') },
      { key: 'statistics', name: t('common.statisticsCache') },
      { key: 'prices', name: t('common.pricesCache') },
      { key: 'coinIds', name: t('common.coinIdsCache') },
    ]);

    // --- Methods ---
    const refreshAlphaTokens = async () => {
      ElMessage.info('正在刷新Alpha代币列表...');
      await bscStore.fetchAlphaTokens(true);
      if (bscStore.error) {
        ElMessage.error(`刷新失败: ${bscStore.error}`);
      } else {
        ElMessage.success(`成功获取 ${bscStore.alphaTokens?.size || 0} 个Alpha代币`);
      }
    };

    const clearAlphaTokensCache = () => {
      bscStore.clearAlphaTokensCache();
      ElMessage.success('Alpha代币缓存已清除');
    };

    const clearCache = (type) => {
      clearCacheType(type);
      refreshCacheStats();
    };

    // --- Address Modal Methods ---
    const editAddressModal = (index) => {
      editingIndex.value = index;
      editingAddress.value = { ...addresses.value[index] };
      showEditModal.value = true;
    };

    const saveEditedAddress = () => {
      if (editingIndex.value >= 0) {
        addresses.value[editingIndex.value] = { ...editingAddress.value };
        localStorage.setItem('wallet-addresses', JSON.stringify(addresses.value));
        showMessage.value = true;
        message.value = t('common.success');
        messageType.value = 'success';
        setTimeout(() => {
          showMessage.value = false;
        }, 3000);
      }
      showEditModal.value = false;
    };



    // CoinMarketCap API Status
    const getApiKeyStatus = () => {
      return cmcApiKey.value ? t('settings.apiKeys.common.status.configured') : t('settings.apiKeys.common.status.notConfigured');
    };

    // CoinGecko API Key helpers
    const getCoingeckoApiKeyStatus = () => {
      if (!coingeckoApiKey.value) {
        return t('common.notConfiguredUsingFree');
      }
      const keyType = getCoingeckoKeyType();
      return `${t('settings.apiKeys.common.status.configured')} (${keyType})`;
    };

    const getCoingeckoKeyType = () => {
      if (!coingeckoApiKey.value) return '';

      const isDemoKey = coingeckoApiKey.value.toLowerCase().includes('demo') ||
                       (coingeckoApiKey.value.startsWith('CG-') && coingeckoApiKey.value.length < 50);

      return isDemoKey ? t('settings.apiKeys.common.status.demo') : t('settings.apiKeys.common.status.pro');
    };

    // --- Lifecycle Hooks ---
    onMounted(() => {
      refreshCacheStats();
    });

    // Return all reactive properties and methods needed by the template
    return {
      tabs,
      activeTab,
      // API Keys
      bscApiKey,
      showBscApiKey,
      cmcApiKey,
      showCmcApiKey,
      coingeckoApiKey,
      showCoingeckoApiKey,
      currentBscApiKey,
      saveBscApiKey,
      resetBscApiKey,
      saveCmcApiKey,
      saveCoingeckoApiKey,
      // Wallet Management
      addresses,
      newAddress,
      addAddress,
      editAddress,
      deleteAddress,
      copyAddress,
      isValidAddress,
      // Modal State
      showEditModal,
      editingAddress,
      editAddressModal,
      saveEditedAddress,
      showMessage,
      message,
      messageType,
      // Cache Management
      cacheStats,
      cacheDetails,
      refreshCacheStats,
      clearCacheType,
      clearAllCaches,
      // Alpha Tokens
      alphaTokenList,
      alphaTokensLastUpdated,
      refreshAlphaTokens,
      clearAlphaTokensCache,
      clearCache,
      // Other
      loading: computed(() => bscStore.loading),
      error: computed(() => bscStore.error),
      groupedAlphaTokenList,
      expandedChains,
      toggleChain,
      getChainIcon,
      formatPrice,
      // CoinMarketCap API
      getApiKeyStatus,
      // CoinGecko API Key
      getCoingeckoApiKeyStatus,
      getCoingeckoKeyType,
    };
  }
});
</script>

<style scoped>
/* 页面特定样式 */
.bg-gradient-to-br {
  background-size: 200% 200%;
  animation: gradientShift 6s ease infinite;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>
