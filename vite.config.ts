import {defineConfig, UserConfigExport} from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import Compression from 'vite-compression-plugin'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'

const config: UserConfigExport = ({command, mode, ssrBuild}) => ({
        plugins: [
            vue(),
            vueSetupExtend(),
            AutoImport({
                resolvers: [ElementPlusResolver()],
            }),
            Components({
                resolvers: [ElementPlusResolver()],
            }),
            Compression({
                algorithm: 'gzip',
                deleteOriginalAssets: false
            }),
        ],
        optimizeDeps: {
            exclude: ['@smallwei/avue > vue']
        },
        resolve: {
            alias: {
                '~': resolve(__dirname, './'),
                '@': resolve(__dirname, './src')
            }
        },
        server: {
            host: '0.0.0.0',
            port: 80,
            proxy: {
                '^/api/.*': {
                    target: 'http://localhost:8080',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ''),
                }
            }
        },
        build: {
            sourcemap: mode === 'development'
        }
    }
)

export default defineConfig(config)
