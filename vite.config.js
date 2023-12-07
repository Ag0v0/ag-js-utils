import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 8080, // 服务端口号
    open: true, // 服务启动时是否自动打开浏览器
  },
  build: {
    outDir: "dist", //输出文件名称
    /** 分包大小 */
    chunkSizeWarningLimit: 800,
    lib: {
      entry: fileURLToPath(new URL("./package/index.js", import.meta.url)), //指定组件编译入口文件
      name: "js-utils",
      fileName: "index",
    }, //库编译模式配置
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: [],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {},
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
  },
});
