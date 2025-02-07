import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import rollupPolyfills from 'rollup-plugin-node-polyfills';

// Vite configuration
export default defineConfig({
    plugins: [
        react(),
    ],
    resolve: {
        alias: {
            util: 'rollup-plugin-node-polyfills/polyfills/util',
            events: 'rollup-plugin-node-polyfills/polyfills/events',
            process: 'rollup-plugin-node-polyfills/polyfills/process-es6', // Polyfill process
        },
    },
    optimizeDeps: {
        esbuildOptions: {
            define: {
                global: 'window', // Polyfill global to window for browser compatibility
            },
            plugins: [NodeGlobalsPolyfillPlugin()],
        },
    },
    build: {
        rollupOptions: {
            plugins: [rollupPolyfills()],
        },
    },
});