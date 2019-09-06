function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

let hasRun = false;
function init() {
  if (hasRun) {
    return;
  }
  // eslint-disable-next-line global-require
  require('./index.js');
  hasRun = true;
}

// cdn load
window.onVendorLoad = () => {
  init();
};

if (process.env.NODE_ENV === 'production' && process.env.CDN_PUBLIC_URL) {
  /* eslint camelcase: 0 */
  /* eslint no-undef: 0 */
  __webpack_public_path__ = process.env.CDN_PUBLIC_URL;
}

if (window.React) {
  // normal case
  init();
} else {
  // cdn timeout
  setTimeout(() => {
    if (hasRun) {
      return;
    }
    loadScript('./vendor.js').then(init, () => {
      window.alert('page load failed, plearse refresh');
    });
  }, 3000);
}
