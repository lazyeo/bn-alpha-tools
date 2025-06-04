## BSC交易量查询工具

> 本项目是一个基于Vue3+Vite+TailwindCSS的专业BSC区块链数据分析工具，提供完整的交易查询、数据统计、可视化图表等功能。用户可以输入BSC地址查询详细的交易历史、获取积分分析，并享受沉浸式的用户界面体验。

> 主要用途：为BSC用户提供专业、美观、易用的区块链数据分析工具，支持交易查询、数据统计、积分计算等核心功能。

> 当前状态：已完成完整的产品功能开发，包括响应式设计、统一导航系统、沉浸式菜单、数据可视化、状态管理等。具备完整的用户体验和现代化的UI设计。

> 项目团队：单人开发

> 技术栈：Vue3、Vite、TailwindCSS、Vue Router、Pinia、Font Awesome

## Dependencies

* vue (3.x): 前端框架
* vite: 构建工具
* vue-router: 路由管理
* pinia: 状态管理
* tailwindcss: 原子化CSS框架
* eslint: 代码检查
* prettier: 代码格式化
* pnpm: 包管理工具

## Development Environment

- 推荐使用VSCode+Volar插件
- 启动开发环境：npm run dev
- 构建生产包：npm run build
- 代码检查：npm run lint

## Structure

```
root
- .editorconfig
- .gitattributes
- .gitignore
- .prettierrc.json
- README.md
- eslint.config.js
- index.html
- jsconfig.json
- package.json
- pnpm-lock.yaml
- vite.config.js
- public
    - favicon.ico
- src
    - App.vue                      // 主应用组件，包含沉浸式导航系统
    - main.js                      // 入口JS，应用初始化
    - assets                       // 静态资源
    - components                   // 组件目录
        - ToggleSwitch.vue         // 切换开关组件
    - views                        // 页面组件
        - BscHome.vue              // 首页/搜索页
        - TransactionResults.vue   // 交易结果页
        - Statistics.vue           // 数据统计页
        - Settings.vue             // 设置页面
        - Help.vue                 // 帮助页面
        - NotFound.vue             // 404错误页面
        - Alpha/                   // Alpha相关页面目录
    - router
        - index.js                 // 路由配置
    - stores
        - bsc.js                   // BSC数据状态管理
    - utils
        - api.js                   // API工具函数
        - transaction.js           // 交易数据处理工具
```

### 核心功能模块

#### 1. 沉浸式导航系统 (App.vue)
- **PC端**: 毛玻璃背景的顶部Tab导航，支持渐变主题和光晕效果
- **移动端**: 沉浸式抽屉菜单，包含动态模糊背景和流畅动画
- **响应式切换**: 根据屏幕尺寸自动切换导航模式
- **智能状态指示**: 当前页面高亮和脉冲动画效果

#### 2. BSC地址查询 (BscHome.vue)
- BSC地址输入验证和搜索历史记录
- 实时时间显示和功能特色介绍
- 支持历史记录管理和快速重复查询

#### 3. 交易结果展示 (TransactionResults.vue)
- 详细的交易数据列表和统计卡片
- 支持按日期、交易量排序和筛选
- 展开式交易详情查看

#### 4. 数据统计分析 (Statistics.vue)
- 15日交易量、盈亏、积分柱状图
- SVG图表渲染和交互式数据展示
- 详细数据表格和趋势分析

#### 5. 设置和帮助 (Settings.vue, Help.vue)
- 用户偏好设置和数据管理
- 完整的使用指南和FAQ
- 币安Alpha积分规则说明

### 设计特色

#### 沉浸式视觉体验
- **毛玻璃效果**: backdrop-blur技术营造现代化视觉层次
- **渐变色彩系统**: 每个功能模块的专属配色方案
- **微交互动画**: 悬停、点击、状态切换的流畅过渡
- **光晕效果**: 活跃状态的发光边框和脉冲指示器

#### 响应式设计
- 完美适配PC端和移动端设备
- 自适应布局和交互模式切换
- 统一的视觉风格和用户体验

#### 现代化UI组件
- 自定义SVG图表和数据可视化
- 渐变背景和动画效果
- 智能状态管理和用户反馈