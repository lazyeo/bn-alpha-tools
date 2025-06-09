# 🚀 BSC Alpha 交易分析工具

一个专为币安智能链（BSC）设计的高性能交易数据分析工具，提供 Alpha 代币识别、积分计算和多维度数据可视化功能。

## 🌐 在线演示

**🔗 [Cloudflare Pages - 主站](https://bn-alpha-tools.pages.dev/)**

**🔗 [GitHub Pages - 镜像站](https://lazyeo.github.io/bn-alpha-tools/)**

> **⚠️ 重要提示**：由于所有数据都是纯本地存储，两个演示站点的数据不互通，需要分别配置API密钥和设置。建议选择其中一个站点作为主要使用环境。


## ✨ 核心特性

### 🎯 Alpha 代币智能分析
- **智能过滤**：只记录和展示涉及Alpha代币的交易，完全不涉及Alpha代币的交易被过滤掉
- **完整保留**：当交易包含Alpha代币时，该交易中的所有代币（包括非Alpha代币）都会被展示和计算
- **积分计算**：基于交易量和 BSC 链奖励的智能积分算法
- **价格追踪**：实时历史价格数据获取和批量优化缓存

### 🏗️ 服务化架构
- **模块化设计**：完全服务化的架构，高内聚低耦合
- **智能过滤**：数据处理层面的Alpha代币过滤，大幅提升处理效率
- **数据源抽象**：统一的区块链数据获取接口
- **插件化分析**：可扩展的分析插件系统
- **多层缓存**：智能缓存策略，显著提升性能

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
- 智能缓存策略
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
│   │   └── processing.service.ts # 交易数据标准化 + Alpha过滤
│   ├── analysis/           # 分析服务
│   │   └── analysis.plugin.ts    # Alpha分析插件
│   └── caching/           # 缓存服务
│       └── caching.service.ts    # 通用缓存管理
├── models/                 # 数据模型
│   └── types.ts           # TypeScript类型定义
├── config/                # 配置文件
│   └── alpha-tokens.json  # Alpha代币配置（静态后备）
├── composables/           # 可复用逻辑
├── components/            # 通用组件
├── stores/               # 状态管理
└── router/               # 路由配置
```

### 🔄 数据流架构
```
用户输入 → 地址验证 → 并行API调用 → Alpha过滤 → 数据标准化 → 价格计算 → 结果展示
    ↓         ↓           ↓          ↓         ↓          ↓         ↓
  历史管理   路由守卫    智能缓存   Alpha识别  批量优化   价格缓存   统计计算
```

## 🚀 快速开始

### 🌐 在线使用
直接访问在线演示站点，无需安装：
- **主站**：https://bn-alpha-tools.pages.dev/
- **镜像站**：https://lazyeo.github.io/bn-alpha-tools/

配置API密钥后即可开始使用。

### 💻 本地开发

**环境要求**
- Node.js 18+
- npm 或 pnpm

**安装运行**
```bash
# 克隆项目
git clone https://github.com/lazyeo/bn-alpha-tools.git

# 安装依赖
npm install
# 或
pnpm install

# 开发模式
npm run dev

# 构建
npm run build
```

## ⚙️ 核心功能

### 1. 智能地址分析
- **输入验证**：BSC地址格式校验
- **历史管理**：搜索历史自动保存
- **批量管理**：支持多地址管理

### 2. Alpha代币智能过滤
- **交易过滤**：只处理涉及Alpha代币的交易，提升处理效率
- **完整保留**：保留Alpha相关交易中的所有代币信息
- **合约匹配**：基于合约地址精确识别Alpha代币
- **动态更新**：实时从CoinMarketCap获取最新Alpha代币列表

### 3. 高效数据获取
- **并行API调用**：同时获取普通交易、内部交易、代币交易
- **批量价格获取**：优化的批量历史价格查询，减少API调用
- **智能缓存**：多层缓存策略，显著减少重复请求

### 4. 积分系统
- **Alpha积分**：基于Alpha代币流入计算
- **BSC奖励**：BSC链代币额外奖励加成
- **算法**：floor(log₂(Alpha流入 + BSC奖励))
- **实时计算**：支持单日和累计积分统计

### 5. 损益分析
- **分类统计**：Alpha代币、稳定币、BNB分类流动统计
- **Gas成本**：BNB手续费精确统计
- **综合损益**：考虑所有因素的完整盈亏分析
- **净值计算**：实时USD价值计算

## 🔧 API配置

### 必需API密钥
1. **BSCScan API Key**：获取交易数据
   - 申请地址：https://bscscan.com/apidashboard
   - 配置位置：设置页面

2. **CoinMarketCap API Key**：获取Alpha代币列表
   - 申请地址：https://coinmarketcap.com/api/
   - 配置位置：设置页面

3. **CoinGecko API Key** (可选)：历史价格数据
   - 申请地址：https://www.coingecko.com/en/api
   - 提升查询限制，支持Demo和Pro密钥

### 📋 数据存储说明
- **本地存储**：所有API密钥、搜索历史、分析结果均保存在浏览器本地存储中
- **数据隔离**：不同域名下的数据完全隔离，两个演示站点的配置和数据不互通
- **隐私保护**：数据不会上传到服务器，完全在客户端处理
- **迁移提示**：如需切换使用站点，请重新配置API密钥和导入设置

## 📊 最新更新特性

### 🎯 Alpha代币智能过滤
- ✅ **智能过滤算法**：只处理涉及Alpha代币的交易
- ✅ **完整信息保留**：Alpha相关交易保留所有代币信息
- ✅ **处理效率提升**：大幅减少无关数据处理
- ✅ **精准追踪**：专注Alpha代币相关活动

### 🚀 性能优化
- ✅ **批量价格获取**：减少90%以上的价格API调用
- ✅ **智能缓存策略**：多层缓存，避免重复计算
- ✅ **并发处理优化**：合理的API调用频率控制
- ✅ **内存使用优化**：只保留必要的交易数据

### 🔧 API集成优化
- ✅ **CoinGecko双模式**：智能识别Demo/Pro密钥类型
- ✅ **CORS完美解决**：支持本地开发和生产部署
- ✅ **错误处理完善**：友好的错误提示和自动重试
- ✅ **网络容错**：多重API备选方案

### 💻 用户体验
- ✅ **统一导航系统**：自适应PC/移动端导航
- ✅ **实时状态反馈**：详细的处理进度显示
- ✅ **数据持久化**：完善的本地存储管理
- ✅ **响应式设计**：完美适配各种设备

## 📝 更新日志

### v2.0 - Alpha智能过滤版本 (当前)
- 🚀 **核心功能**：实现Alpha代币智能过滤系统
- ⚡ **性能提升**：批量价格获取，减少API调用次数
- 🔧 **API优化**：CoinGecko Demo/Pro密钥智能识别
- 💻 **体验优化**：改进加载状态和错误处理
- 🌐 **部署完成**：Cloudflare Pages在线部署

### v1.0 - 架构重构版本
- 🚀 **架构重构**：完成utils到services的全面迁移
- 🔧 **Bug修复**：修复稳定币和BNB统计逻辑
- ✨ **功能增强**：添加智能缓存和数据持久化
- 💻 **UI优化**：统一导航系统和响应式设计

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支：`git checkout -b feature/新功能`
3. 提交变更：`git commit -m 'Add 新功能'`
4. 推送分支：`git push origin feature/新功能`
5. 创建 Pull Request

