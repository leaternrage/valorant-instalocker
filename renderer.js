if (typeof window === 'undefined' || typeof document === 'undefined') {
  console.error('This script must run in renderer process');
} else {

const { ipcRenderer } = require('electron');

const AgentUUIDs = {
  'jett': 'add6443a-41bd-e414-f6ad-e58d267f4e95',
  'reyna': 'a3bfb853-43b2-7238-a4f1-ad90e9e46bcc',
  'raze': 'f94c3b30-42be-e959-889c-5aa313dba261',
  'phoenix': 'eb93336a-449b-9c1b-0a54-a891f7921d69',
  'yoru': '7f94d92c-4234-0a36-9646-3a87eb8b5c89',
  'neon': 'bb2a4828-46eb-8cd1-e765-15848195d751',
  'iso': '0e38b510-41a8-5780-5e8f-568b2a4f2d6c',
  'sage': '569fdd95-4d10-43ab-ca70-79becc718b46',
  'killjoy': '1e58de9c-4950-5125-93e9-a0aee9f98746',
  'cypher': '117ed9e3-49f3-6512-3ccf-0cada7e3823b',
  'chamber': '22697a3d-45bf-8dd7-4fec-84a9e28c69d7',
  'deadlock': 'cc8b64c8-4b25-4ff9-6e7f-37b4da43d235',
  'vyse': 'efba5359-4016-a1e5-7626-b1ae76895940',
  'waylay': 'df1cb487-4902-002e-5c17-d28e83e78588',
  'sova': '320b2a48-4d9b-a075-30f1-1f93a9b638fa',
  'breach': '5f8d3a7f-467b-97f3-062c-13acf203c006',
  'skye': '6f2a04ca-43e0-be17-7f36-b3908627744d',
  'kayo': '601dbbe7-43ce-be57-2a40-4abd24953621',
  'fade': 'dade69b4-4f5a-8528-247b-219e5a1facd6',
  'gekko': 'e370fa57-4757-3604-3648-499e1f642d3f',
  'tejo': 'b444168c-4e35-8076-db47-ef9bf368f384',
  'veto': '92eeef5d-43b5-1d4a-8d03-b3927a09034b',
  'brimstone': '9f0d8ba9-4140-b941-57d3-a7ad57c6b417',
  'omen': '8e253930-4c05-31dd-1b6c-968525494517',
  'viper': '707eab51-4836-f488-046a-cda6bf494859',
  'astra': '41fb69c1-4189-7b37-f117-bcaf1e96f1bf',
  'harbor': '95b78ed7-4637-86d9-7e41-71ba8c293152',
  'clove': '1dbf2edd-4729-0984-3115-daa5eed44993'
};

const AgentRoles = {
  'jett': 'Duelist', 'reyna': 'Duelist', 'raze': 'Duelist', 'phoenix': 'Duelist',
  'yoru': 'Duelist', 'neon': 'Duelist', 'iso': 'Duelist',
  'sova': 'Initiator', 'breach': 'Initiator', 'skye': 'Initiator', 'kayo': 'Initiator',
  'fade': 'Initiator', 'gekko': 'Initiator', 'tejo': 'Initiator', 'veto': 'Initiator',
  'brimstone': 'Controller', 'omen': 'Controller', 'viper': 'Controller',
  'astra': 'Controller', 'harbor': 'Controller', 'clove': 'Controller',
  'sage': 'Sentinel', 'killjoy': 'Sentinel', 'cypher': 'Sentinel',
  'chamber': 'Sentinel', 'deadlock': 'Sentinel', 'vyse': 'Sentinel', 'waylay': 'Sentinel'
};

const agents = [
  { name: 'Jett', role: 'duelist', image: 'https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/displayicon.png' },
  { name: 'Reyna', role: 'duelist', image: 'https://media.valorant-api.com/agents/a3bfb853-43b2-7238-a4f1-ad90e9e46bcc/displayicon.png' },
  { name: 'Raze', role: 'duelist', image: 'https://media.valorant-api.com/agents/f94c3b30-42be-e959-889c-5aa313dba261/displayicon.png' },
  { name: 'Phoenix', role: 'duelist', image: 'https://media.valorant-api.com/agents/eb93336a-449b-9c1b-0a54-a891f7921d69/displayicon.png' },
  { name: 'Yoru', role: 'duelist', image: 'https://media.valorant-api.com/agents/7f94d92c-4234-0a36-9646-3a87eb8b5c89/displayicon.png' },
  { name: 'Neon', role: 'duelist', image: 'https://media.valorant-api.com/agents/bb2a4828-46eb-8cd1-e765-15848195d751/displayicon.png' },
  { name: 'Iso', role: 'duelist', image: 'https://media.valorant-api.com/agents/0e38b510-41a8-5780-5e8f-568b2a4f2d6c/displayicon.png' },
  { name: 'Sage', role: 'sentinel', image: 'https://media.valorant-api.com/agents/569fdd95-4d10-43ab-ca70-79becc718b46/displayicon.png' },
  { name: 'Killjoy', role: 'sentinel', image: 'https://media.valorant-api.com/agents/1e58de9c-4950-5125-93e9-a0aee9f98746/displayicon.png' },
  { name: 'Cypher', role: 'sentinel', image: 'https://media.valorant-api.com/agents/117ed9e3-49f3-6512-3ccf-0cada7e3823b/displayicon.png' },
  { name: 'Chamber', role: 'sentinel', image: 'https://media.valorant-api.com/agents/22697a3d-45bf-8dd7-4fec-84a9e28c69d7/displayicon.png' },
  { name: 'Deadlock', role: 'sentinel', image: 'https://media.valorant-api.com/agents/cc8b64c8-4b25-4ff9-6e7f-37b4da43d235/displayicon.png' },
  { name: 'Vyse', role: 'sentinel', image: 'https://media.valorant-api.com/agents/efba5359-4016-a1e5-7626-b1ae76895940/displayicon.png' },
  { name: 'Waylay', role: 'sentinel', image: 'https://media.valorant-api.com/agents/df1cb487-4902-002e-5c17-d28e83e78588/fullportrait.png' },
  { name: 'Sova', role: 'initiator', image: 'https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/displayicon.png' },
  { name: 'Breach', role: 'initiator', image: 'https://media.valorant-api.com/agents/5f8d3a7f-467b-97f3-062c-13acf203c006/displayicon.png' },
  { name: 'Skye', role: 'initiator', image: 'https://media.valorant-api.com/agents/6f2a04ca-43e0-be17-7f36-b3908627744d/displayicon.png' },
  { name: 'KAYO', role: 'initiator', image: 'https://media.valorant-api.com/agents/601dbbe7-43ce-be57-2a40-4abd24953621/displayicon.png' },
  { name: 'Fade', role: 'initiator', image: 'https://media.valorant-api.com/agents/dade69b4-4f5a-8528-247b-219e5a1facd6/displayicon.png' },
  { name: 'Gekko', role: 'initiator', image: 'https://media.valorant-api.com/agents/e370fa57-4757-3604-3648-499e1f642d3f/displayicon.png' },
  { name: 'Tejo', role: 'initiator', image: 'https://media.valorant-api.com/agents/b444168c-4e35-8076-db47-ef9bf368f384/displayicon.png' },
  { name: 'Veto', role: 'initiator', image: 'https://media.valorant-api.com/agents/92eeef5d-43b5-1d4a-8d03-b3927a09034b/displayicon.png' },
  { name: 'Brimstone', role: 'controller', image: 'https://media.valorant-api.com/agents/9f0d8ba9-4140-b941-57d3-a7ad57c6b417/displayicon.png' },
  { name: 'Omen', role: 'controller', image: 'https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b6c-968525494517/displayicon.png' },
  { name: 'Viper', role: 'controller', image: 'https://media.valorant-api.com/agents/707eab51-4836-f488-046a-cda6bf494859/displayicon.png' },
  { name: 'Astra', role: 'controller', image: 'https://media.valorant-api.com/agents/41fb69c1-4189-7b37-f117-bcaf1e96f1bf/displayicon.png' },
  { name: 'Harbor', role: 'controller', image: 'https://media.valorant-api.com/agents/95b78ed7-4637-86d9-7e41-71ba8c293152/displayicon.png' },
  { name: 'Clove', role: 'controller', image: 'https://media.valorant-api.com/agents/1dbf2edd-4729-0984-3115-daa5eed44993/displayicon.png' }
];

let selectedAgent = null;
let isRunning = false;
let isConnected = false;
let lastConnectionState = false;
let currentMatchId = null;

let apiState = {
  port: null,
  password: null,
  puuid: null,
  accessToken: null,
  entitlement: null,
  region: 'eu',
  shard: 'eu'
};

function addLog(msg, color = '#cad2e6') {
  const log = document.getElementById('txtLog');
  if (!log) return;
  const time = new Date().toLocaleTimeString('tr-TR');
  const entry = document.createElement('div');
  entry.style.color = color;
  entry.style.marginBottom = '8px';
  entry.innerHTML = `<span style="color: #646e82">[${time}]</span> ${msg}`;
  log.appendChild(entry);
  log.scrollTop = log.scrollHeight;
}

function updateConnectionStatus(connected) {
  const status = document.getElementById('lblStatus');
  const region = document.getElementById('lblRegion');
  if (!status || !region) return;
  if (connected) {
    status.textContent = 'Connected to VALORANT';
    status.className = 'status-indicator status-connected';
    region.textContent = 'Region: EU';
    region.style.color = '#64ffc8';
  } else {
    status.textContent = 'Could Not Connect to VALORANT';
    status.className = 'status-indicator status-disconnected';
    region.textContent = 'Region: --';
    region.style.color = '#96a0b4';
  }
}

async function checkValorantConnection() {
  try {
    const running = await ipcRenderer.invoke('check-valorant');
    if (running && !isConnected) {
      const lockfile = await ipcRenderer.invoke('read-lockfile');
      if (lockfile.success) {
        const parts = lockfile.content.split(':');
        if (parts.length < 5) {
          if (!lastConnectionState) addLog('❌ Invalid lockfile', '#ff6464');
          return false;
        }
        apiState.port = parts[2];
        apiState.password = parts[3];
        const auth = await ipcRenderer.invoke('api-get-auth', apiState.port, apiState.password);
        if (!auth.success) {
          if (!lastConnectionState) addLog('❌ Failed to auth', '#ff6464');
          return false;
        }
        apiState.accessToken = auth.accessToken;
        apiState.entitlement = auth.entitlement;
        const puuid = await ipcRenderer.invoke('api-get-puuid', apiState.port, apiState.password);
        if (!puuid.success) {
          if (!lastConnectionState) addLog('❌ Failed to get PUUID', '#ff6464');
          return false;
        }
        apiState.puuid = puuid.puuid;
        isConnected = true;
        lastConnectionState = true;
        updateConnectionStatus(true);
        addLog('✅ Connected to VALORANT!', '#64ffb4');
        return true;
      }
    } else if (!running && isConnected) {
      isConnected = false;
      lastConnectionState = false;
      updateConnectionStatus(false);
      addLog('⚠️ VALORANT closed', '#ff6464');
      stopInstalocker();
    }
    return isConnected;
  } catch (e) {
    if (lastConnectionState) addLog(`❌ Error: ${e.message}`, '#ff6464');
    isConnected = false;
    lastConnectionState = false;
    updateConnectionStatus(false);
    return false;
  }
}

function selectAgent(name) {
  selectedAgent = name;
  document.querySelectorAll('[data-agent]').forEach(p => p.classList.remove('selected'));
  const panel = document.querySelector(`[data-agent="${name.toLowerCase().replace('/', '')}"]`);
  if (panel) panel.classList.add('selected');
  const role = AgentRoles[name.toLowerCase()] || 'Unknown';
  const color = getRoleColor(role);
  updateSelectedAgentDisplay(name, role, color);
  document.getElementById('txtLog').innerHTML = '';
  addLog(`Selected: ${name.toUpperCase()}`, color);
  if (isConnected) {
    addLog('Waiting for pregame...', '#cad2e6');
    if (!isRunning) startInstalocker();
  } else {
    addLog('Please open VALORANT', '#ffc864');
  }
}

function updateSelectedAgentDisplay(name, role, color) {
  const disp = document.getElementById('selectedAgentDisplay');
  const img = document.getElementById('selectedAgentImage');
  const nameEl = document.getElementById('selectedAgentName');
  const roleEl = document.getElementById('selectedAgentRole');
  if (!disp || !img || !nameEl || !roleEl) return;
  const agent = agents.find(a => a.name.toLowerCase() === name.toLowerCase());
  if (!agent) return;
  disp.classList.add('active');
  img.innerHTML = `<img src="${agent.image}" alt="${agent.name}">`;
  nameEl.textContent = name.toUpperCase();
  nameEl.style.color = color;
  roleEl.textContent = role.toUpperCase();
  roleEl.style.color = color;
}

function getRoleColor(role) {
  return {
    'Duelist': '#ff6464',
    'Initiator': '#ffc864',
    'Controller': '#9678ff',
    'Sentinel': '#64ffb4'
  }[role] || '#969696';
}

function startInstalocker() {
  if (isRunning || !selectedAgent || !isConnected) return;
  isRunning = true;
  runInstalockLoop();
}

async function runInstalockLoop() {
  let locked = false;
  while (isRunning && isConnected && selectedAgent) {
    try {
      const res = await ipcRenderer.invoke('api-check-pregame', apiState.region, apiState.shard, apiState.puuid, apiState.accessToken, apiState.entitlement);
      if (res.success && res.inPregame && res.matchId) {
        if (locked && res.matchId !== currentMatchId) {
          document.getElementById('txtLog').innerHTML = '';
          addLog('⚠️ GAME DODGED!', '#ffc864');
          addLog('🔄 Restarting...', '#cad2e6');
          currentMatchId = null;
          locked = false;
          await sleep(1000);
        }
        if (res.matchId !== currentMatchId) {
          currentMatchId = res.matchId;
          locked = false;
          document.getElementById('txtLog').innerHTML = '';
          addLog('🎮 MATCH FOUND!', '#ffc864');
          addLog('⚡ Locking agent...', '#cad2e6');
        }
        if (!locked) {
          const uuid = AgentUUIDs[selectedAgent.toLowerCase().replace('/', '')];
          const lock = await ipcRenderer.invoke('api-lock-agent', apiState.region, apiState.shard, currentMatchId, uuid, apiState.accessToken, apiState.entitlement);
          if (lock.success && lock.locked) {
            locked = true;
            const role = AgentRoles[selectedAgent.toLowerCase().replace('/', '')] || 'Unknown';
            const color = getRoleColor(role);
            document.getElementById('txtLog').innerHTML = '';
            addLog('🎯 AGENT LOCKED!', '#64ffb4');
            addLog(selectedAgent.toUpperCase(), color);
          }
          await sleep(100);
        } else {
          const uuid = AgentUUIDs[selectedAgent.toLowerCase().replace('/', '')];
          const check = await ipcRenderer.invoke('api-check-locked', apiState.region, apiState.shard, currentMatchId, apiState.puuid, uuid, apiState.accessToken, apiState.entitlement);
          if (check.success && !check.locked) {
            const relock = await ipcRenderer.invoke('api-lock-agent', apiState.region, apiState.shard, currentMatchId, uuid, apiState.accessToken, apiState.entitlement);
            if (relock.success) addLog('🔄 Agent re-locked!', '#64ffb4');
          }
          await sleep(500);
        }
      } else {
        if (locked) {
          document.getElementById('txtLog').innerHTML = '';
          addLog('🎮 GAME STARTED!', '#64ffb4');
          addLog('🍀 Good luck!', '#ffc864');
          locked = false;
          currentMatchId = null;
        }
        await sleep(500);
      }
    } catch (e) {
      await sleep(1000);
    }
  }
}

function stopInstalocker() {
  isRunning = false;
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function renderAgents(filter = 'all') {
  const grid = document.getElementById('agentGrid');
  if (!grid) return;
  grid.innerHTML = '';
  const filtered = filter === 'all' ? agents : agents.filter(a => a.role === filter);
  filtered.forEach(a => {
    const card = document.createElement('div');
    card.className = 'agent-card';
    card.setAttribute('data-agent', a.name.toLowerCase().replace('/', ''));
    if (selectedAgent && a.name.toLowerCase() === selectedAgent.toLowerCase()) {
      card.classList.add('selected');
    }
    card.innerHTML = `<div class="agent-image"><img src="${a.image}" alt="${a.name}"></div><div class="agent-name">${a.name.toUpperCase()}</div>`;
    grid.appendChild(card);
  });
}

async function initializeApp() {
  renderAgents();
  addLog('Ready...', '#cad2e6');
  updateConnectionStatus(false);
  
  await checkValorantConnection();
  setInterval(checkValorantConnection, 2000);
  
  document.getElementById('agentGrid').addEventListener('click', (e) => {
    const card = e.target.closest('[data-agent]');
    if (card) selectAgent(card.dataset.agent);
  });
  
  document.querySelectorAll('.role-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderAgents(tab.dataset.role);
    });
  });
  
  const search = document.getElementById('searchBox');
  if (search) {
    search.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll('.agent-card').forEach(card => {
        const name = card.querySelector('.agent-name').textContent.toLowerCase();
        card.style.display = name.includes(q) ? 'block' : 'none';
      });
    });
  }
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    initializeApp();
  }
}

}