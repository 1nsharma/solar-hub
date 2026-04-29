export function registerServiceWorker() {
  if (!('serviceWorker' in navigator) || import.meta.env.DEV) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('SolarHub PWA service worker registration failed:', err);
    });
  });
}
