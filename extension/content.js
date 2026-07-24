const API_URL = 'http://127.0.0.1:8000/api/articles/track';

function getTitle() {
  const titleEl = document.querySelector('h1');
  return titleEl ? titleEl.innerText.trim() : document.title;
}

function trackVisit() {
  const payload = {
    title: getTitle(),
    url: window.location.href,
    sessionId: 'default'
  };

  fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).catch(() => {});
}

trackVisit();
