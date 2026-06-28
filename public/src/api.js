// Dalivim API client — the seam between the static bundles and the Railway
// backend (the Go escrow API). The base URL is injected at build time by
// assets/config.js (window.DALIVIM_API_BASE_URL); load that script before this
// one. The bundles currently render with mock data (see app/data.jsx); this
// client is the ready-to-use entry point for replacing those mocks with live
// calls, screen by screen, without re-plumbing how requests are made.
//
// Endpoints are documented in the backend's Postman collection. Examples:
//   await DalivimAPI.post('/auth/login', { email, password })
//   await DalivimAPI.get('/me/status')                       // uses saved JWT
//   await DalivimAPI.get('/public/links/' + slug)            // public, no auth
(function () {
  var BASE = (window.DALIVIM_API_BASE_URL || '').replace(/\/+$/, '');
  var TOKEN_KEY = 'dalivim.jwt';
  var USER_KEY = 'dalivim.user';

  function getToken() {
    try { return window.localStorage.getItem(TOKEN_KEY) || null; } catch (e) { return null; }
  }
  function setToken(token) {
    try {
      if (token) window.localStorage.setItem(TOKEN_KEY, token);
      else { window.localStorage.removeItem(TOKEN_KEY); window.localStorage.removeItem(USER_KEY); }
    } catch (e) { /* storage unavailable (private mode / sandbox) — ignore */ }
  }
  // Lightweight identity cache (full_name, email…) for greetings/avatar.
  function getUser() {
    try { return JSON.parse(window.localStorage.getItem(USER_KEY)) || null; } catch (e) { return null; }
  }
  function setUser(user) {
    try {
      if (user) window.localStorage.setItem(USER_KEY, JSON.stringify(user));
      else window.localStorage.removeItem(USER_KEY);
    } catch (e) { /* ignore */ }
  }

  async function request(method, path, body, opts) {
    opts = opts || {};
    var headers = Object.assign({}, opts.headers || {});
    if (body !== undefined && body !== null) headers['Content-Type'] = 'application/json';

    // Bearer token: explicit opts.token wins, otherwise the saved JWT, unless
    // the caller opts out (auth:false) for public endpoints.
    var token = opts.token !== undefined ? opts.token : (opts.auth === false ? null : getToken());
    if (token) headers['Authorization'] = 'Bearer ' + token;

    var res = await fetch(BASE + path, {
      method: method,
      headers: headers,
      body: body !== undefined && body !== null ? JSON.stringify(body) : undefined,
    });

    var text = await res.text();
    var data = null;
    try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }

    if (!res.ok) {
      // Backend error envelope is { error: { code, message } }.
      var msg = (data && data.error && data.error.message) ||
                (data && data.message) ||
                ('HTTP ' + res.status);
      var err = new Error(msg);
      err.status = res.status;
      err.code = data && data.error && data.error.code;
      err.data = data;
      throw err;
    }
    return data;
  }

  window.DalivimAPI = {
    baseUrl: BASE,
    getToken: getToken,
    setToken: setToken,
    getUser: getUser,
    setUser: setUser,
    get: function (path, opts) { return request('GET', path, null, opts); },
    post: function (path, body, opts) { return request('POST', path, body, opts); },
    patch: function (path, body, opts) { return request('PATCH', path, body, opts); },
    put: function (path, body, opts) { return request('PUT', path, body, opts); },
    del: function (path, opts) { return request('DELETE', path, null, opts); },
  };
})();
