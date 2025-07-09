import db from '../../lib/db';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { 
    originalUsername, 
    username, 
    password, 
    fullName, 
    email, 
    phone, 
    status, 
    balance
  } = req.body;

  console.log('Update user request:', req.body);

  if (!originalUsername || !username || !password) {
    return res.status(400).json({ message: 'Missing required fields (username, password)' });
  }

  try {
    // Check if the new username already exists (unless it's the same as the original)
    if (originalUsername !== username) {
      const existingUser = db.prepare('SELECT username FROM users WHERE username = ?').get(username);
      if (existingUser) {
        return res.status(409).json({ message: 'Username already exists' });
      }
    }

    // Update the user - now including full_name, email, and balance fields that exist in the database
    const updateStmt = db.prepare('UPDATE users SET username = ?, password = ?, full_name = ?, email = ?, balance = ? WHERE username = ?');
    const result = updateStmt.run(username, password, fullName, email, balance || 0, originalUsername);

    console.log('Update result:', result);

    if (result.changes === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Note: fullName, email, and balance are now stored in the database and updated above.
    // Additional fields like phone and status could be added to the schema in the future.
    // Analytics fields (totalSales, totalTransactions, avgOrderValue, etc.) 
    // are calculated from actual transaction data and not manually editable.
    
    console.log('Updated user in database. Additional profile fields for future implementation:', {
      phone, status
    });

    res.status(200).json({ 
      message: 'User updated successfully',
      updatedFields: {
        username,
        fullName,
        email,
        balance
      }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 