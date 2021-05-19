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
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    if (id.includes('node_modules')) {
                        let name = ''
                        if (id.includes('lodash')) {
                            name = 'lodash'
                        } else if (id.includes('ant-design')) {
                            name = 'ant-design'
                        } else if (id.includes('dayjs')) {
                            name = 'dayjs'
                        } else {
                            name = 'vendor'
                        }
                        return name
                    }
                }
            }
        }
    }
})
