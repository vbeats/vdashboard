import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import Compression from 'vite-compression-plugin'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'

export default defineConfig({
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
    }
})
