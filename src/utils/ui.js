/**
 * UI相关工具函数
 */
class UIUtils {
    /**
     * 显示加载动画
     * @param {boolean} isLoading - 是否显示加载动画
     */
    static showLoading(isLoading) {
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = isLoading ? 'flex' : 'none';
        }
    }

    /**
     * 显示错误消息
     * @param {string} message - 错误消息
     * @param {number} duration - 显示时长（毫秒）
     */
    static showError(message, duration = 3000) {
        this.showNotification(message, 'error', duration);
    }

    /**
     * 显示成功消息
     * @param {string} message - 成功消息
     * @param {number} duration - 显示时长（毫秒）
     */
    static showSuccess(message, duration = 3000) {
        this.showNotification(message, 'success', duration);
    }

    /**
     * 显示通知消息
     * @param {string} message - 消息内容
     * @param {string} type - 消息类型 (default, error, success)
     * @param {number} duration - 显示时长（毫秒）
     */
    static showNotification(message, type = 'default', duration = 3000) {
        const notificationElement = document.getElementById('notification');
        const messageElement = document.getElementById('notification-message');

        if (notificationElement && messageElement) {
            // 重置所有类
            notificationElement.className = 'notification';

            // 添加类型类
            if (type !== 'default') {
                notificationElement.classList.add(type);
            }

            // 设置消息
            messageElement.textContent = message;

            // 显示通知
            notificationElement.style.display = 'block';

            // 自动隐藏
            setTimeout(() => {
                notificationElement.style.display = 'none';
            }, duration);
        }
    }

    /**
     * 打开确认模态框
     * @param {string} message - 提示消息
     * @param {Function} callback - 确认后的回调函数
     */
    static openConfirmModal(message, callback) {
        const confirmModal = document.getElementById('confirm-modal');
        const modalMessage = document.getElementById('modal-message');
        const confirmModalActionBtn = document.getElementById('confirm-modal-action');

        if (confirmModal && modalMessage && confirmModalActionBtn) {
            modalMessage.textContent = message;

            // 移除之前的事件监听器
            const newConfirmBtn = confirmModalActionBtn.cloneNode(true);
            confirmModalActionBtn.parentNode.replaceChild(newConfirmBtn, confirmModalActionBtn);

            // 添加新的确认事件监听器
            newConfirmBtn.addEventListener('click', () => {
                if (typeof callback === 'function') {
                    callback();
                }
                this.closeConfirmModal();
            });

            // 显示模态框
            confirmModal.style.display = 'flex';
        }
    }

    /**
     * 关闭确认模态框
     */
    static closeConfirmModal() {
        const confirmModal = document.getElementById('confirm-modal');
        if (confirmModal) {
            confirmModal.style.display = 'none';
        }
    }

    /**
     * 格式化时间戳为本地日期时间
     * @param {number} timestamp - Unix时间戳（秒）
     * @param {boolean} includeTime - 是否包含时间
     * @returns {string} 格式化后的日期时间
     */
    static formatTimestamp(timestamp, includeTime = true) {
        const date = new Date(parseInt(timestamp) * 1000);

        if (includeTime) {
            return date.toLocaleString('zh-CN');
        } else {
            return date.toLocaleDateString('zh-CN');
        }
    }

    /**
     * 创建地址标签元素
     * @param {string} address - 地址
     * @param {Function} onRemove - 移除回调函数
     * @returns {HTMLElement} 地址标签元素
     */
    static createAddressLabel(address, onRemove) {
        const addressLabel = document.createElement('div');
        addressLabel.className = 'address-label';

        const labelText = document.createElement('span');
        labelText.className = 'label-text';
        labelText.textContent = address;
        labelText.title = address;

        const removeButton = document.createElement('button');
        removeButton.className = 'remove-button';
        removeButton.innerHTML = '&times;';
        removeButton.title = '移除此地址';
        removeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            if (typeof onRemove === 'function') {
                onRemove(address);
            }
        });

        addressLabel.appendChild(labelText);
        addressLabel.appendChild(removeButton);

        return addressLabel;
    }

    /**
     * 创建代币徽章元素
     * @param {string} tokenSymbol - 代币符号
     * @param {number} amount - 数量
     * @param {string} type - 类型 (inflow, outflow, difference, value, point)
     * @param {string} prefix - 前缀文本
     * @returns {HTMLElement} 代币徽章元素
     */
    static createTokenBadge(tokenSymbol, amount, type = '', prefix = '') {
        const badge = document.createElement('span');
        badge.className = 'token-badge';

        if (type) {
            badge.classList.add(type);
        }

        badge.textContent = `${prefix}${tokenSymbol}: ${typeof amount === 'number' ? amount.toFixed(4) : amount}`;

        return badge;
    }

    /**
     * 清空元素内容
     * @param {HTMLElement} element - 要清空的元素
     */
    static clearElement(element) {
        if (element) {
            element.innerHTML = '';
        }
    }

    /**
     * 创建空数据提示元素
     * @param {string} message - 提示消息
     * @returns {HTMLElement} 空数据提示元素
     */
    static createNoDataElement(message = '暂无数据') {
        const noData = document.createElement('div');
        noData.className = 'no-data';
        noData.textContent = message;
        return noData;
    }

    /**
     * 在本地存储中保存值
     * @param {string} key - 键名
     * @param {any} value - 值
     */
    static saveToStorage(key, value) {
        if (typeof value === 'object') {
            localStorage.setItem(key, JSON.stringify(value));
        } else {
            localStorage.setItem(key, value);
        }
    }

    /**
     * 从本地存储中获取值
     * @param {string} key - 键名
     * @param {boolean} parseJson - 是否解析为JSON
     * @returns {any} 获取的值
     */
    static getFromStorage(key, parseJson = false) {
        const value = localStorage.getItem(key);

        if (parseJson && value) {
            try {
                return JSON.parse(value);
            } catch (e) {
                return null;
            }
        }

        return value;
    }

    // 在 UIUtils 类中添加以下方法

    /**
     * 打开确认模态框（带有两个选项）
     * @param {string} message - 提示消息
     * @param {Function} yesCallback - 确认后的回调函数
     * @param {Function} noCallback - 拒绝后的回调函数
     */
    static openConfirmModalWithOptions(message, yesCallback, noCallback) {
        const confirmModal = document.getElementById('confirm-modal');
        const modalMessage = document.getElementById('modal-message');
        const confirmModalActionBtn = document.getElementById('confirm-modal-action');
        const cancelModalBtn = document.getElementById('cancel-modal');

        if (confirmModal && modalMessage && confirmModalActionBtn && cancelModalBtn) {
            modalMessage.textContent = message;

            // 移除之前的事件监听器
            const newConfirmBtn = confirmModalActionBtn.cloneNode(true);
            const newCancelBtn = cancelModalBtn.cloneNode(true);

            confirmModalActionBtn.parentNode.replaceChild(newConfirmBtn, confirmModalActionBtn);
            cancelModalBtn.parentNode.replaceChild(newCancelBtn, cancelModalBtn);

            // 添加新的确认事件监听器
            newConfirmBtn.addEventListener('click', () => {
                if (typeof yesCallback === 'function') {
                    yesCallback();
                }
                this.closeConfirmModal();
            });

            // 添加新的取消事件监听器
            newCancelBtn.addEventListener('click', () => {
                if (typeof noCallback === 'function') {
                    noCallback();
                }
                this.closeConfirmModal();
            });

            // 显示模态框
            confirmModal.style.display = 'flex';
        }
    }

    /**
     * 创建地址显示元素（包含备注）
     * @param {string} address - 地址
     * @param {boolean} isLink - 是否是链接
     * @returns {HTMLElement} 地址显示元素
     */
    static createAddressDisplay(address, isLink = true) {
        // 创建容器
        const container = document.createElement('div');
        container.className = 'address-display';

        // 获取地址备注
        const addressNote = StorageUtils.getAddressNote(address);

        // 创建地址元素
        let addressElement;

        if (isLink) {
            addressElement = document.createElement('a');
            addressElement.href = `#alpha/address/${address}`;
            addressElement.className = 'address-link';
            addressElement.target = '_self';
        } else {
            addressElement = document.createElement('span');
            addressElement.className = 'address-text';
        }

        // 格式化地址
        addressElement.textContent = ValidationUtils.formatTransactionHash(address);
        addressElement.title = address;

        // 添加地址元素
        container.appendChild(addressElement);

        // 如果有备注，添加备注信息
        if (addressNote) {
            const noteElement = document.createElement('span');
            noteElement.className = 'address-note-name';
            noteElement.textContent = addressNote.name;
            noteElement.title = addressNote.description || addressNote.name;

            // 添加备注元素
            container.appendChild(document.createTextNode(' '));
            container.appendChild(noteElement);

            // 如果有标签，添加第一个标签
            if (addressNote.tags && addressNote.tags.length > 0) {
                const tagElement = document.createElement('span');
                tagElement.className = 'address-note-tag';
                tagElement.textContent = addressNote.tags[0];

                // 添加标签元素
                container.appendChild(document.createTextNode(' '));
                container.appendChild(tagElement);
            }
        }

        return container;
    }
}