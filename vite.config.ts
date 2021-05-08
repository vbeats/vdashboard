import * as path from 'path'
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    plugins: [
        vue(),
        tsconfigPaths(),
    ],
    optimizeDeps: {},
    resolve: {
        alias: [
            {find: '@', replacement: path.resolve(__dirname, 'src')}
        ]
    },
    server: {
        port: 80,
        cors: true
    }
})
