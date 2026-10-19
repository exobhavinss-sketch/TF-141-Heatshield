import { createRequire } from 'module';
import path from 'path';

let tailwindcss, autoprefixer;
try {
  tailwindcss = (await import('tailwindcss')).default;
  autoprefixer = (await import('autoprefixer')).default;
} catch (e) {
  const req = createRequire('E:/heatshield_env/package.json');
  tailwindcss = req('tailwindcss');
  autoprefixer = req('autoprefixer');
}

export default {
  plugins: [
    tailwindcss,
    autoprefixer,
  ],
};
