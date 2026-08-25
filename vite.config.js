import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Default external backend port (e.g. 5000 or custom port)
  let backendTarget = env.BACKEND_PROXY_URL || env.VITE_BACKEND_URL || 'http://localhost:5000';
  
  // Guard against self-proxy loop (Vite itself runs on port 3000)
  if (backendTarget.includes(':3000') || backendTarget === 'http://localhost:3000' || backendTarget === 'http://127.0.0.1:3000') {
    backendTarget = 'http://localhost:5000';
  }

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      proxy: {
        '/api': {
          target: backendTarget,
          changeOrigin: true,
          secure: false,
          configure: (proxy) => {
            proxy.on('error', (err, _req, res) => {
              if (res && !res.headersSent) {
                res.writeHead(502, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                  success: false,
                  message: `خطا در اتصال به بک‌اند (${backendTarget}). لطفاً مطمئن شوید سرور بک‌اند شما روی پورت ۵۰۰۰ یا آدرس مشخص شده در حال اجراست.`
                }));
              }
            });
          }
        }
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: false
    }
  };
});
