## BSC地址每日交易量查询工具

> 本项目是一个基于Vue3+Vite+Element Plus+Tailwind CSS的前端工具，用户可输入BSC地址，查询该地址每天的交易笔数和总交易量，并可为每一天获取积分。

> 主要用途：方便用户快速了解任意BSC地址的每日链上活跃度和交易情况。

> 当前状态：已完成基础页面搭建，支持输入BSC地址、查询、表格展示、获取积分等功能，后续可对接后端API获取真实数据。

> 项目团队：单人开发

> 技术栈：Vue3、Vite、Element Plus、Tailwind CSS、pnpm

## Dependencies

* vue (3.x): 前端框架
* vite: 构建工具
* element-plus: UI组件库
* tailwindcss: 原子化CSS框架
* pnpm: 包管理工具

## Development Environment

- 推荐使用VSCode+Volar插件
- 启动开发环境：pnpm dev
- 构建生产包：pnpm build
- 代码检查：pnpm lint

## Structrue

```
root
- .editorconfig
- .gitattributes
- .gitignore
- .prettierrc.json
- README.md
- eslint.config.js
- folder-alias.json
- index.html
- jsconfig.json
- package.json
- pnpm-lock.yaml
- public
    - favicon.ico
- src
    - App.vue                // 应用入口，包含全局结构
    - assets                 // 静态资源
        - base.css
        - logo.svg
        - main.css
    - components             // 组件目录（目前无业务组件）
        - icons              // 图标组件
            - IconCommunity.vue
            - IconDocumentation.vue
            - IconEcosystem.vue
            - IconSupport.vue
            - IconTooling.vue
    - main.js                // 入口JS，挂载Vue应用
    - router
        - index.js           // 路由配置，仅有首页BSC查询页面
    - views
        - BscAddressQueryView.vue // 主要页面，包含BSC地址输入、查询、表格展示、获取积分
- vite.config.js
```

### 主要页面说明
- BscAddressQueryView.vue：
  - 输入BSC地址，点击搜索后展示该地址每天的交易笔数、总交易量，并可为每一天获取积分。
  - 表格字段：日期、交易笔数、总交易量、获取积分按钮。
  - 目前数据为模拟，后续可对接后端API。