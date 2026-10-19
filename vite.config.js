import { defineConfig } from 'file:///E:/heatshield_env/node_modules/vite/dist/node/index.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const req = createRequire('E:/heatshield_env/package.json');
const react = req('@vitejs/plugin-react');
const tailwindcss = req('tailwindcss');
const autoprefixer = req('autoprefixer');

export default defineConfig({
  root: __dirname,
  cacheDir: 'E:/heatshield_env/.vite_cache',
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'react': 'E:/heatshield_env/node_modules/react',
      'react-dom': 'E:/heatshield_env/node_modules/react-dom',
      'react-dom/client': 'E:/heatshield_env/node_modules/react-dom/client.js',
      'react/jsx-runtime': 'E:/heatshield_env/node_modules/react/jsx-runtime.js',
      'react/jsx-dev-runtime': 'E:/heatshield_env/node_modules/react/jsx-dev-runtime.js',
      'react-router-dom': 'E:/heatshield_env/node_modules/react-router-dom',
      'lucide-react': 'E:/heatshield_env/node_modules/lucide-react',
      'recharts': 'E:/heatshield_env/node_modules/recharts',
      'leaflet': 'E:/heatshield_env/node_modules/leaflet',
      'react-leaflet': 'E:/heatshield_env/node_modules/react-leaflet',
      'clsx': 'E:/heatshield_env/node_modules/clsx',
      'tailwind-merge': 'E:/heatshield_env/node_modules/tailwind-merge'
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react-router-dom',
      'lucide-react',
      'recharts',
      'leaflet',
      'react-leaflet',
      'clsx',
      'tailwind-merge'
    ]
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss({ config: path.resolve(__dirname, 'tailwind.config.js') }),
        autoprefixer()
      ]
    }
  },
  server: {
    port: 3000,
    open: false,
    fs: {
      allow: [__dirname, 'E:/heatshield_env']
    }
  },
  preview: {
    port: 3000,
    open: false
  }
});
