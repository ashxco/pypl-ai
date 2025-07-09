import db from '../../lib/db';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username } = req.query;

  console.log('Get user details request:', { username });

  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  try {
    // Get basic user info from the actual database
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Retrieved user from database:', user);

    // Get all transactions for this user with customer names and all related data
    const transactions = db.prepare(`
      SELECT 
        t.id,
        t.customer_id,
        t.product_id,
        t.payment_method_id,
        t.amount,
        t.fees,
        t.total,
        t.transaction_date as date,
        t.status,
        c.name as customer,
        c.email as customerEmail,
        p.name as productName,
        pm.name as paymentMethod,
        'Payment' as type
      FROM transactions t
      LEFT JOIN customers c ON t.customer_id = c.id
      LEFT JOIN products p ON t.product_id = p.id
      LEFT JOIN payment_methods pm ON t.payment_method_id = pm.id
      WHERE t.user_id = ? 
      ORDER BY t.transaction_date DESC
    `).all(username);

    console.log(`Found ${transactions.length} transactions for user ${username}`);

    // Calculate analytics from real transaction data
    const completedTransactions = transactions.filter(tx => tx.status === 'completed');
    const totalTransactions = transactions.length;
    const totalSales = completedTransactions.reduce((sum, tx) => sum + tx.total, 0);
    const avgOrderValue = completedTransactions.length > 0 ? totalSales / completedTransactions.length : 0;
    
    // Calculate conversion rate
    const conversionRate = totalTransactions > 0 ? (completedTransactions.length / totalTransactions) * 100 : 0;
    
    // Count unique customers (for repeat customers calculation)
    const customerTransactionCounts = {};
    completedTransactions.forEach(tx => {
      customerTransactionCounts[tx.customer] = (customerTransactionCounts[tx.customer] || 0) + 1;
    });
    const repeatCustomers = Object.values(customerTransactionCounts).filter(count => count > 1).length;
    
    // Calculate PayPal percentage (assuming all are PayPal for now)
    const paypalPercentage = 100;

    // Use stored balance from database, fallback to calculated if not set
    const storedBalance = user.balance || 0;
    const calculatedBalance = completedTransactions.reduce((sum, tx) => sum + tx.total, 0);

    // Build comprehensive user data from real database data
    const userData = {
      // Basic info from database
      username: user.username,
      password: user.password,
      
      // Extended user data - use actual database values or fallbacks
      fullName: user.full_name || (username === 'admin' ? 'Administrator' : `${username.charAt(0).toUpperCase()}${username.slice(1)} User`),
      businessName: user.business_name || null,
      email: user.email || `${username}@paypal.com`,
      phone: `+1 (555) 123-4567`, // Still mock data as not in DB
      role: username === 'admin' ? 'Administrator' : 'User',
      
      // Account status
      status: 'Active',
      createdDate: new Date('2023-01-01').toISOString().split('T')[0],
      lastLogin: new Date().toISOString(),
      
      // Financial data - use stored balance from database
      balance: storedBalance,
      currency: 'USD',
      
      // Analytics data calculated from real transactions
      analytics: {
        totalSales: totalSales,
        totalTransactions: totalTransactions,
        avgOrderValue: avgOrderValue,
        repeatCustomers: repeatCustomers,
        conversionRate: parseFloat(conversionRate.toFixed(1)),
        paypalPercentage: paypalPercentage
      },
      
      // All transactions from database
      recentTransactions: transactions.map(tx => ({
        id: `TXN-${tx.id.toString().padStart(3, '0')}`,
        rawId: tx.id,
        customerId: tx.customer_id,
        productId: tx.product_id,
        paymentMethodId: tx.payment_method_id,
        date: tx.date,
        type: tx.type,
        customer: tx.customer || 'Unknown Customer',
        customerEmail: tx.customerEmail,
        productName: tx.productName,
        paymentMethod: tx.paymentMethod,
        amount: tx.amount,
        fees: tx.fees,
        total: tx.total,
        status: tx.status.charAt(0).toUpperCase() + tx.status.slice(1)
      }))
    };

    console.log('Sending user data with real transactions:', {
      username: userData.username,
      transactionCount: userData.recentTransactions.length,
      totalSales: userData.analytics.totalSales,
      storedBalance: userData.balance,
      calculatedBalance: calculatedBalance,
      balanceSource: 'database'
    });

    res.status(200).json(userData);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

 