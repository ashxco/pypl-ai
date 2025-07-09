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
      const filter = req.query.filter || 'all';

      // Build filter conditions
      let filterCondition = '';
      let filterParams = [username];
      
      switch (filter) {
        case 'completed':
          filterCondition = 'AND t.status = ?';
          filterParams.push('completed');
          break;
        case 'pending':
          filterCondition = 'AND t.status = ?';
          filterParams.push('pending');
          break;
        case 'failed':
          filterCondition = 'AND t.status = ?';
          filterParams.push('failed');
          break;
        case 'new_transactions':
          // Transactions from the last 7 days
          filterCondition = 'AND t.transaction_date >= date(\'now\', \'-7 days\')';
          break;
        case 'new_customers':
          // Transactions from customers who made their first purchase in the last 30 days
          filterCondition = `AND c.id IN (
            SELECT customer_id 
            FROM transactions 
            WHERE user_id = ? 
            GROUP BY customer_id 
            HAVING MIN(transaction_date) >= date('now', '-30 days')
          )`;
          filterParams.push(username);
          break;
        case 'refunds':
          // Transactions with negative amounts (refunds)
          filterCondition = 'AND t.amount < 0';
          break;
        default:
          // 'all' or any other value - no additional filter
          break;
      }

      // Get total count for pagination
      const totalQuery = `
        SELECT COUNT(*) as total
        FROM transactions t
        JOIN customers c ON t.customer_id = c.id
        WHERE t.user_id = ? ${filterCondition}
      `;
      
      const totalResult = db.prepare(totalQuery).get(...filterParams);
      const total = totalResult.total;
      const totalPages = Math.ceil(total / limit);

      // Fetch transactions with joined data and pagination
      const transactionQuery = `
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
        WHERE t.user_id = ? ${filterCondition}
        ORDER BY t.transaction_date DESC
        LIMIT ? OFFSET ?
      `;
      
      const transactions = db.prepare(transactionQuery).all(...filterParams, limit, offset);

      // Get summary statistics for tabs
      const stats = {
        totalReceived: 0,
        newTransactions: 0,
        pendingPayments: 0,
        newCustomers: 0,
        refundsProcessed: 0,
        allTransactions: 0
      };

      // Calculate total received (completed transactions)
      const totalReceivedResult = db.prepare(`
        SELECT COALESCE(SUM(total), 0) as total
        FROM transactions
        WHERE user_id = ? AND status = 'completed'
      `).get(username);
      stats.totalReceived = totalReceivedResult.total;

      // Calculate new transactions (last 7 days)
      const newTransactionsResult = db.prepare(`
        SELECT COUNT(*) as count
        FROM transactions
        WHERE user_id = ? AND transaction_date >= date('now', '-7 days')
      `).get(username);
      stats.newTransactions = newTransactionsResult.count;

      // Calculate pending payments
      const pendingPaymentsResult = db.prepare(`
        SELECT COUNT(*) as count
        FROM transactions
        WHERE user_id = ? AND status = 'pending'
      `).get(username);
      stats.pendingPayments = pendingPaymentsResult.count;

      // Calculate new customers (customers who made their first purchase in the last 30 days)
      const newCustomersResult = db.prepare(`
        SELECT COUNT(DISTINCT customer_id) as count
        FROM transactions t
        WHERE user_id = ? AND customer_id IN (
          SELECT customer_id 
          FROM transactions 
          WHERE user_id = ? 
          GROUP BY customer_id 
          HAVING MIN(transaction_date) >= date('now', '-30 days')
        )
      `).get(username, username);
      stats.newCustomers = newCustomersResult.count;

      // Calculate refunds processed (negative amounts)
      const refundsResult = db.prepare(`
        SELECT COUNT(*) as count
        FROM transactions
        WHERE user_id = ? AND amount < 0
      `).get(username);
      stats.refundsProcessed = refundsResult.count;

      // Calculate total transactions count
      const allTransactionsResult = db.prepare(`
        SELECT COUNT(*) as count
        FROM transactions
        WHERE user_id = ?
      `).get(username);
      stats.allTransactions = allTransactionsResult.count;

      return res.status(200).json({ 
        transactions,
        stats,
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