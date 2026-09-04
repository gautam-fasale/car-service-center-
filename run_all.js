const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('=======================================================');
console.log('🚗 Starting CarServ Full-Stack Application');
console.log('=======================================================');

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

const backendDir = path.join(__dirname, 'backend');
const frontendDir = path.join(__dirname, 'frontend');

// 1. Ensure backend .env exists
const envPath = path.join(backendDir, '.env');
if (!fs.existsSync(envPath)) {
  console.log('[Setup] Creating default backend .env file...');
  fs.writeFileSync(
    envPath,
    `PORT=5000\nDB_HOST=localhost\nDB_PORT=3306\nDB_USER=root\nDB_PASSWORD=root\nDB_NAME=carserv_db\nJWT_SECRET=carserv_super_secret_jwt_key_2026\n`
  );
}

// 2. Auto-install backend dependencies if missing
if (!fs.existsSync(path.join(backendDir, 'node_modules'))) {
  console.log('[Setup] First time setup: Installing Backend dependencies...');
  try {
    execSync(`${npmCmd} install`, { cwd: backendDir, stdio: 'inherit' });
    console.log('[Setup] Backend dependencies installed successfully.');
  } catch (e) {
    console.error('[Setup] Failed to install backend dependencies:', e.message);
  }
}

// 3. Auto-install frontend dependencies if missing
if (!fs.existsSync(path.join(frontendDir, 'node_modules'))) {
  console.log('[Setup] First time setup: Installing Frontend dependencies...');
  try {
    execSync(`${npmCmd} install`, { cwd: frontendDir, stdio: 'inherit' });
    console.log('[Setup] Frontend dependencies installed successfully.');
  } catch (e) {
    console.error('[Setup] Failed to install frontend dependencies:', e.message);
  }
}

// 4. Start Backend Server
console.log('[Runner] Launching Backend Server on port 5000...');
const backend = spawn(npmCmd, ['start'], {
  cwd: backendDir,
  stdio: 'inherit',
  shell: true
});

backend.on('error', (err) => {
  console.error('[Error] Failed to start backend:', err);
});

// 5. Start Frontend App
console.log('[Runner] Launching Frontend App on port 3000...');
const frontend = spawn(npmCmd, ['run', 'dev'], {
  cwd: frontendDir,
  stdio: 'inherit',
  shell: true
});

frontend.on('error', (err) => {
  console.error('[Error] Failed to start frontend:', err);
});

process.on('SIGINT', () => {
  backend.kill();
  frontend.kill();
  process.exit();
});
