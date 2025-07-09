import db from '../../lib/db';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username } = req.query;

  console.log('Get transaction options request for user:', username);

  try {
    // Get all customers
    const customers = db.prepare('SELECT id, name, email FROM customers ORDER BY name').all();
    
    // Get all payment methods
    const paymentMethods = db.prepare('SELECT id, name, type FROM payment_methods ORDER BY name').all();
    
    // Get products for the specific user (or all products if no user specified)
    let products;
    if (username) {
      products = db.prepare('SELECT id, name, price FROM products WHERE user_id = ? ORDER BY name').all(username);
    } else {
      products = db.prepare('SELECT id, name, price FROM products ORDER BY name').all();
    }

    // Status options
    const statusOptions = [
      { value: 'completed', label: 'Completed' },
      { value: 'pending', label: 'Pending' },
      { value: 'failed', label: 'Failed' },
      { value: 'cancelled', label: 'Cancelled' }
    ];

    const options = {
      customers: customers.map(c => ({
        id: c.id,
        name: c.name,
        email: c.email,
        label: `${c.name} (${c.email})`
      })),
      paymentMethods: paymentMethods.map(pm => ({
        id: pm.id,
        name: pm.name,
        type: pm.type,
        label: pm.name
      })),
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        label: `${p.name} - $${p.price}`
      })),
      statusOptions: statusOptions
    };

    console.log('Transaction options:', {
      customers: options.customers.length,
      paymentMethods: options.paymentMethods.length,
      products: options.products.length,
      statusOptions: options.statusOptions.length
    });

    res.status(200).json(options);
  } catch (error) {
    console.error('Error fetching transaction options:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 