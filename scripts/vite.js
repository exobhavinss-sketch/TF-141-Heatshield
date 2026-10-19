import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

// Prioritize dedicated environment if present, otherwise fall back to local/standard Vite
const envVite = 'E:/heatshield_env/node_modules/vite/bin/vite.js';
const localVite = path.resolve('node_modules/vite/bin/vite.js');

let viteBin = 'vite';
if (fs.existsSync(envVite)) {
  viteBin = envVite;
} else if (fs.existsSync(localVite)) {
  viteBin = localVite;
}

const child = spawn(process.execPath, [viteBin, ...process.argv.slice(2)], {
  stdio: 'inherit'
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
