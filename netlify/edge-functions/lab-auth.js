// =========================================================
// PALLSTON LAB — HTTP Basic Auth at the edge.
//
// Protects /lab and /lab/* with the browser's native username +
// password prompt. Content is never served until valid credentials
// are supplied. Two modes, checked in this order:
//
// 1) PER-PERSON (recommended). Set env var LAB_USERS to a list of
//    entries, one per line (or comma-separated):
//
//        alice@example.com:<sha256-of-password>
//        bob@example.com:<sha256-of-password>
//
//    Each person signs in with their EMAIL as the username and their
//    own password. Passwords are stored only as SHA-256 hashes.
//    Generate an entry with:  node pallston-src/lab-credentials.js <email>
//    To revoke one person, delete their line. To revoke everyone,
//    clear LAB_USERS.
//
// 2) SINGLE SHARED credential (simplest). Set LAB_USER + LAB_PASSWORD
//    (plaintext) and hand the same pair to everyone.
//
// If neither is configured, the Lab is denied to everyone
// (fail-closed) — it is never accidentally public. To remove the Lab
// entirely, rebuild with LAB_ENABLED=false and delete this file.
// =========================================================

export default async (request, context) => {
  const users = parseUsers(Netlify.env.get('LAB_USERS'));
  const singleUser = Netlify.env.get('LAB_USER');
  const singlePass = Netlify.env.get('LAB_PASSWORD');

  if (users.size === 0 && !(singleUser && singlePass)) {
    return deny(503, 'Pallston Lab is not yet configured.');
  }

  const header = request.headers.get('authorization') || '';
  const [scheme, encoded] = header.split(' ');
  if (scheme === 'Basic' && encoded) {
    let decoded = '';
    try { decoded = atob(encoded); } catch (_) { decoded = ''; }
    const sep = decoded.indexOf(':');
    if (sep >= 0) {
      const user = decoded.slice(0, sep);
      const pass = decoded.slice(sep + 1);

      // 1) per-person, hashed
      const storedHash = users.get(user.trim().toLowerCase());
      if (storedHash) {
        const submitted = await sha256hex(pass);
        if (safeEqual(submitted, storedHash)) return context.next();
      }

      // 2) single shared, plaintext
      if (singleUser && singlePass && safeEqual(user, singleUser) && safeEqual(pass, singlePass)) {
        return context.next();
      }
    }
  }

  return deny(401, 'Authentication required.', {
    'WWW-Authenticate': 'Basic realm="Pallston Lab", charset="UTF-8"'
  });
};

function parseUsers(raw) {
  const map = new Map();
  if (!raw) return map;
  raw.split(/[\n,]+/).forEach(line => {
    const entry = line.trim();
    if (!entry) return;
    const i = entry.indexOf(':');
    if (i > 0) map.set(entry.slice(0, i).trim().toLowerCase(), entry.slice(i + 1).trim().toLowerCase());
  });
  return map;
}

async function sha256hex(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Comparison that does not short-circuit on content, to avoid leaking timing.
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

function deny(status, body, extraHeaders) {
  return new Response(body, {
    status,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      ...(extraHeaders || {})
    }
  });
}

export const config = { path: ['/lab', '/lab/*'] };
