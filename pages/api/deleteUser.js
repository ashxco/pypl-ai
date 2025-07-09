import db from '../../lib/db';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username } = req.body;

  console.log('Delete user request:', { username });

  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  try {
    // Delete the user
    const deleteStmt = db.prepare('DELETE FROM users WHERE username = ?');
    const result = deleteStmt.run(username);

    console.log('Delete result:', result);

    if (result.changes === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 