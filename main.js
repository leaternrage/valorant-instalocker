const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const https = require('https');

let axios;
let mainWindow;
let axiosInstance;

const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

async function initAxios() {
  try {
    axios = require('axios');
    axiosInstance = axios.create({
      httpsAgent,
      timeout: 10000
    });
    console.log('Axios initialized');
  } catch (error) {
    console.error('Axios error:', error);
    axiosInstance = null;
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1500,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    backgroundColor: '#0f1219',
    autoHideMenuBar: true
  });

  mainWindow.loadFile('index.html');
  // mainWindow.webContents.openDevTools(); // KALDIRILDI
}

app.whenReady().then(async () => {
  await initAxios();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle('read-lockfile', async () => {
  try {
    const lockfilePath = path.join(
      os.homedir(),
      'AppData', 'Local', 'Riot Games', 'Riot Client', 'Config', 'lockfile'
    );

    if (!fs.existsSync(lockfilePath)) {
      return { success: false, error: 'Valorant not found!' };
    }

    const content = fs.readFileSync(lockfilePath, 'utf-8');
    return { success: true, content };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('check-valorant', async () => {
  try {
    const lockfilePath = path.join(
      os.homedir(),
      'AppData', 'Local', 'Riot Games', 'Riot Client', 'Config', 'lockfile'
    );
    
    const exists = fs.existsSync(lockfilePath);
    
    if (exists) {
      try {
        const content = fs.readFileSync(lockfilePath, 'utf-8');
        return content && content.length > 0;
      } catch (err) {
        return false;
      }
    }
    
    return false;
  } catch (error) {
    return false;
  }
});

ipcMain.handle('api-get-auth', async (event, port, password) => {
  try {
    if (!axiosInstance) {
      return { success: false, error: 'Axios not initialized' };
    }

    const url = `https://127.0.0.1:${port}/entitlements/v1/token`;
    const auth = Buffer.from(`riot:${password}`).toString('base64');

    const response = await axiosInstance.get(url, {
      headers: { 'Authorization': `Basic ${auth}` }
    });

    return {
      success: true,
      accessToken: response.data.accessToken,
      entitlement: response.data.token
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('api-get-puuid', async (event, port, password) => {
  try {
    if (!axiosInstance) {
      return { success: false, error: 'Axios not initialized' };
    }

    const url = `https://127.0.0.1:${port}/chat/v1/session`;
    const auth = Buffer.from(`riot:${password}`).toString('base64');

    const response = await axiosInstance.get(url, {
      headers: { 'Authorization': `Basic ${auth}` }
    });

    return {
      success: true,
      puuid: response.data.puuid
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('api-check-pregame', async (event, region, shard, puuid, accessToken, entitlement) => {
  try {
    if (!axiosInstance) {
      return { success: false, error: 'Axios not initialized' };
    }

    const url = `https://glz-${region}-1.${shard}.a.pvp.net/pregame/v1/players/${puuid}`;

    const response = await axiosInstance.get(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Riot-Entitlements-JWT': entitlement,
        'X-Riot-ClientVersion': 'release-09.11-shipping-11-2942675',
        'X-Riot-ClientPlatform': 'ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9'
      }
    });

    if (response.data.MatchID) {
      return { success: true, inPregame: true, matchId: response.data.MatchID };
    }
  } catch (error) {
    if (error.response?.status === 404) {
      return { success: true, inPregame: false, matchId: null };
    }
  }
  return { success: true, inPregame: false, matchId: null };
});

ipcMain.handle('api-lock-agent', async (event, region, shard, matchId, agentUUID, accessToken, entitlement) => {
  try {
    if (!axiosInstance) {
      return { success: false, error: 'Axios not initialized' };
    }

    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'X-Riot-Entitlements-JWT': entitlement,
      'X-Riot-ClientVersion': 'release-09.11-shipping-11-2942675',
      'X-Riot-ClientPlatform': 'ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9',
      'Content-Type': 'application/json'
    };

    const selectUrl = `https://glz-${region}-1.${shard}.a.pvp.net/pregame/v1/matches/${matchId}/select/${agentUUID}`;
    await axiosInstance.post(selectUrl, {}, { headers });

    await new Promise(resolve => setTimeout(resolve, 50));

    const lockUrl = `https://glz-${region}-1.${shard}.a.pvp.net/pregame/v1/matches/${matchId}/lock/${agentUUID}`;
    await axiosInstance.post(lockUrl, {}, { headers });

    return { success: true, locked: true };
  } catch (error) {
    if (error.response?.status === 403) {
      return { success: true, locked: true };
    }
    return { success: false, error: error.message };
  }
});

ipcMain.handle('api-check-locked', async (event, region, shard, matchId, puuid, agentUUID, accessToken, entitlement) => {
  try {
    if (!axiosInstance) {
      return { success: false, error: 'Axios not initialized' };
    }

    const url = `https://glz-${region}-1.${shard}.a.pvp.net/pregame/v1/matches/${matchId}`;

    const response = await axiosInstance.get(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Riot-Entitlements-JWT': entitlement,
        'X-Riot-ClientVersion': 'release-09.11-shipping-11-2942675',
        'X-Riot-ClientPlatform': 'ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9'
      }
    });

    const players = response.data.AllyTeam?.Players || [];
    const player = players.find(p => p.Subject === puuid);

    const isLocked = player?.CharacterID === agentUUID && player?.CharacterSelectionState === 'locked';
    return { success: true, locked: isLocked };
  } catch (error) {
    return { success: false, error: error.message };
  }
});