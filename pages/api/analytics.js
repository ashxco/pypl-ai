import db from '../../lib/db';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get user from cookies
    const username = req.cookies.username;
    if (!username) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Calculate current period metrics (last 30 days)
    const currentPeriodQuery = `
      SELECT 
        COUNT(*) as total_transactions,
        COUNT(DISTINCT customer_id) as unique_customers,
        SUM(CASE WHEN status = 'completed' THEN total ELSE 0 END) as total_sales,
        AVG(CASE WHEN status = 'completed' THEN total ELSE NULL END) as avg_order_value,
        COUNT(CASE WHEN status = 'completed' THEN 1 ELSE NULL END) as completed_transactions,
        COUNT(CASE WHEN payment_method_id IN (1, 2) THEN 1 ELSE NULL END) as paypal_transactions
      FROM transactions 
      WHERE user_id = ? 
        AND date(transaction_date) >= date('now', '-30 days')
    `;

    // Calculate previous period metrics (31-60 days ago)
    const previousPeriodQuery = `
      SELECT 
        COUNT(*) as total_transactions,
        COUNT(DISTINCT customer_id) as unique_customers,
        SUM(CASE WHEN status = 'completed' THEN total ELSE 0 END) as total_sales,
        AVG(CASE WHEN status = 'completed' THEN total ELSE NULL END) as avg_order_value,
        COUNT(CASE WHEN status = 'completed' THEN 1 ELSE NULL END) as completed_transactions,
        COUNT(CASE WHEN payment_method_id IN (1, 2) THEN 1 ELSE NULL END) as paypal_transactions
      FROM transactions 
      WHERE user_id = ? 
        AND date(transaction_date) >= date('now', '-60 days')
        AND date(transaction_date) < date('now', '-30 days')
    `;

    // Calculate repeat customers (customers with more than 1 completed transaction)
    const currentRepeatCustomersQuery = `
      SELECT COUNT(*) as repeat_customers
      FROM (
        SELECT customer_id, COUNT(*) as transaction_count
        FROM transactions 
        WHERE user_id = ? 
          AND status = 'completed'
          AND date(transaction_date) >= date('now', '-30 days')
        GROUP BY customer_id
        HAVING transaction_count > 1
      )
    `;

    const previousRepeatCustomersQuery = `
      SELECT COUNT(*) as repeat_customers
      FROM (
        SELECT customer_id, COUNT(*) as transaction_count
        FROM transactions 
        WHERE user_id = ? 
          AND status = 'completed'
          AND date(transaction_date) >= date('now', '-60 days')
          AND date(transaction_date) < date('now', '-30 days')
        GROUP BY customer_id
        HAVING transaction_count > 1
      )
    `;

    const currentMetrics = db.prepare(currentPeriodQuery).get(username);
    const previousMetrics = db.prepare(previousPeriodQuery).get(username);
    const currentRepeatCustomers = db.prepare(currentRepeatCustomersQuery).get(username);
    const previousRepeatCustomers = db.prepare(previousRepeatCustomersQuery).get(username);

    // Calculate percentage changes
    const calculateChange = (current, previous) => {
      if (!previous || previous === 0) return { trend: 'up', value: '100.0%' };
      const change = ((current - previous) / previous) * 100;
      return {
        trend: change >= 0 ? 'up' : 'down',
        value: `${Math.abs(change).toFixed(1)}%`
      };
    };

    // Calculate conversion rate (completed transactions / total transactions)
    const currentConversionRate = currentMetrics.total_transactions > 0 
      ? (currentMetrics.completed_transactions / currentMetrics.total_transactions) * 100 
      : 0;
    
    const previousConversionRate = previousMetrics.total_transactions > 0 
      ? (previousMetrics.completed_transactions / previousMetrics.total_transactions) * 100 
      : 0;

    // Calculate PayPal transaction percentage
    const paypalPercentage = currentMetrics.completed_transactions > 0 
      ? (currentMetrics.paypal_transactions / currentMetrics.completed_transactions) * 100 
      : 0;

    const analytics = {
      totalSales: {
        value: `$${(currentMetrics.total_sales || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        change: calculateChange(currentMetrics.total_sales || 0, previousMetrics.total_sales || 0),
        description: `${paypalPercentage.toFixed(0)}% of your sales are coming in through PayPal`
      },
      avgOrderValue: {
        value: `$${(currentMetrics.avg_order_value || 0).toFixed(2)}`,
        change: calculateChange(currentMetrics.avg_order_value || 0, previousMetrics.avg_order_value || 0),
        description: "Pay Later AOV is 16% higher with messaging",
        link: "Set up messaging"
      },
      repeatCustomers: {
        value: (currentRepeatCustomers.repeat_customers || 0).toLocaleString(),
        change: calculateChange(currentRepeatCustomers.repeat_customers || 0, previousRepeatCustomers.repeat_customers || 0),
        description: `${currentRepeatCustomers.repeat_customers || 0} customers made multiple purchases, showing strong customer loyalty`
      },
      conversionRate: {
        value: `${currentConversionRate.toFixed(1)}%`,
        change: calculateChange(currentConversionRate, previousConversionRate),
        description: "Desktop transactions show a higher conversion rate - optimizing your mobile flows could boost performance"
      }
    };

    res.status(200).json(analytics);

  } catch (error) {
    console.error('Analytics API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 