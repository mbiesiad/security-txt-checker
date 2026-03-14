// popup.js
const STORAGE_PREFIX = 'securitytxt:';

function originFromUrl(url) {
  try {
    return new URL(url).origin;
  } catch (e) {
    return null;
  }
}

function escapeHtml(s) {
  if (!s) return '';
  return s.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  const el = document.getElementById('content');
  if (!tabs || !tabs[0]) {
    el.textContent = 'No active card.';
    return;
  }
  const tab = tabs[0];
  const origin = originFromUrl(tab.url);
  if (!origin) {
    el.textContent = 'Unsupported URL.';
    return;
  }

  const key = STORAGE_PREFIX + origin;
  chrome.storage.local.get([key], function (items) {
    const entry = items[key];

    if (entry && entry.found) {
      // security.txt found
      el.innerHTML = `
        <div style="color:green;font-weight:bold">✅ security.txt FOUND</div>
        <div><a href="${entry.finalUrl}" target="_blank" rel="noopener noreferrer">${entry.finalUrl}</a></div>
        <details style="margin-top:8px">
          <summary>Content preview</summary>
          <pre>${escapeHtml(entry.content.substring(0, 1000))}</pre>
        </details>
      `;
    } else {
      // missing file
      let checked = `
        <ul>
          <li>${origin}/.well-known/security.txt</li>
          <li>${origin}/security.txt</li>
        </ul>
      `;
      el.innerHTML = `
        <div style="color:red;font-weight:bold">❌ security.txt NOT FOUND</div>
        <div>Checked paths:</div>
        ${checked}
      `;
    }
  });
});
