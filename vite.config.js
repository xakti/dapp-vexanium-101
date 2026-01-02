import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import Components from 'unplugin-vue-components/vite'
import {PrimeVueResolver} from '@primevue/auto-import-resolver'
import {VitePWA} from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(), vueDevTools(), tailwindcss(),
        Components({resolvers: [PrimeVueResolver()]}),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['pwa-64x64.png'],
            manifest: {
                name: 'Xakti - DApp Vexanium 101',
                short_name: 'Xakti DApp',
                start_url: '/',
                display: 'standalone',
                background_color: '#e0f7fa',
                theme_color: '#e0f7fa',
                icons: [
                    {
                        "src": "pwa-64x64.png",
                        "sizes": "64x64",
                        "type": "image/png"
                    },
                    {
                        "src": "pwa-192x192.png",
                        "sizes": "192x192",
                        "type": "image/png"
                    },
                    {
                        "src": "pwa-512x512.png",
                        "sizes": "512x512",
                        "type": "image/png"
                    },
                    {
                        "src": "maskable-icon-512x512.png",
                        "sizes": "512x512",
                        "type": "image/png",
                        "purpose": "maskable"
                    }
                ],
            }
        })
    ],
    build: {
        emptyOutDir: true,
        chunkSizeWarningLimit: 900,
        rollupOptions: {
            output: {
                manualChunks: {
                    'wharfkit': ['@wharfkit/antelope', '@wharfkit/signing-request', '@wharfkit/abicache', 'pako'],
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
