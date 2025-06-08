import { ref } from 'vue';
import { useBscStore } from '@/stores/bsc';
import { ElMessage } from 'element-plus';

export function useCacheManagement() {
  const bscStore = useBscStore();
  const cacheStats = ref({});

  const refreshCacheStats = () => {
    cacheStats.value = bscStore.getCacheStats();
  };

  const clearCacheType = (type) => {
    if (confirm(`确定要清空 ${type} 相关的缓存吗？此操作不可逆。`)) {
      bscStore.clearCache(type);
      refreshCacheStats(); // Refresh stats after clearing
      ElMessage.success(`${type} 缓存已清空`);
    }
  };

  const clearAllCaches = () => {
    if (confirm('确定要清空所有缓存吗？包括价格、交易、代币ID等，此操作不可逆。')) {
      bscStore.clearCache('all');
      refreshCacheStats();
      ElMessage.success('所有缓存已清空');
    }
  };

  return {
    cacheStats,
    refreshCacheStats,
    clearCacheType,
    clearAllCaches,
  };
}
