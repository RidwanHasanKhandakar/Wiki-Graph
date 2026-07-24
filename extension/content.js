const API_URL = 'http://127.0.0.1:8000/api/articles/track';
const STORAGE_KEY = 'wikiGraphSessionId';

function getTitle() {
  const titleEl = document.querySelector('h1');
  return titleEl ? titleEl.innerText.trim() : document.title;
}

function getSessionId() {
  return new Promise((resolve) => {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
      resolve(result[STORAGE_KEY] || 'default');
    });
  });
}

async function trackVisit() {
  const sessionId = await getSessionId();
  const payload = {
    title: getTitle(),
    url: window.location.href,
    sessionId,
  };

  fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => {});
}

trackVisit();
