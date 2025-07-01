import db from '../../lib/db';

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Get current user from cookie
    const username = req.cookies.username;
    if (!username) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
      // Get pagination parameters
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      // Get total count for pagination
      const totalResult = db.prepare(`
        SELECT COUNT(*) as total
        FROM transactions t
        WHERE t.user_id = ?
      `).get(username);
      
      const total = totalResult.total;
      const totalPages = Math.ceil(total / limit);

      // Fetch transactions with joined data and pagination
      const transactions = db.prepare(`
        SELECT 
          t.id,
          t.transaction_date as date,
          c.name,
          c.email,
          pm.name as paymentMethod,
          p.name as productName,
          t.amount,
          t.fees,
          t.total,
          t.status
        FROM transactions t
        JOIN customers c ON t.customer_id = c.id
        JOIN products p ON t.product_id = p.id
        JOIN payment_methods pm ON t.payment_method_id = pm.id
        WHERE t.user_id = ?
        ORDER BY t.transaction_date DESC
        LIMIT ? OFFSET ?
      `).all(username, limit, offset);

      return res.status(200).json({ 
        transactions,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      });
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to fetch transactions' });
    }
  } else {
    return res.status(405).end();
  }
} 