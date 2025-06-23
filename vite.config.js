import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import Components from 'unplugin-vue-components/vite'
import {PrimeVueResolver} from '@primevue/auto-import-resolver'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(), vueDevTools(), tailwindcss(),
        Components({
            resolvers: [PrimeVueResolver()]
        })
    ],
    build: {
        emptyOutDir: true,
        chunkSizeWarningLimit: 900,
        rollupOptions: {
            output: {
                manualChunks: {
                    'wharfkit': ['@wharfkit/antelope', '@wharfkit/contract', '@wharfkit/signing-request', '@wharfkit/abicache', '@wharfkit/account', 'pako'],
                    'vue': ['vue', 'vue-router'],
                    'gui': ['primevue', 'tailwindcss-primeui', 'tailwindcss', '@primeuix/themes']
                }
            }
        },
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6',
        },
    },
    define: {
        global: 'globalThis'
    },
    server: {
        host: true
    }
})
