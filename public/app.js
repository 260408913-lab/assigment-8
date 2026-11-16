const buttonGrid = document.querySelector('.button-grid');
const endpointEl = document.getElementById('req-endpoint');
const statusEl = document.getElementById('res-status');
const bodyEl = document.getElementById('res-body');

async function callEndpoint(method, url) {
  endpointEl.textContent = `${method} ${url}`;
  statusEl.textContent = 'Loading...';
  bodyEl.textContent = '';

  try {
    const response = await fetch(url, { method });
    statusEl.textContent = `${response.status} ${response.statusText}`;

    const contentType = response.headers.get('content-type') || '';
    const rawText = await response.text();

    if (contentType.includes('application/json')) {
      const parsed = JSON.parse(rawText);
      bodyEl.textContent = JSON.stringify(parsed, null, 2);
    } else {
      bodyEl.textContent = rawText;
    }
  } catch (error) {
    statusEl.textContent = 'Network Error';
    bodyEl.textContent = `Request failed: ${error.message}`;
  }
}

buttonGrid.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-url]');
  if (!button) return;

  const { method, url } = button.dataset;
  callEndpoint(method, url);
});