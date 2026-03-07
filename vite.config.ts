import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        host: true, // Listen on all local IPs
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true,
            }
        }
    }
});
