// Detect Safari on iOS/macOS. Chrome on iOS uses WebKit but reports as "CriOS",
// so the negative Chrome/Chromium check is required.
export function isSafariOnAppleOS() {
  const ua = navigator.userAgent;
  const isAppleOS = /iPad|iPhone|iPod|Macintosh/.test(ua) || navigator.platform === 'MacIntel';
  const isSafari = /Safari\//.test(ua) && !/Chrome|Chromium|CriOS|FxiOS|EdgiOS|Edg\//.test(ua);

  return isAppleOS && isSafari;
}
