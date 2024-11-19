import { defineConfig } from 'vite';

export default defineConfig({
    base: '/tm-demo/',
    build: {
        outDir: './dist',
        minify: false,
    },
    server: {
        watch: {
          usePolling: true
        }
    }
});
