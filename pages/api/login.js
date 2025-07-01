import db from '../../lib/db';

export default function handler(req, res) {
  if (req.method === 'POST') {
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
  } else if (req.method === 'GET') {
    // Get balance for current user from cookie
    const username = req.cookies.username;
    if (!username) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const row = db.prepare('SELECT balance, full_name, email FROM users WHERE username = ?').get(username);
    if (!row) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json({ 
      balance: row.balance,
      fullName: row.full_name,
      email: row.email
    });
  } else {
    return res.status(405).end();
  }
} 