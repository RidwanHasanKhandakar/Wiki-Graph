const API_URL = 'http://127.0.0.1:8000';
const TRACK_URL = `${API_URL}/api/articles/track`;
const SESSIONS_URL = `${API_URL}/api/sessions`;
const STORAGE_KEY = 'wikiGraphSessionId';
const LAST_TRACKED_KEY = 'wikiGraphLastTracked';
const TRACKED_COUNT_KEY = 'wikiGraphTrackedCount';

const sessionInput = document.getElementById('sessionInput');
const saveButton = document.getElementById('saveButton');
const trackButton = document.getElementById('trackButton');
const sessionList = document.getElementById('sessionList');
const pageInfo = document.getElementById('pageInfo');
const lastTrackedInfo = document.getElementById('lastTrackedInfo');
const statusEl = document.getElementById('status');

let currentTab = null;
let activeSession = 'default';
let trackedCount = 0;

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.className = `status ${isError ? 'error' : 'success'}`;
}

function clearStatus() {
  statusEl.textContent = '';
  statusEl.className = 'status';
}

function setBadgeCount(count) {
  const text = count > 0 ? String(count) : '';
  chrome.action.setBadgeText({ text });
}

function loadLastTracked(lastTracked) {
  if (lastTracked) {
    updateLastTrackedDisplay(lastTracked);
  } else {
    lastTrackedInfo.textContent = 'Not tracked yet.';
  }
}

function updateLastTrackedDisplay({ title, url, sessionId }) {
  lastTrackedInfo.innerHTML = `${title} <br /><a href="${url}" target="_blank">${url}</a> <br /><span class="small">session: ${sessionId}</span>`;
}

function saveActiveSession(sessionId) {
  activeSession = sessionId || 'default';
  chrome.storage.local.set({ [STORAGE_KEY]: activeSession }, () => {
    setStatus(`Active session saved: ${activeSession}`);
    sessionInput.value = activeSession;
    loadSessions();
  });
}

function updatePageInfo(tab) {
  if (!tab) {
    pageInfo.textContent = 'No active tab available.';
    return;
  }

  currentTab = tab;
  const title = tab.title || 'Untitled page';
  const url = tab.url || '';
  pageInfo.textContent = `${title}\n${url}`;
}

async function fetchSessions() {
  try {
    const response = await fetch(SESSIONS_URL);
    const data = await response.json();
    return data.sessions || [];
  } catch (error) {
    console.error('Unable to load sessions', error);
    return [];
  }
}

async function loadSessions() {
  const sessions = await fetchSessions();
  sessionList.innerHTML = '';

  if (sessions.length === 0) {
    sessionList.textContent = 'No sessions yet.';
    return;
  }

  sessions.forEach((session) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'session-pill';
    button.textContent = session.name;
    if (session.id === activeSession) {
      button.classList.add('active');
    }
    button.addEventListener('click', () => {
      saveActiveSession(session.id);
    });
    sessionList.appendChild(button);
  });
}

async function trackCurrentPage() {
  if (!currentTab || !currentTab.url) {
    setStatus('Unable to read current page.', true);
    return;
  }

  const title = currentTab.title || 'Untitled';
  const url = currentTab.url;
  const sessionId = activeSession || 'default';

  try {
    const response = await fetch(TRACK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, url, sessionId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    trackedCount += 1;
    const lastTracked = {
      title,
      url,
      sessionId,
      timestamp: new Date().toISOString(),
    };

    chrome.storage.local.set({
      [LAST_TRACKED_KEY]: lastTracked,
      [TRACKED_COUNT_KEY]: trackedCount,
    });

    setStatus(`Tracked page in session: ${sessionId}`);
    updateLastTrackedDisplay(lastTracked);
    setBadgeCount(trackedCount);
    loadSessions();
  } catch (error) {
    console.error('Tracking failed', error);
    setStatus('Track request failed.', true);
  }
}

function initialize() {
  chrome.action.setBadgeBackgroundColor({ color: '#2563eb' });

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    updatePageInfo(tabs[0]);
  });

  chrome.storage.local.get([STORAGE_KEY, LAST_TRACKED_KEY, TRACKED_COUNT_KEY], (result) => {
    activeSession = result[STORAGE_KEY] || 'default';
    trackedCount = result[TRACKED_COUNT_KEY] || 0;
    sessionInput.value = activeSession;
    loadLastTracked(result[LAST_TRACKED_KEY]);
    setBadgeCount(trackedCount);
    loadSessions();
  });

  saveButton.addEventListener('click', () => {
    const sessionId = sessionInput.value.trim() || 'default';
    saveActiveSession(sessionId);
  });

  trackButton.addEventListener('click', () => {
    clearStatus();
    trackCurrentPage();
  });
}

document.addEventListener('DOMContentLoaded', initialize);
