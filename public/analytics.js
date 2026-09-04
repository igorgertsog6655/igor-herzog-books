/* Analytics is opt-in. Never send form contents, filenames or arbitrary URLs. */
(() => {
  const id = 'G-2Q88YVY657';
  const key = 'herzog-analytics-consent-v1';
  let allowed = false;
  let initialized = false;
  const read = () => { try { return localStorage.getItem(key); } catch { return null; } };
  const save = value => { try { localStorage.setItem(key, value); } catch { /* Session only. */ } };
  const safeLocation = () => {
    const source = new URL(location.href);
    const clean = new URL(source.origin + source.pathname);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'lang'].forEach(name => {
      const value = source.searchParams.get(name);
      if (value && /^[\p{L}\p{N}_ .-]{1,100}$/u.test(value)) clean.searchParams.set(name, value);
    });
    return clean.href;
  };
  const referrer = () => { try { return new URL(document.referrer).origin; } catch { return ''; } };
  const event = (name, params = {}) => {
    if (allowed && window.gtag) window.gtag('event', name, { ...params, page_location: safeLocation(), language: document.documentElement.lang });
  };
  function enable() {
    allowed = true;
    window['ga-disable-' + id] = false;
    if (initialized) {
      window.gtag('consent', 'update', { analytics_storage: 'granted' });
      return;
    }
    initialized = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    window.gtag('js', new Date());
    window.gtag('config', id, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: safeLocation(),
      page_referrer: referrer(),
    });
    event('page_view', { page_title: document.title, page_referrer: referrer() });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.appendChild(script);
  }
  function disable() {
    allowed = false;
    window['ga-disable-' + id] = true;
    if (window.gtag) window.gtag('consent', 'update', { analytics_storage: 'denied' });
    document.cookie.split(';').forEach(cookie => {
      const name = cookie.trim().split('=')[0];
      if (!/^_ga(?:_|$)/.test(name)) return;
      ['', location.hostname, '.' + location.hostname].forEach(domain => {
        document.cookie = name + '=; Max-Age=0; path=/' + (domain ? '; domain=' + domain : '') + '; SameSite=Lax';
      });
    });
  }
  const panel = document.createElement('section');
  panel.className = 'analyticsConsent';
  panel.setAttribute('aria-label', 'Google Analytics');
  const message = document.createElement('p');
  const policy = document.createElement('a');
  policy.href = 'https://policies.google.com/privacy';
  policy.target = '_blank';
  policy.rel = 'noopener noreferrer';
  const buttons = document.createElement('div');
  const accept = document.createElement('button');
  const reject = document.createElement('button');
  const settings = document.createElement('button');
  [accept, reject, settings].forEach(button => button.type = 'button');
  settings.className = 'analyticsSettings';
  buttons.append(accept, reject);
  panel.append(message, policy, buttons);
  document.body.append(panel, settings);
  function translate() {
    const en = document.documentElement.lang === 'en';
    message.textContent = en
      ? 'May we use Google Analytics cookies to measure visits, traffic sources and interactions? Data is sent to Google only with your permission. You can change your choice at any time.'
      : 'Разрешить Google Analytics использовать cookies для статистики посещений, источников переходов и действий на сайте? Данные передаются Google только с Вашего согласия. Выбор можно изменить в любое время.';
    policy.textContent = en ? 'Google privacy policy' : 'Политика конфиденциальности Google';
    accept.textContent = en ? 'Allow analytics' : 'Разрешить аналитику';
    reject.textContent = en ? 'No analytics' : 'Без аналитики';
    settings.textContent = en ? 'Cookie settings' : 'Настройки cookies';
  }
  const close = () => { panel.hidden = true; settings.hidden = false; };
  accept.onclick = () => { save('granted'); enable(); close(); settings.focus(); };
  reject.onclick = () => { save('denied'); disable(); close(); settings.focus(); };
  settings.onclick = () => { panel.hidden = false; settings.hidden = true; accept.focus(); };
  translate();
  new MutationObserver(translate).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  const stored = read();
  if (stored === 'granted') enable();
  panel.hidden = stored === 'granted' || stored === 'denied';
  settings.hidden = !panel.hidden;
  window.addEventListener('storage', e => {
    if (e.key !== key && e.key !== null) return;
    if (read() === 'granted') enable(); else disable();
  });
  document.addEventListener('click', e => {
    const link = e.target instanceof Element ? e.target.closest('a[href]') : null;
    if (!link) return;
    const url = new URL(link.href, location.href);
    const host = url.hostname;
    const store = /(^|\.)amazon\./.test(host) ? 'amazon' : /(^|\.)litres\.ru$/.test(host) ? 'litres' : null;
    if (store) event('book_store_click', { store, book_path: url.pathname });
    else if (/(^|\.)youtube\.com$/.test(host)) event('youtube_click');
    else if (url.origin === location.origin && ['#personal', '#contact', '#books'].includes(url.hash)) event('section_click', { section: url.hash.slice(1) });
  });
  const started = new WeakSet();
  document.addEventListener('play', e => {
    const video = e.target;
    if (!allowed || !(video instanceof HTMLVideoElement) || !video.controls || started.has(video)) return;
    started.add(video);
    event('trailer_start');
  }, true);
  document.addEventListener('ended', e => {
    if (e.target instanceof HTMLVideoElement && e.target.controls) event('trailer_complete');
  }, true);
})();
