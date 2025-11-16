// Minimal Consent Mode manager for avioncitojuego.com
(function(){
  const KEY = 'siteConsentV2';

  function saveConsent(status){
    localStorage.setItem(KEY, JSON.stringify(status));
  }
  function loadConsent(){
    try {
      return JSON.parse(localStorage.getItem(KEY));
    } catch(e){ return null; }
  }

  function applyConsent(status){
    if (!window.gtag) return;
    window.gtag('consent', 'update', {
      ad_storage: status.ads ? 'granted' : 'denied',
      analytics_storage: status.analytics ? 'granted' : 'denied',
      ad_user_data: status.ads ? 'granted' : 'denied',
      ad_personalization: status.ads ? 'granted' : 'denied',
      functionality_storage: 'granted',
      security_storage: 'granted'
    });
    if (status.analytics && typeof window.initAnalytics === 'function') {
      window.initAnalytics();
    }
  }
  function showBanner(){
    let banner = document.getElementById('cookieBanner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'cookieBanner';
      banner.className = 'cookie-banner';
      banner.style.position = 'fixed';
      banner.style.bottom = '0';
      banner.style.left = '0';
      banner.style.right = '0';
      banner.style.background = 'rgba(0,0,0,0.9)';
      banner.style.color = '#fff';
      banner.style.padding = '16px';
      banner.style.zIndex = '9999';
      banner.style.display = 'none';
      banner.innerHTML = '<div class="cookie-content" style="max-width: 980px; margin: 0 auto; display:flex; gap:12px; align-items:center; justify-content:space-between; flex-wrap:wrap;">\
        <p style="margin:0; flex: 1 1 520px;">We use cookies to improve your experience, analyze traffic, and show relevant ads. You can accept or manage preferences.</p>\
        <div class="cookie-actions" style="display:flex; gap:8px;">\
          <button id="cookieReject" class="btn-secondary" style="background:#444;color:#fff;border:0;padding:8px 12px;border-radius:6px;">Reject non-essential</button>\
          <button id="cookieCustomize" class="btn-tertiary" style="background:#666;color:#fff;border:0;padding:8px 12px;border-radius:6px;">Preferences</button>\
          <button id="cookieAccept" class="btn-primary" style="background:#22c55e;color:#000;border:0;padding:8px 12px;border-radius:6px;">Accept all</button>\
        </div></div>';
      document.body.appendChild(banner);
    }
    banner.style.display = 'block';
  }
  function hideBanner(){
    const banner = document.getElementById('cookieBanner');
    if (banner) banner.style.display = 'none';
  }

  function wire(){
    const accept = document.getElementById('cookieAccept');
    const reject = document.getElementById('cookieReject');
    const customize = document.getElementById('cookieCustomize');

    if (accept) accept.addEventListener('click', function(){
      const status = { ads: true, analytics: true, ts: Date.now() };
      saveConsent(status);
      applyConsent(status);
      hideBanner();
    });
    if (reject) reject.addEventListener('click', function(){
      const status = { ads: false, analytics: false, ts: Date.now() };
      saveConsent(status);
      applyConsent(status);
      hideBanner();
    });
    if (customize) customize.addEventListener('click', function(){
      // Minimal preferences: toggle analytics only
      const current = loadConsent() || { ads:false, analytics:false };
      const next = { ads: current.ads, analytics: !current.analytics, ts: Date.now() };
      saveConsent(next);
      applyConsent(next);
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    const saved = loadConsent();
    if (saved) {
      applyConsent(saved);
    } else {
      showBanner();
    }
    wire();
  });
})();
