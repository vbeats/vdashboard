import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import Compression from 'vite-compression-plugin'

export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
        Compression({
            algorithm: 'gzip',
            deleteOriginalAssets: false
        })
    ],
    optimizeDeps: {
        exclude: ['@smallwei/avue > vue']
    }
})
