import db from '../../lib/db';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { username, password } = req.body;

  // Basic validation
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Missing credentials' });
  }

  const stmt = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?');
  const user = stmt.get(username, password);

  if (user) {
    const role = username === 'admin' ? 'admin' : 'user';
    // Simple cookie, expires in 1 day
    res.setHeader('Set-Cookie', [
      `role=${role}; Path=/; Max-Age=86400`,
      `username=${encodeURIComponent(username)}; Path=/; Max-Age=86400`,
    ]);
    return res.status(200).json({ success: true, username });
  }

  return res.status(401).json({ success: false, message: 'Invalid credentials' });
} 