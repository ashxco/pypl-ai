import db from '../../lib/db';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { 
    transactionId,
    customerId,
    productId,
    paymentMethodId,
    amount,
    fees,
    total,
    status
  } = req.body;

  console.log('Update transaction request:', req.body);

  if (!transactionId || !customerId || !productId || !paymentMethodId || amount === undefined || fees === undefined || total === undefined || !status) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Validate that the referenced records exist
    const customer = db.prepare('SELECT id FROM customers WHERE id = ?').get(customerId);
    if (!customer) {
      return res.status(400).json({ message: 'Invalid customer ID' });
    }

    const product = db.prepare('SELECT id FROM products WHERE id = ?').get(productId);
    if (!product) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const paymentMethod = db.prepare('SELECT id FROM payment_methods WHERE id = ?').get(paymentMethodId);
    if (!paymentMethod) {
      return res.status(400).json({ message: 'Invalid payment method ID' });
    }

    // Update the transaction
    const updateStmt = db.prepare(`
      UPDATE transactions 
      SET customer_id = ?, product_id = ?, payment_method_id = ?, amount = ?, fees = ?, total = ?, status = ?
      WHERE id = ?
    `);
    
    const result = updateStmt.run(customerId, productId, paymentMethodId, amount, fees, total, status, transactionId);

    console.log('Transaction update result:', result);

    if (result.changes === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Get the updated transaction with joined data
    const updatedTransaction = db.prepare(`
      SELECT 
        t.id,
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
      WHERE t.id = ?
    `).get(transactionId);

    console.log('Updated transaction data:', updatedTransaction);

    res.status(200).json({
      message: 'Transaction updated successfully',
      transaction: updatedTransaction
    });
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 