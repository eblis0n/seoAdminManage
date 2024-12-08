整个 项目所使用的技术 框架： Vue3 + Vite + TypeScript5+ Element-Plus

1、 划分好目录文件架构
src ----|
-- api 接口相关
--router 路由
-- utils 工具类
-- views 页面代码
-- lang 语言文件
--assets ---｜
-- style css

2、安装基础依赖

# 如果发生 Conflicting peer dependency,则 npm install xxx --legacy-peer-deps 或者 npm install xxx --force 强制安装

# 安装项目所需依赖

npm install

# 国际化，多语言

npm install vue-i18n --legacy-peer-deps
npm install @intlify/unplugin-vue-i18n --legacy-peer-deps
npm install @intlify/vite-plugin-vue-i18n --legacy-peer-deps

# 用 axios 发送网络请求

npm install axios --legacy-peer-deps

# 自动导入 vue3 相关函数

npm i unplugin-auto-import -D --legacy-peer-deps

# 自动导入 Element Plus 相关函数(components.d.ts)

npm i unplugin-vue-components --legacy-peer-deps

# icons

npm i unplugin-icons --legacy-peer-deps

# 路由

npm install vue-router@4 --legacy-peer-deps

# node 声明

npm i @types/node -D

# 开发插件

npm i vite-plugin-style-import -D

#

npm install element-plus --save --legacy-peer-deps
npm install @element-plus/icons-vue --legacy-peer-deps

#css 预处理器 sass（看习惯）
npm install -D sass sass-loader --legacy-peer-deps

# 状态管理，类似 vue2 中的 vuex

npm install pinia --legacy-peer-deps

# mockjs 实现获取回调函数，并实现返回值的响应式

npm install mockjs --legacy-peer-deps


## 插件安装

npm install xlsx --legacy-peer-deps
## 复制

npm install vue-clipboard3 --legacy-peer-deps
npm install --save-dev @types/vue-clipboard3


3、 vite.config.ts 配置

4、 修改 tsconfig.json

5、 修改 main.ts

1、main.js 中引入 vue-i18n

    import i18n from "./lang/index"
    const app = createApp(App);

    app.use(i18n);
    app.mount('#app')

6、环境变量配置
完整的环境变量配置文件.env.production 和.env.development

项目根目录的 development 文件内容如下:

# 开发环境

VITE_APP_TITLE = "AUTObackground_test"

# 端口号

VITE_APP_PORT = "5173"

# 请求接口

VITE_APP_DEV_URL = "http://localhost:5173"

# 前缀

VITE_APP_BASE_API = "/api"

项目根目录下的 production 文件内容如下:

# 线上环境

VITE_APP_TITLE = "AUTObackground"

# 端口号

VITE_APP_PORT = "5173"

# 请求接口

VITE_APP_DEV_URL = "http://localhost:5173"

# 前缀

VITE_APP_BASE_API = "/api"

7、其他

自动导入 vue3 相关函数(auto-imports.d.ts)

自动导入 Element Plus 相关函数(components.d.ts)
