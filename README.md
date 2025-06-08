# 🚀 BSC Alpha 交易分析工具 (重构版)

一个专为币安智能链（BSC）设计的高性能交易数据分析工具，提供 Alpha 代币识别、积分计算和多维度数据可视化功能。

## ✨ 核心特性

### 🎯 Alpha 代币分析
- **智能识别**：自动识别和分析 Alpha 代币交易
- **积分计算**：基于交易量和 BSC 链奖励的积分算法
- **价格追踪**：实时历史价格数据获取和缓存
- **统计分析**：多维度交易数据统计和趋势分析

### 🏗️ 服务化架构 (已重构)
- **模块化设计**：完全服务化的架构，高内聚低耦合
- **数据源抽象**：统一的区块链数据获取接口
- **插件化分析**：可扩展的分析插件系统
- **智能缓存**：多层缓存优化，提升性能

### 💻 现代化UI
- **响应式设计**：完美适配桌面端和移动端
- **统一导航**：自适应PC顶部导航和移动端抽屉菜单
- **数据可视化**：直观的图表和统计展示
- **用户体验**：流畅的动画和交互反馈

### 🔧 技术栈

**前端框架**
- Vue 3 + Composition API
- Pinia 状态管理
- Vue Router 4 路由
- Vite 构建工具

**UI 组件**
- Element Plus 组件库
- TailwindCSS 样式框架
- Font Awesome 图标库

**数据处理**
- TypeScript 类型安全
- BigNumber.js 精度计算
- 多重缓存策略
- RESTful API 集成

## 🏛️ 系统架构

### 📁 项目结构
```
src/
├── views/                    # 页面组件
│   ├── BscHome.vue          # 首页/搜索页
│   ├── TransactionResults.vue # 交易结果页
│   ├── Settings.vue         # 设置页面
│   ├── AddressManager.vue   # 地址管理
│   └── AlphaPointsRules.vue # 积分规则说明
├── services/                # 服务层 (重构核心)
│   ├── datasource/         # 数据源服务
│   │   ├── connectors.ts   # BSCScan API连接器
│   │   ├── coingecko.ts    # 价格数据连接器
│   │   └── connectors/     # 其他数据源连接器
│   ├── processing/         # 数据处理服务
│   │   └── processing.service.ts # 交易数据标准化
│   ├── analysis/           # 分析服务
│   │   └── analysis.plugin.ts    # Alpha分析插件
│   └── caching/           # 缓存服务
│       └── caching.service.ts    # 通用缓存管理
├── models/                 # 数据模型
│   └── types.ts           # TypeScript类型定义
├── config/                # 配置文件
│   └── alpha-tokens.json  # Alpha代币配置
├── composables/           # 可复用逻辑
├── components/            # 通用组件
├── stores/               # 状态管理
└── router/               # 路由配置
```

### 🔄 数据流架构
```
用户输入 → 地址验证 → 并行API调用 → 数据标准化 → Alpha分析 → 价格计算 → 结果展示
    ↓         ↓           ↓           ↓          ↓         ↓
  历史管理   路由守卫    智能缓存    插件分析   价格缓存   统计计算
```

## 🚀 快速开始

### 环境要求
- Node.js 18+
- npm 或 pnpm

### 安装依赖
```bash
npm install
# 或
pnpm install
```

### 开发模式
```bash
npm run dev
```

### 构建部署
```bash
npm run build
```

## ⚙️ 核心功能

### 1. 地址分析
- **输入验证**：BSC地址格式校验
- **历史管理**：搜索历史自动保存
- **批量管理**：支持多地址管理

### 2. 交易数据获取
- **并行API调用**：同时获取普通交易、内部交易、代币交易
- **智能筛选**：自动筛选目标合约相关交易
- **增量更新**：只获取新增交易数据

### 3. Alpha代币识别
- **合约匹配**：基于合约地址精确识别
- **价格计算**：历史价格数据获取和USD价值计算
- **分类统计**：Alpha代币、稳定币、BNB分类统计

### 4. 积分系统
- **Alpha积分**：基于Alpha代币流入计算
- **BSC奖励**：BSC链代币额外奖励
- **算法**：floor(log₂(Alpha流入 + BSC奖励))

### 5. 损益分析
- **流入流出**：各类代币净流动统计
- **Gas统计**：BNB手续费统计
- **综合损益**：考虑所有因素的盈亏分析

## 🔧 API配置

### 必需API密钥
1. **BSCScan API Key**：获取交易数据
   - 申请地址：https://bscscan.com/apis
   - 配置位置：设置页面

2. **CoinMarketCap API Key**：获取Alpha代币列表
   - 申请地址：https://coinmarketcap.com/api/
   - 配置位置：设置页面

3. **CoinGecko API Key** (可选)：历史价格数据
   - 申请地址：https://www.coingecko.com/en/api
   - 提升查询限制

## 📊 核心改进 (重构版特性)

### 🎯 架构优化
- ✅ **完全服务化**：从utils迁移到services架构
- ✅ **TypeScript集成**：类型安全和智能提示
- ✅ **插件化分析**：可扩展的分析插件系统
- ✅ **统一数据接口**：标准化的数据模型

### 🔧 功能增强
- ✅ **稳定币检测修复**：正确识别BSC-USD等稳定币
- ✅ **BNB统计完善**：包含WBNB、ETH、WETH统计
- ✅ **价格数据优化**：批量获取和智能缓存
- ✅ **统计逻辑统一**：消除计算不一致问题

### 💻 用户体验
- ✅ **统一导航系统**：自适应PC/移动端导航
- ✅ **加载性能优化**：智能缓存和增量更新
- ✅ **错误处理完善**：友好的错误提示和重试机制
- ✅ **数据持久化**：完善的本地存储管理

## 🌐 部署指南

### 推荐平台：Cloudflare Pages
1. 将代码推送到GitHub
2. 在Cloudflare Pages中连接仓库
3. 构建设置：
   - 构建命令：`npm run build`
   - 输出目录：`dist`
4. 自动部署完成

### 备选平台：Vercel
- 零配置部署，完美支持Vite项目
- 全球CDN加速

### GitHub Pages
- 使用GitHub Actions自动构建部署
- 完全免费方案

## 📝 更新日志

### 重构版本 (当前)
- 🚀 **架构重构**：完成utils到services的全面迁移
- 🔧 **Bug修复**：修复稳定币和BNB统计逻辑
- ✨ **功能增强**：添加批量价格获取和智能缓存
- 💻 **UI优化**：统一导航系统和响应式设计
- 📦 **部署优化**：添加多平台部署支持

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支：`git checkout -b feature/新功能`
3. 提交变更：`git commit -m 'Add 新功能'`
4. 推送分支：`git push origin feature/新功能`
5. 提交Pull Request

## 📄 许可证

MIT License

## 🔗 相关链接

- [BSCScan API 文档](https://docs.bscscan.com/)
- [CoinGecko API 文档](https://www.coingecko.com/en/api/documentation)
- [Vue 3 官方文档](https://vuejs.org/)
- [Pinia 状态管理](https://pinia.vuejs.org/)

---

*专为BSC用户打造的专业交易分析工具 - 重构版* 