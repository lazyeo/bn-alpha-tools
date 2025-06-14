import { ref, reactive, onMounted } from 'vue';
import { useClipboard } from '@vueuse/core';
import { ElMessage } from 'element-plus';

const SAVED_ADDRESSES_KEY = 'saved_addresses';

export function useWalletManagement() {
  const { copy } = useClipboard();
  const addresses = ref([]);
  const newAddress = reactive({ address: '', remark: '' });

  const isValidAddress = (address) => /^0x[a-fA-F0-9]{40}$/.test(address);

  const loadAddresses = () => {
    const data = localStorage.getItem(SAVED_ADDRESSES_KEY);
    if (data) {
      addresses.value = JSON.parse(data);
    }
  };

  const saveAddresses = () => {
    localStorage.setItem(SAVED_ADDRESSES_KEY, JSON.stringify(addresses.value));
  };

  const addAddress = (wallet) => {
    const addressToAdd = wallet || newAddress;
    if (isValidAddress(addressToAdd.address)) {
      // Check for duplicates
      if (addresses.value.some(a => a.address.toLowerCase() === addressToAdd.address.toLowerCase())) {
        ElMessage.warning('该地址已存在');
        return;
      }

      addresses.value.push({ ...addressToAdd, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
      saveAddresses();

      if (!wallet) {
        newAddress.address = '';
        newAddress.remark = '';
      }

      ElMessage.success('地址已添加');
    } else {
      ElMessage.error('无效的BSC地址');
    }
  };

  const deleteAddress = (index) => {
    ElMessage.warning('地址已删除');
    addresses.value.splice(index, 1);
    saveAddresses();
  };

  const editAddress = (index) => {
    const remark = prompt('输入新的备注:', addresses.value[index].remark || '');
    if (remark !== null) {
      addresses.value[index].remark = remark;
      saveAddresses();
      ElMessage.success('备注已更新');
    }
  };

  const copyAddress = (address) => {
    copy(address);
    ElMessage.success('地址已复制到剪贴板');
  };

  onMounted(loadAddresses);

  return {
    addresses,
    newAddress,
    addAddress,
    editAddress,
    deleteAddress,
    copyAddress,
    isValidAddress,
  };
}
