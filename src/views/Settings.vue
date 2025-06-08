<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
    <div class="max-w-6xl mx-auto">
      <!-- 页面标题 -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">系统设置</h1>
        <p class="text-gray-600">管理API密钥、钱包地址和Alpha代币列表</p>
      </div>

      <!-- 设置选项卡 -->
      <div class="bg-white rounded-xl shadow-lg mb-6">
        <div class="flex border-b">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            :class="[
              'px-6 py-4 text-sm font-medium transition-colors duration-200',
              activeTab === tab.key
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            ]"
          >
            <i :class="tab.icon" class="mr-2"></i>
            {{ tab.name }}
          </button>
        </div>
      </div>

      <!-- API密钥管理 -->
      <div v-show="activeTab === 'api'" class="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">
          <i class="fas fa-key text-blue-600 mr-2"></i>
          API密钥管理
        </h2>

        <!-- BSCScan API密钥 -->
        <div class="mb-8">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">BSCScan API密钥</h3>
          <div class="space-y-4">
            <div class="flex items-center space-x-4">
              <div class="flex-1">
                <input
                  v-model="bscApiKey"
                  :type="showBscApiKey ? 'text' : 'password'"
                  placeholder="请输入BSCScan API密钥"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                保存
              </button>
              <button
                @click="resetBscApiKey"
                class="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                重置默认
              </button>
            </div>
            <div class="text-sm text-gray-500 space-y-1">
              <p>• 当前使用: {{ currentBscApiKey || '默认密钥' }}</p>
              <p>• 获取地址: <a href="https://bscscan.com/apis" target="_blank" class="text-blue-600 hover:underline">https://bscscan.com/apis</a></p>
              <p>• 免费用户每秒5次请求，每天100,000次请求</p>
            </div>
          </div>
        </div>

        <!-- CoinMarketCap API密钥 -->
        <div class="mb-8">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">CoinMarketCap API密钥</h3>
          <div class="space-y-4">
            <div class="flex items-center space-x-4">
              <div class="flex-1">
                <input
                  v-model="cmcApiKey"
                  :type="showCmcApiKey ? 'text' : 'password'"
                  placeholder="请输入CoinMarketCap API密钥"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                保存
              </button>
            </div>
            <div class="text-sm text-gray-500 space-y-1">
              <p>• 当前状态: {{ cmcApiKey ? '已设置' : '未设置' }}</p>
              <p>• 获取地址: <a href="https://pro.coinmarketcap.com/account" target="_blank" class="text-blue-600 hover:underline">https://pro.coinmarketcap.com/account</a></p>
              <p>• 用于获取Binance Alpha代币列表</p>
            </div>
          </div>
        </div>

        <!-- CoinGecko API密钥 -->
        <div>
          <h3 class="text-lg font-semibold text-gray-700 mb-4">CoinGecko API密钥 (可选)</h3>
          <div class="space-y-4">
            <div class="flex items-center space-x-4">
              <div class="flex-1">
                <input
                  v-model="coingeckoApiKey"
                  :type="showCoingeckoApiKey ? 'text' : 'password'"
                  placeholder="请输入CoinGecko API密钥 (可选，用于提高请求限制)"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                保存
              </button>
            </div>
            <div class="text-sm text-gray-500 space-y-1">
              <p>• 当前状态: {{ coingeckoApiKey ? '已设置' : '未设置（使用免费接口）' }}</p>
              <p>• 获取地址: <a href="https://www.coingecko.com/en/api/pricing" target="_blank" class="text-blue-600 hover:underline">https://www.coingecko.com/en/api/pricing</a></p>
              <p>• 用于获取历史价格数据，可选配置</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 钱包管理 -->
      <div v-show="activeTab === 'wallets'" class="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">
          <i class="fas fa-wallet text-green-600 mr-2"></i>
          钱包地址管理
        </h2>

        <!-- 添加新地址 -->
        <div class="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">添加新地址</h3>
          <div class="space-y-4">
            <div>
              <input
                v-model="newAddress.address"
                placeholder="BSC钱包地址 (0x...)"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <input
                v-model="newAddress.remark"
                placeholder="备注 (可选)"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              @click="addAddress"
              :disabled="!newAddress.address || !isValidAddress(newAddress.address)"
              class="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              添加地址
            </button>
          </div>
        </div>

        <!-- 地址列表 -->
        <div v-if="addresses.length > 0">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">已保存的地址 ({{ addresses.length }}个)</h3>
          <div class="space-y-3">
            <div
              v-for="(address, index) in addresses"
              :key="index"
              class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div class="flex-1">
                <div class="font-mono text-sm text-gray-800">{{ address.address }}</div>
                <div v-if="address.remark" class="text-sm text-gray-600 mt-1">{{ address.remark }}</div>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click="copyAddress(address.address)"
                  class="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="复制地址"
                >
                  <i class="fas fa-copy"></i>
                </button>
                <button
                  @click="editAddress(index)"
                  class="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="编辑"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  @click="deleteAddress(index)"
                  class="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="删除"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-500">
          <i class="fas fa-wallet text-4xl mb-4"></i>
          <p>还没有保存任何钱包地址</p>
        </div>
      </div>

      <!-- 缓存管理 -->
      <div v-show="activeTab === 'cache'" class="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-800">
            <i class="fas fa-database text-teal-600 mr-2"></i>
            缓存管理
          </h2>
          <button
            @click="refreshCacheStats"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i class="fas fa-sync-alt mr-2"></i>
            刷新统计
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- 总览 -->
          <div class="bg-gray-50 rounded-lg p-6 text-center">
            <h3 class="text-lg font-semibold text-gray-700">总览</h3>
            <p class="text-3xl font-bold text-teal-600 mt-2">{{ cacheStats.total?.count || 0 }}</p>
            <p class="text-sm text-gray-500">总缓存条目</p>
            <p class="text-2xl font-bold text-teal-600 mt-4">{{ cacheStats.total?.size || '0.00' }} KB</p>
            <p class="text-sm text-gray-500">总占用空间 (约)</p>
          </div>

          <!-- 各类缓存详情 -->
          <div v-for="cache in cacheDetails" :key="cache.key" class="bg-white border border-gray-200 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">{{ cache.name }}</h3>
            <div class="flex justify-between items-center mb-2">
              <span class="text-gray-600">缓存条目:</span>
              <span class="font-mono font-semibold text-gray-800">{{ cacheStats[cache.key]?.count || 0 }}</span>
            </div>
            <div class="flex justify-between items-center mb-6">
              <span class="text-gray-600">占用空间:</span>
              <span class="font-mono font-semibold text-gray-800">{{ cacheStats[cache.key]?.size || '0.00' }} KB</span>
            </div>
            <button
              @click="clearCache(cache.key)"
              class="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <i class="fas fa-trash mr-2"></i>
              清空{{ cache.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- Alpha代币管理 -->
      <div v-show="activeTab === 'alpha'" class="bg-white rounded-xl shadow-lg p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-800">
            <i class="fas fa-rocket text-yellow-600 mr-2"></i>
            Alpha代币管理
          </h2>
          <div class="flex items-center space-x-4">
             <div class="text-sm text-gray-500">
              <span v-if="alphaTokenList.length > 0">
                共 {{ alphaTokenList.length }} 个代币
              </span>
            </div>
            <button
              @click="refreshAlphaTokens"
              :disabled="loading"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <i :class="loading ? 'fas fa-spinner fa-spin' : 'fas fa-sync-alt'" class="mr-2"></i>
              {{ loading ? '刷新中...' : '手动刷新' }}
            </button>
          </div>
        </div>

        <!-- 缓存信息 -->
        <div class="bg-blue-50 p-4 rounded-lg mb-6">
          <div class="flex items-center justify-between">
            <div class="text-sm text-blue-800">
              <p>最后更新: {{ alphaTokensLastUpdated }}</p>
            </div>
            <button
              @click="clearAlphaTokensCache"
              class="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
            >
              清除缓存
            </button>
          </div>
        </div>

        <!-- Alpha代币列表 (Grouped) -->
        <div v-if="Object.keys(groupedAlphaTokenList).length > 0" class="space-y-6">
          <div
            v-for="(tokens, chainName) in groupedAlphaTokenList"
            :key="chainName"
            class="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div
              @click="toggleChain(chainName)"
              class="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <h3 class="text-lg font-semibold text-gray-800">
                <i :class="getChainIcon(chainName)" class="mr-2"></i>
                {{ chainName }}
                <span class="text-sm font-normal text-gray-500 ml-2">({{ tokens.length }}个代币)</span>
              </h3>
              <i
                :class="expandedChains.includes(chainName) ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"
                class="text-gray-500 transition-transform duration-200"
              ></i>
            </div>

            <div v-show="expandedChains.includes(chainName)" class="divide-y divide-gray-100">
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
                        排名 #{{ token.cmc_rank }}
                      </div>
                    </div>
                    <div class="mt-2 space-y-1">
                      <div class="text-sm text-gray-600">
                        <span class="font-medium">合约地址:</span>
                        <code class="ml-2 bg-gray-100 px-2 py-1 rounded text-xs">{{ token.contractAddress }}</code>
                        <button
                          @click="copyAddress(token.contractAddress)"
                          class="ml-2 text-blue-600 hover:text-blue-800 transition-colors"
                          title="复制合约地址"
                        >
                          <i class="fas fa-copy text-xs"></i>
                        </button>
                      </div>
                      <div v-if="token.quote.price" class="text-sm text-gray-600">
                        <span class="font-medium">当前价格:</span>
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
          <h3 class="text-xl font-semibold mb-2">没有Alpha代币数据</h3>
          <p v-if="!cmcApiKey" class="mb-4">请先配置CoinMarketCap API密钥，然后点击刷新获取最新数据</p>
          <p v-else class="mb-4">点击"手动刷新"按钮获取最新的 Alpha 代币列表。</p>
          <button
            v-if="!cmcApiKey"
            @click="activeTab = 'api'"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            配置API密钥
          </button>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="text-center py-12">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <i class="fas fa-spinner fa-spin text-2xl text-blue-600"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">正在获取Alpha代币数据...</h3>
          <p class="text-gray-600">这可能需要几秒钟时间</p>
        </div>
      </div>
    </div>

    <!-- 编辑地址模态框 -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-xl max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">编辑地址</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">钱包地址</label>
            <input
              v-model="editingAddress.address"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              readonly
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">备注</label>
            <input
              v-model="editingAddress.remark"
              placeholder="输入备注"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div class="flex justify-end space-x-3 mt-6">
          <button
            @click="showEditModal = false"
            class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            @click="saveEditedAddress"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            保存
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
import { useBscStore } from '@/stores/bsc';
import { useWalletManagement } from '@/composables/useWalletManagement';
import { useApiKeys } from '@/composables/useApiKeys';
import { useCacheManagement } from '@/composables/useCacheManagement';
import { ElMessage } from 'element-plus';

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Settings',
  setup() {
    const bscStore = useBscStore();
    const activeTab = ref('api');

    const tabs = [
      { key: 'api', name: 'API密钥管理', icon: 'fas fa-key' },
      { key: 'wallets', name: '钱包地址管理', icon: 'fas fa-wallet' },
      { key: 'alpha', name: 'Alpha代币管理', icon: 'fas fa-rocket' },
      { key: 'cache', name: '缓存管理', icon: 'fas fa-database' },
    ];

    // --- Composables ---
    const { addresses, newAddress, addAddress, editAddress, deleteAddress, copyAddress, isValidAddress } = useWalletManagement();
    const {
      bscApiKey, showBscApiKey, saveBscApiKey, resetBscApiKey,
      cmcApiKey, showCmcApiKey, saveCmcApiKey,
      coingeckoApiKey, showCoingeckoApiKey, saveCoingeckoApiKey
    } = useApiKeys();
    const { cacheStats, refreshCacheStats, clearCacheType, clearAllCaches } = useCacheManagement();

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
    const cacheDetails = [
      { key: 'alphaTokens', name: 'Alpha代币缓存' },
      { key: 'transactions', name: '交易记录缓存' },
      { key: 'statistics', name: '统计数据缓存' },
      { key: 'prices', name: '价格数据缓存' },
      { key: 'coinIds', name: '代币ID缓存' },
    ];

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
