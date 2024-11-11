import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { UserConfig, ConfigEnv, loadEnv, defineConfig } from "vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import mockDevServerPlugin from "vite-plugin-mock-dev-server";
import UnoCSS from "unocss/vite";
import { presetIcons } from "unocss";
import { resolve } from "path";
import {
  name,
  version,
  engines,
  dependencies,
  devDependencies,
} from "./package.json";

import VueDevTools from "vite-plugin-vue-devtools";

// Platform info based on package.json
const __APP_INFO__ = {
  pkg: { name, version, engines, dependencies, devDependencies },
  buildTimestamp: Date.now(),
};

const pathSrc = resolve(__dirname, "src");

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd());
  console.log("Loaded env:", env); // 打印环境变量查看是否加载

  return {
    resolve: {
      alias: {
        "@": pathSrc,
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: `
            @use "@/styles/variables.scss" as *;
          `,
        },
      },
    },
    server: {
      host: "0.0.0.0",
      port: Number(env.VITE_PORT), // Dynamically use the port defined in .env
      open: true,
      proxy: {
        "^/api": {
          target: env.VITE_BASE_API, // Proxy API requests
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    plugins: [
      vue(),
      vueJsx(),
      env.VITE_MOCK_DEV_SERVER === "true" ? mockDevServerPlugin() : null,
      UnoCSS({
        // 移除 hmrTopLevelAwait: false 配置
        // 因为这个配置在新版本中可能不再需要
      }),
      AutoImport({
        imports: ["vue", "@vueuse/core", "pinia", "vue-router", "vue-i18n"],
        resolvers: [ElementPlusResolver({ importStyle: "sass" })],
        eslintrc: {
          enabled: false,
          filepath: "./.eslintrc-auto-import.json",
          globalsPropValue: true,
        },
        vueTemplate: true,
        dts: false,
      }),
      Components({
        resolvers: [ElementPlusResolver({ importStyle: "sass" })],
        dirs: ["src/components", "src/**/components"],
        dts: false,
      }),
      createSvgIconsPlugin({
        iconDirs: [resolve(pathSrc, "assets/icons")],
        symbolId: "icon-[dir]-[name]",
      }),
      VueDevTools(),
    ],
    optimizeDeps: {
      include: [
        "jsoneditor",
        "vue",
        "vue-router",
        "pinia",
        "axios",
        "@vueuse/core",
        "sortablejs",
        "exceljs",
        "path-to-regexp",
        "echarts",
        "@wangeditor/editor",
        "@wangeditor/editor-for-vue",
        "vue-i18n",
        "path-browserify",
        "element-plus/es/components/form/style/index",
        "element-plus/es/components/form-item/style/index",
        "element-plus/es/components/button/style/index",
      ],
    },
    build: {
      chunkSizeWarningLimit: 2000,
      minify: "terser",
      terserOptions: {
        compress: {
          keep_infinity: true,
          drop_console: true,
          drop_debugger: true,
        },
        format: {
          comments: false,
        },
      },
      rollupOptions: {
        output: {
          entryFileNames: "js/[name].[hash].js",
          chunkFileNames: "js/[name].[hash].js",
          assetFileNames: (assetInfo: any) => {
            const info = assetInfo.name.split(".");
            let extType = info[info.length - 1];
            if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)/i.test(assetInfo.name)) {
              extType = "media";
            } else if (/\.(png|jpe?g|gif|svg)/i.test(assetInfo.name)) {
              extType = "img";
            } else if (/\.(woff2?|eot|ttf|otf)/i.test(assetInfo.name)) {
              extType = "fonts";
            } else if (/\.(css|less|scss)/i.test(assetInfo.name)) {
              extType = "style";
            }
            return `assets/${extType}/[name].[hash][extname]`;
          },
        },
      },
    },
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
  };
});
