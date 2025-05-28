/**
 * DOM操作工具函数
 */
class DomUtils {
    /**
     * 创建DOM元素
     * @param {string} tagName - 标签名
     * @param {Object} attributes - 属性
     * @param {string|HTMLElement} content - 内容或子元素
     * @returns {HTMLElement} 创建的元素
     */
    static createElement(tagName, attributes = {}, content = null) {
        const element = document.createElement(tagName);

        // 设置属性
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'innerHTML') {
                element.innerHTML = value;
            } else if (key === 'textContent') {
                element.textContent = value;
            } else if (key.startsWith('on') && typeof value === 'function') {
                const eventName = key.substring(2).toLowerCase();
                element.addEventListener(eventName, value);
            } else {
                element.setAttribute(key, value);
            }
        });

        // 添加内容
        if (content !== null) {
            if (typeof content === 'string') {
                element.textContent = content;
            } else if (content instanceof HTMLElement) {
                element.appendChild(content);
            }
        }

        return element;
    }

    /**
     * 创建可展开/折叠的部分
     * @param {string} title - 标题
     * @param {HTMLElement|HTMLElement[]} content - 内容元素或元素数组
     * @param {boolean} expanded - 是否默认展开
     * @returns {HTMLElement} 创建的折叠部分
     */
    static createCollapsibleSection(title, content, expanded = false) {
        // 创建容器
        const container = this.createElement('div', { className: 'collapsible-section' });

        // 创建头部
        const header = this.createElement('div', {
            className: `section-header ${expanded ? 'expanded' : ''}`,
            onClick: () => {
                header.classList.toggle('expanded');
                contentContainer.classList.toggle('expanded');
            }
        });

        // 添加标题和箭头
        const titleEl = this.createElement('h3', {}, title);
        const arrow = this.createElement('span', { className: 'arrow' }, '▼');

        header.appendChild(titleEl);
        header.appendChild(arrow);

        // 创建内容容器
        const contentContainer = this.createElement('div', {
            className: `section-content ${expanded ? 'expanded' : ''}`
        });

        // 添加内容
        if (Array.isArray(content)) {
            content.forEach(element => {
                contentContainer.appendChild(element);
            });
        } else {
            contentContainer.appendChild(content);
        }

        // 组装
        container.appendChild(header);
        container.appendChild(contentContainer);

        return container;
    }

    /**
     * 创建日期折叠部分
     * @param {string} dateStr - 日期字符串（YYYY-MM-DD）
     * @param {Object} dayData - 日期数据
     * @param {Object} tokenPriceMap - 代币价格映射
     * @returns {HTMLElement} 创建的日期折叠部分
     */
    static createDaySummary(dateStr, dayData, tokenPriceMap) {
        // 创建容器
        const container = this.createElement('div', { className: 'day-summary' });

        // 格式化日期显示
        const date = new Date(dateStr);
        const formattedDate = date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        });

        // 找出不平衡的代币（流入流出不相等）
        const imbalancedTokens = TransactionUtils.findImbalancedTokens(dayData.tokenStats);

        // 获取所有具有流出值的代币
        const outflowTokens = TransactionUtils.getOutflowTokens(dayData.tokenStats);

        // 计算日流出总价值
        let dailyOutflowValue = 0;
        outflowTokens.forEach(async token => {
            // 尝试通过代币符号或地址查找价格
            let tokenPrice2 = await ApiUtils.fetchTokenPrice(token);


            let tokenPrice = parseFloat(tokenPrice2);

            if (tokenPrice > 0) {
                dailyOutflowValue += token.outflow * tokenPrice;
            }
        });

        // 创建日期头部
        const dayHeader = this.createElement('div', {
            className: 'day-header',
            onClick: () => {
                dayHeader.classList.toggle('expanded');
                dayContent.classList.toggle('expanded');
            }
        });

        // 创建头部内容容器
        const headerContentContainer = this.createElement('div', {});

        // 添加日期和交易数量信息
        headerContentContainer.appendChild(
            this.createElement('div', {}, `${formattedDate} (${dayData.transactions.length}笔交易)`)
        );

        // 添加流出代币徽章
        if (outflowTokens.length > 0) {
            const outflowStatsContainer = this.createElement('div', { className: 'day-outflow-stats' });

            outflowTokens.forEach(async token => {
                // 获取代币价格和价值
                let tokenPrice = 0;
                let tokenValue = 0;

                let tokenPrice2 = await ApiUtils.fetchTokenPrice(token.symbol);


                tokenPrice = parseFloat(tokenPrice2);
                tokenValue = token.outflow * tokenPrice;


                // 创建流出徽章
                const outflowBadge = this.createElement('span', {
                    className: 'token-badge outflow'
                }, `${token.symbol} 流出: ${token.outflow.toFixed(4)}`);

                outflowStatsContainer.appendChild(outflowBadge);

                // 如果有价值，添加价值徽章
                if (tokenValue > 0) {
                    const valueBadge = this.createElement('span', {
                        className: 'token-badge value'
                    }, `价值: ${tokenValue.toFixed(2)} USD`);

                    outflowStatsContainer.appendChild(valueBadge);
                }
            });

            // 添加日流出总价值
            if (dailyOutflowValue > 0) {
                const totalValueBadge = this.createElement('span', {
                    className: 'token-badge value'
                }, `总流出价值: ${dailyOutflowValue.toFixed(2)} USD (+ ${1 + Math.floor(Math.log2(dailyOutflowValue))} Point)`);

                outflowStatsContainer.appendChild(totalValueBadge);
            }

            headerContentContainer.appendChild(outflowStatsContainer);
        }

        // 如果有不平衡的代币，添加它们的徽章
        if (imbalancedTokens.length > 0) {
            const diffContainer = this.createElement('div', { className: 'day-summary-overview' });

            imbalancedTokens.forEach(token => {
                const netFlow = token.inflow - token.outflow;
                const isInflow = netFlow > 0;

                const diffBadge = this.createElement('span', {
                    className: 'token-badge difference'
                }, `${token.symbol} 差额: ${isInflow ? '+' : '-'}${Math.abs(netFlow).toFixed(4)}`);

                diffContainer.appendChild(diffBadge);
            });

            headerContentContainer.appendChild(diffContainer);
        }

        // 添加箭头
        const arrow = this.createElement('span', { className: 'arrow' }, '▼');

        // 组装头部
        dayHeader.appendChild(headerContentContainer);
        dayHeader.appendChild(arrow);

        // 创建日期内容
        const dayContent = this.createElement('div', { className: 'day-content' });

        // 添加日期统计
        const dayStats = this.createElement('div', { className: 'day-stats' });

        // 添加BNB消耗统计
        const bnbStat = this.createElement('div', { className: 'summary-item' });
        bnbStat.innerHTML = `
            <span>消耗BNB数量:</span>
            <span>${dayData.totalBnb.toFixed(6)} BNB</span>
        `;
        dayStats.appendChild(bnbStat);

        // 按字母顺序排序代币
        const sortedTokens = Object.keys(dayData.tokenStats).sort();

        // 添加代币统计
        sortedTokens.forEach(tokenSymbol => {
            const stats = dayData.tokenStats[tokenSymbol];

            // 只有当有流入或流出时才显示
            if (stats.inflow > 0 || stats.outflow > 0) {
                // 创建流入统计
                if (stats.inflow > 0) {
                    const inflowItem = this.createElement('div', { className: 'summary-item' });
                    inflowItem.innerHTML = `
                        <span>${tokenSymbol} 流入:</span>
                        <span class="token-flow">${stats.inflow.toFixed(6)}</span>
                    `;
                    dayStats.appendChild(inflowItem);
                }

                // 创建流出统计
                if (stats.outflow > 0) {
                    const outflowItem = this.createElement('div', { className: 'summary-item' });

                    // 计算流出价值
                    let tokenValue = 0;
                    if (tokenPriceMap[tokenSymbol] !== undefined) {
                        tokenValue = stats.outflow * parseFloat(tokenPriceMap[tokenSymbol]);
                    } else if (stats.address && tokenPriceMap[stats.address] !== undefined) {
                        tokenValue = stats.outflow * parseFloat(tokenPriceMap[stats.address]);
                    }

                    let valueText = '';
                    if (tokenValue > 0) {
                        valueText = ` (价值: ${tokenValue.toFixed(2)} USD)`;
                    }

                    outflowItem.innerHTML = `
                        <span>${tokenSymbol} 流出:</span>
                        <span class="token-flow outflow">${stats.outflow.toFixed(6)}${valueText}</span>
                    `;
                    dayStats.appendChild(outflowItem);
                }

                // 添加净流入/流出统计
                const netFlow = stats.inflow - stats.outflow;
                if (Math.abs(netFlow) > 0.000001) {
                    const netFlowItem = this.createElement('div', { className: 'summary-item' });
                    const isNetInflow = netFlow > 0;
                    netFlowItem.innerHTML = `
                        <span>${tokenSymbol} 净${isNetInflow ? '流入' : '流出'}:</span>
                        <span class="token-flow ${isNetInflow ? '' : 'outflow'}">${Math.abs(netFlow).toFixed(6)}</span>
                    `;
                    dayStats.appendChild(netFlowItem);
                }
            }
        });

        dayContent.appendChild(dayStats);

        // 创建交易表格
        const table = document.createElement('table');
        table.innerHTML = `
            <thead>
                <tr>
                    <th>交易哈希</th>
                    <th>时间(UTC)</th>
                    <th>Token</th>
                    <th>流入数量</th>
                    <th>流出数量</th>
                    <th>消耗BNB</th>
                    <th>状态</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;

        const tbody = table.querySelector('tbody');

        // 添加交易行
        dayData.transactions.forEach(tx => {
            // 将UTC时间戳转换为本地时间
            const txDate = new Date(parseInt(tx.timeStamp) * 1000);
            const formattedTime = txDate.toLocaleTimeString('zh-CN');

            // 处理每种代币
            Object.entries(tx.tokens).forEach(([tokenSymbol, tokenData]) => {
                // 只有当有流入或流出时才添加行
                if (tokenData.inflow > 0 || tokenData.outflow > 0) {
                    const row = document.createElement('tr');

                    // 创建链接到BSCScan的交易哈希
                    const hashCell = document.createElement('td');
                    const hashLink = document.createElement('a');
                    hashLink.href = `https://bscscan.com/tx/${tx.hash}`;
                    hashLink.target = '_blank';
                    hashLink.className = 'hash-link';
                    hashLink.textContent = ValidationUtils.formatTransactionHash(tx.hash);
                    hashCell.appendChild(hashLink);

                    // 计算流出价值
                    let tokenValue = 0;
                    let valueText = '';

                    if (tokenData.outflow > 0) {
                        if (tokenPriceMap[tokenSymbol] !== undefined) {
                            tokenValue = tokenData.outflow * parseFloat(tokenPriceMap[tokenSymbol]);
                        } else if (tokenData.address && tokenPriceMap[tokenData.address] !== undefined) {
                            tokenValue = tokenData.outflow * parseFloat(tokenPriceMap[tokenData.address]);
                        }

                        if (tokenValue > 0) {
                            valueText = ` (${tokenValue.toFixed(2)} USD)`;
                        }
                    }

                    row.innerHTML = `
                        <td></td>
                        <td>${formattedTime}</td>
                        <td>${tokenSymbol}</td>
                        <td class="token-flow">${tokenData.inflow > 0 ? tokenData.inflow.toFixed(6) : '-'}</td>
                        <td class="token-flow outflow">${tokenData.outflow > 0 ? tokenData.outflow.toFixed(6) + valueText : '-'}</td>
                        <td>${parseFloat(tx.gasFee).toFixed(6)} BNB</td>
                        <td>${tx.status}</td>
                    `;

                    row.replaceChild(hashCell, row.children[0]);
                    tbody.appendChild(row);
                }
            });
        });

        dayContent.appendChild(table);

        // 组装日期容器
        container.appendChild(dayHeader);
        container.appendChild(dayContent);

        return container;
    }

    /**
     * 创建tab
     * @param {string} id - Tab ID
     * @param {string} title - Tab标题
     * @param {HTMLElement} content - Tab内容
     * @param {boolean} active - 是否活动
     * @returns {Object} Tab对象，包含按钮和内容
     */
    static createTab(id, title, content, active = false) {
        // 创建按钮
        const button = this.createElement('button', {
            className: `tab-button ${active ? 'active' : ''}`,
            id: `tab-btn-${id}`,
            onClick: (e) => {
                // 移除所有活动状态
                document.querySelectorAll('.tab-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });

                // 设置当前为活动状态
                e.target.classList.add('active');
                document.getElementById(`tab-content-${id}`).classList.add('active');
            }
        }, title);

        // 设置内容属性
        content.id = `tab-content-${id}`;
        content.className = `tab-content ${active ? 'active' : ''}`;

        return { button, content };
    }
}