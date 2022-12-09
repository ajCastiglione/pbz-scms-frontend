import fs from "fs/promises";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import svgrPlugin from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        port: 3000,
    },
    plugins: [react(), viteTsconfigPaths(), svgrPlugin()],
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
    },
    esbuild: {
        loader: "jsx",
        jsxFactory: "h",
        include: /src\/((?!type=template).)*\.jsx?$/,
    },
    optimizeDeps: {
        esbuildOptions: {
            loader: {
                ".js": "jsx",
                ".ts": "tsx",
            },
        },
    },
});
