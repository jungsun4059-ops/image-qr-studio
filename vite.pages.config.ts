import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {resolve} from 'node:path';
export default defineConfig({
 root:resolve('github-pages'),base:'/image-qr-studio/',publicDir:resolve('public'),plugins:[react()],
 css:{postcss:resolve('.')},
 build:{outDir:resolve('docs'),emptyOutDir:true,rollupOptions:{input:{main:resolve('github-pages/index.html'),transfer:resolve('github-pages/transfer/index.html'),image:resolve('github-pages/image/index.html')}}}
});
