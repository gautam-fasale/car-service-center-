const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('=======================================================');
console.log('🚗 Starting CarServ Full-Stack Application');
console.log('=======================================================');

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

// 1. Locate backend and frontend directories dynamically
let backendDir = path.join(__dirname, 'backend');
let frontendDir = path.join(__dirname, 'frontend');

if (!fs.existsSync(backendDir) && fs.existsSync(path.join(__dirname, 'car-service-center--main', 'backend'))) {
  backendDir = path.join(__dirname, 'car-service-center--main', 'backend');
  frontendDir = path.join(__dirname, 'car-service-center--main', 'frontend');
}

// 2. Kill any lingering processes on port 5000 or 3000 to prevent EADDRINUSE errors
if (isWin) {
  try {
    execSync(
      'powershell -Command "Get-NetTCPConnection -LocalPort 5000,3000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"',
      { stdio: 'ignore' }
    );
  } catch (e) {
    // Ignore if no lingering process
  }
}

// 3. Ensure backend .env exists
const envPath = path.join(backendDir, '.env');
if (!fs.existsSync(envPath)) {
  console.log('[Setup] Creating default backend .env file...');
  fs.writeFileSync(
    envPath,
    `PORT=5000\nDB_HOST=localhost\nDB_PORT=3306\nDB_USER=root\nDB_PASSWORD=root\nDB_NAME=carserv_db\nJWT_SECRET=carserv_super_secret_jwt_key_2026\n`
  );
}

// 4. Auto-install backend dependencies if missing
if (!fs.existsSync(path.join(backendDir, 'node_modules'))) {
  console.log('[Setup] First-time setup: Installing Backend dependencies...');
  try {
    execSync(`${npmCmd} install`, { cwd: backendDir, stdio: 'inherit' });
    console.log('[Setup] Backend dependencies installed.');
  } catch (e) {
    console.error('[Setup] Failed to install backend dependencies:', e.message);
  }
}

// 5. Auto-install frontend dependencies if missing
if (!fs.existsSync(path.join(frontendDir, 'node_modules'))) {
  console.log('[Setup] First-time setup: Installing Frontend dependencies...');
  try {
    execSync(`${npmCmd} install`, { cwd: frontendDir, stdio: 'inherit' });
    console.log('[Setup] Frontend dependencies installed.');
  } catch (e) {
    console.error('[Setup] Failed to install frontend dependencies:', e.message);
  }
}

// 6. Start Backend Server
console.log('[Runner] Launching Backend Server on http://localhost:5000...');
const backend = spawn(npmCmd, ['start'], {
  cwd: backendDir,
  stdio: 'inherit',
  shell: true
});

backend.on('error', (err) => {
  console.error('[Error] Failed to start backend:', err);
});

// 7. Start Frontend App
console.log('[Runner] Launching Frontend App on http://localhost:3000...');
const frontend = spawn(npmCmd, ['run', 'dev'], {
  cwd: frontendDir,
  stdio: 'inherit',
  shell: true
});

frontend.on('error', (err) => {
  console.error('[Error] Failed to start frontend:', err);
});

// 8. Auto-open browser after 2 seconds
setTimeout(() => {
  if (isWin) {
    spawn('powershell', ['-Command', 'Start-Process "http://localhost:3000"'], { stdio: 'ignore' });
  }
}, 2500);

process.on('SIGINT', () => {
  backend.kill();
  frontend.kill();
  process.exit();
});
