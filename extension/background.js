// background.js 
// Prefix used in storage (must be the same in popup.js)
const STORAGE_PREFIX = 'securitytxt:';
const paths = ['/.well-known/security.txt', '/security.txt'];

function originFromUrl(url) {
  try {
    return new URL(url).origin;
  } catch (e) {
    return null;
  }
}

async function fetchSecurityTxt(origin) {
  for (const p of paths) {
    const url = origin + p;
    try {
      // follow redirects;
      const res = await fetch(url, { method: 'GET', redirect: 'follow', credentials: 'omit' });
      console.debug('[security.txt] fetch', url, '=>', res.status, 'finalUrl:', res.url);
      // treat 2xx and 3xx as success (3xx will have final URL in res.url)
      if (res.status >= 200 && res.status < 400) {
        const text = await res.text();
        const finalUrl = res.url || url;
        const finalOrigin = (new URL(finalUrl)).origin;
        return {
          found: true,
          requestedUrl: url,
          finalUrl,
          finalOrigin,
          status: res.status,
          content: text
        };
      }
    } catch (err) {
      console.warn('[security.txt] fetch error for', url, err);
      // continue to next path
    }
  }
  return { found: false };
}

async function handleTab(tabId, pageUrl) {
  const origin = originFromUrl(pageUrl);
  if (!origin) return;

  try {
    const result = await fetchSecurityTxt(origin);
    // save the result under the prefix + origin
    const keyRequested = STORAGE_PREFIX + origin;
    const toStore = {};
    toStore[keyRequested] = result;

    // if finalOrigin is different from origin (redirect), save under that key as well
    if (result.found && result.finalOrigin && result.finalOrigin !== origin) {
      const keyFinal = STORAGE_PREFIX + result.finalOrigin;
      toStore[keyFinal] = result;
      console.debug('[security.txt] storing under both', keyRequested, 'and', keyFinal);
    } else {
      console.debug('[security.txt] storing under', keyRequested);
    }

    await chrome.storage.local.set(toStore);

    // set badge for current tab
    if (result.found) {
      chrome.action.setBadgeText({ text: 'YES', tabId });
      chrome.action.setBadgeBackgroundColor({ color: [0, 153, 51], tabId });
    } else {
      chrome.action.setBadgeText({ text: 'NO', tabId });
      chrome.action.setBadgeBackgroundColor({ color: [200, 0, 0], tabId });
    }
  } catch (e) {
    console.error('[security.txt] handleTab error', e);
  }
}

/* events */

// when the card loads / URL changes
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab && tab.url && (tab.url.startsWith('http://') || tab.url.startsWith('https://'))) {
    handleTab(tabId, tab.url);
  }
});

// when we switch the tab
chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (chrome.runtime.lastError) return;
    if (tab && tab.url && (tab.url.startsWith('http://') || tab.url.startsWith('https://'))) {
      handleTab(activeInfo.tabId, tab.url);
    }
  });
});

// clear badge on install/update
chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({ text: '' });
});
