// A short, memorable code the user can write down and enter on
// another device to continue the same session. This code IS the
// session id — no server-side accounts table required.

const ADJECTIVES = [
  'amber', 'coral', 'dusky', 'faded', 'gentle', 'hollow', 'ivory',
  'jade', 'lunar', 'misty', 'quiet', 'rustic', 'silver', 'tender',
  'velvet', 'willow',
];

const NOUNS = [
  'river', 'ember', 'harbor', 'meadow', 'orbit', 'petal', 'quarry',
  'ridge', 'shadow', 'thicket', 'valley', 'canyon', 'grove', 'hollow',
];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRecoveryCode() {
  const adjective = randomFrom(ADJECTIVES);
  const noun = randomFrom(NOUNS);
  const number = Math.floor(100 + Math.random() * 900); // 100-999
  return `${adjective}-${noun}-${number}`;
}

const STORAGE_KEY = 'gc_session_id';

export function getSessionId() {
  if (typeof window === 'undefined') return null;

  let id = localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = generateRecoveryCode();
    localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}

export function restoreSessionId(code) {
  if (typeof window === 'undefined') return null;

  const cleaned = code.trim().toLowerCase();
  if (!cleaned) return null;

  localStorage.setItem(STORAGE_KEY, cleaned);
  return cleaned;
}