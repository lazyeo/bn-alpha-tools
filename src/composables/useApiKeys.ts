import { ref, onMounted } from 'vue';
import { useBscStore } from '@/stores/bsc';
import { ElMessage } from 'element-plus';

export function useApiKeys() {
  const bscStore = useBscStore();

  const bscApiKey = ref('');
  const cmcApiKey = ref('');
  const coingeckoApiKey = ref('');

  const showBscApiKey = ref(false);
  const showCmcApiKey = ref(false);
  const showCoingeckoApiKey = ref(false);

  // Sync local state with store state when composable is used
  onMounted(() => {
    bscStore.loadApiKeys();
    bscApiKey.value = bscStore.apiKeys.bsc;
    cmcApiKey.value = bscStore.apiKeys.cmc;
    coingeckoApiKey.value = bscStore.apiKeys.coingecko;
  });

  const saveBscApiKey = () => {
    bscStore.saveApiKeys({ bsc: bscApiKey.value });
    ElMessage.success('BSCScan API密钥已保存');
  };

  const resetBscApiKey = () => {
    bscApiKey.value = '';
    bscStore.saveApiKeys({ bsc: '' });
    ElMessage.info('BSCScan API密钥已重置为默认');
  };

  const saveCmcApiKey = () => {
    bscStore.saveApiKeys({ cmc: cmcApiKey.value });
    ElMessage.success('CoinMarketCap API密钥已保存');
  };

  const saveCoingeckoApiKey = () => {
    bscStore.saveApiKeys({ coingecko: coingeckoApiKey.value });
    ElMessage.success('CoinGecko API密钥已保存');
  };

  return {
    bscApiKey,
    showBscApiKey,
    saveBscApiKey,
    resetBscApiKey,
    cmcApiKey,
    showCmcApiKey,
    saveCmcApiKey,
    coingeckoApiKey,
    showCoingeckoApiKey,
    saveCoingeckoApiKey,
  };
}
