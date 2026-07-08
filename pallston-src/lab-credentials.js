// =========================================================
// PALLSTON LAB — credential generator.
//
// Creates one access credential for one person. It prints two things:
//   · a LAB_USERS line to store on Netlify (email + password HASH)
//   · the email + password to send that person
//
// The password itself is never stored anywhere — only its SHA-256
// hash goes into Netlify, so a leak of the env var does not reveal
// anyone's password.
//
// USAGE
//   node lab-credentials.js <email> [password]
//     · password omitted → a strong one is generated for you
//
// Then: open Netlify → Site configuration → Environment variables →
// LAB_USERS, and append the printed line (one entry per line). Save,
// redeploy, and share the username + password with the person.
// To revoke access, delete that person's line and redeploy.
// =========================================================

const crypto = require('crypto');

const email = (process.argv[2] || '').trim().toLowerCase();
const providedPassword = process.argv[3];

if (!email || !email.includes('@')) {
  console.error('Usage: node lab-credentials.js <email> [password]');
  process.exit(1);
}

// A strong, URL-safe password (~22 chars) if none is supplied.
const password = providedPassword || crypto.randomBytes(16).toString('base64url');
const hash = crypto.createHash('sha256').update(password).digest('hex');

console.log('');
console.log('  Add this line to the Netlify env var LAB_USERS');
console.log('  (one entry per line, or comma-separated):');
console.log('');
console.log(`      ${email}:${hash}`);
console.log('');
console.log('  Send this person their sign-in details:');
console.log('');
console.log(`      username:  ${email}`);
console.log(`      password:  ${password}`);
console.log('');
