/* Sign Ready – serves the app and sends daily reminder notifications (Web Push).
   No setup needed: the push keys are created automatically the first time they're needed. */

const enc = new TextEncoder();
const b64u = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64u = s => { s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '='; const r = atob(s); return Uint8Array.from(r, c => c.charCodeAt(0)); };
const cat = (...parts) => { const n = parts.reduce((a, p) => a + p.length, 0), o = new Uint8Array(n); let i = 0; for (const p of parts) { o.set(p, i); i += p.length; } return o; };
const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });

async function hmac(key, data) {
  const k = await crypto.subtle.importKey('raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return new Uint8Array(await crypto.subtle.sign('HMAC', k, data));
}

/* RFC 8291 message encryption (aes128gcm) */
export async function encryptPayload(p256dh, auth, payload, _t) {
  const uaPub = unb64u(p256dh), secret = unb64u(auth);
  const as = _t ? _t.as : await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
  const asPub = new Uint8Array(await crypto.subtle.exportKey('raw', as.publicKey));
  const uaKey = await crypto.subtle.importKey('raw', uaPub, { name: 'ECDH', namedCurve: 'P-256' }, false, []);
  const shared = new Uint8Array(await crypto.subtle.deriveBits({ name: 'ECDH', public: uaKey }, as.privateKey, 256));
  const prkKey = await hmac(secret, shared);
  const ikm = await hmac(prkKey, cat(enc.encode('WebPush: info\0'), uaPub, asPub, new Uint8Array([1])));
  const salt = _t ? _t.salt : crypto.getRandomValues(new Uint8Array(16));
  const prk = await hmac(salt, ikm);
  const cek = (await hmac(prk, cat(enc.encode('Content-Encoding: aes128gcm\0'), new Uint8Array([1])))).slice(0, 16);
  const nonce = (await hmac(prk, cat(enc.encode('Content-Encoding: nonce\0'), new Uint8Array([1])))).slice(0, 12);
  const key = await crypto.subtle.importKey('raw', cek, 'AES-GCM', false, ['encrypt']);
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, key, cat(payload, new Uint8Array([2]))));
  const rs = new Uint8Array([0, 0, 16, 0]); // record size 4096
  return cat(salt, rs, new Uint8Array([asPub.length]), asPub, ct);
}

/* RFC 8292 VAPID token */
export async function vapidJWT(aud, sub, jwk) {
  const key = await crypto.subtle.importKey('jwk', jwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
  const head = b64u(enc.encode(JSON.stringify({ typ: 'JWT', alg: 'ES256' })));
  const body = b64u(enc.encode(JSON.stringify({ aud, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub })));
  const sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, enc.encode(head + '.' + body));
  return head + '.' + body + '.' + b64u(sig);
}

function localNow(tz) {
  let p;
  try { p = new Intl.DateTimeFormat('en-GB', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()); }
  catch (e) { return localNow('Europe/London'); }
  const g = t => p.find(x => x.type === t).value;
  return { date: `${g('year')}-${g('month')}-${g('day')}`, mins: +g('hour') * 60 + +g('minute') };
}
const dayBefore = d => { const x = new Date(d + 'T12:00:00Z'); x.setUTCDate(x.getUTCDate() - 1); return x.toISOString().slice(0, 10); };
const toMins = t => { const m = /^(\d\d):(\d\d)$/.exec(t || ''); return m ? +m[1] * 60 + +m[2] : 18 * 60; };

function message(kind, rec, date) {
  const hi = rec.name ? `${rec.name}, ` : '';
  const st = rec.last === dayBefore(date) ? (rec.streak || 0) : 0;
  if (kind === 'test') return { title: 'Reminders are working ✓', body: `You'll get your daily nudge at ${rec.time}.` };
  if (kind === 'saver') return { title: `Your ${st}-day streak ends tonight 🔥`, body: `${hi}one quick lesson or the refresher keeps it going.` };
  const lines = st > 0
    ? [`${hi}a few minutes of BSL keeps your ${st}-day streak going 🔥`, `Day ${st + 1} of your streak is waiting. One lesson?`, `Your garden is waiting to grow. Keep your ${st}-day streak alive!`]
    : [`${hi}a few minutes of signing today? 👋`, 'Your garden is waiting to grow. One lesson today?', 'Practise a sign or two. Little and often is the way to learn.'];
  const n = +date.slice(-2) % lines.length;
  return { title: 'Time for some signing 👋', body: lines[n] };
}

export class Hub {
  constructor(ctx, env) { this.ctx = ctx; this.env = env; }

  async keys() {
    let k = await this.ctx.storage.get('vapid');
    if (!k) {
      const kp = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']);
      k = { pub: b64u(await crypto.subtle.exportKey('raw', kp.publicKey)), jwk: await crypto.subtle.exportKey('jwk', kp.privateKey) };
      await this.ctx.storage.put('vapid', k);
    }
    return k;
  }

  async send(rec, msg) {
    const k = await this.keys();
    const url = new URL(rec.sub.endpoint);
    const jwt = await vapidJWT(url.origin, rec.origin || 'mailto:sign-ready@users.noreply.github.com', k.jwk);
    const body = await encryptPayload(rec.sub.keys.p256dh, rec.sub.keys.auth, enc.encode(JSON.stringify(msg)));
    const r = await fetch(rec.sub.endpoint, { method: 'POST', body, headers: {
      'Content-Encoding': 'aes128gcm', 'Content-Type': 'application/octet-stream', TTL: '14400', Urgency: 'normal',
      Authorization: `vapid t=${jwt}, k=${k.pub}` } });
    return r.status;
  }

  async fetch(req) {
    const path = new URL(req.url).pathname;
    try {
      if (path === '/vapid') return json({ key: (await this.keys()).pub });
      if (path === '/tick') return json(await this.tick());
      if (req.method !== 'POST') return json({ error: 'not found' }, 404);
      const b = await req.json();
      if (path === '/subscribe') {
        const s = b.sub;
        if (!s || typeof s.endpoint !== 'string' || !/^https:\/\//.test(s.endpoint) || !s.keys || !s.keys.p256dh || !s.keys.auth) return json({ error: 'bad subscription' }, 400);
        const id = b64u(await crypto.subtle.digest('SHA-256', enc.encode(s.endpoint))).slice(0, 22);
        const old = (await this.ctx.storage.get('sub:' + id)) || {};
        await this.ctx.storage.put('sub:' + id, { ...old, sub: s, time: /^\d\d:\d\d$/.test(b.time) ? b.time : '18:00', tz: String(b.tz || 'Europe/London').slice(0, 60),
          last: b.last || old.last || null, streak: +b.streak || 0, name: String(b.name || '').slice(0, 30), origin: String(b.origin || '').slice(0, 200) || old.origin });
        return json({ id });
      }
      const key = 'sub:' + String(b.id || '').slice(0, 40);
      const rec = await this.ctx.storage.get(key);
      if (!rec) return json({ error: 'unknown' }, 404);
      if (path === '/practised') { rec.last = b.last || rec.last; rec.streak = +b.streak || 0; if (b.name != null) rec.name = String(b.name).slice(0, 30); await this.ctx.storage.put(key, rec); return json({ ok: true }); }
      if (path === '/unsubscribe') { await this.ctx.storage.delete(key); return json({ ok: true }); }
      if (path === '/test') { const st = await this.send(rec, message('test', rec, localNow(rec.tz).date)); return json({ ok: st < 300, status: st }); }
    } catch (e) { return json({ error: String(e && e.message || e) }, 500); }
    return json({ error: 'not found' }, 404);
  }

  async tick() {
    const all = await this.ctx.storage.list({ prefix: 'sub:' });
    let sent = 0;
    for (const [key, rec] of all) {
      const now = localNow(rec.tz);
      if (rec.last === now.date) continue;                    // already practised today
      const t = toMins(rec.time), saver = 20 * 60 + 30;
      let kind = null;
      if (now.mins >= t && now.mins < t + 15 && rec.sent1 !== now.date) kind = 'daily';
      else if (rec.last === dayBefore(now.date) && (rec.streak || 0) > 0 && t < saver && now.mins >= saver && now.mins < saver + 15 && rec.sent2 !== now.date) kind = 'saver';
      if (!kind) continue;
      const status = await this.send(rec, message(kind, rec, now.date)).catch(() => 0);
      if (status === 404 || status === 410) { await this.ctx.storage.delete(key); continue; }
      if (kind === 'daily') rec.sent1 = now.date; else rec.sent2 = now.date;
      await this.ctx.storage.put(key, rec);
      sent++;
    }
    return { ok: true, sent };
  }
}

const hub = env => env.HUB.get(env.HUB.idFromName('main'));

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname.startsWith('/api/')) {
      const u = new URL(req.url); u.pathname = url.pathname.slice(4);
      let init = { method: req.method, headers: req.headers };
      if (req.method === 'POST') {
        let b = {};
        try { b = await req.json(); } catch (e) { return json({ error: 'bad json' }, 400); }
        if (url.pathname === '/api/subscribe') b.origin = url.origin;
        init = { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b) };
      }
      return hub(env).fetch(new Request(u.toString(), init));
    }
    return env.ASSETS.fetch(req);
  },
  async scheduled(event, env, ctx) {
    ctx.waitUntil(hub(env).fetch('https://hub/tick'));
  }
};
