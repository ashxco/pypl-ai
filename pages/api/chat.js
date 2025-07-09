import db from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, messages } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Get current user from cookies
  const username = req.cookies.username;
  if (!username) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OpenRouter API key not configured' });
  }

  try {
    console.log('Fetching user data for:', username);
    
    // Get user's financial data from database
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's recent transactions (last 20 for context)
    const recentTransactions = db.prepare(`
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
        pm.name as paymentMethod
      FROM transactions t
      LEFT JOIN customers c ON t.customer_id = c.id
      LEFT JOIN products p ON t.product_id = p.id
      LEFT JOIN payment_methods pm ON t.payment_method_id = pm.id
      WHERE t.user_id = ? 
      ORDER BY t.transaction_date DESC
      LIMIT 20
    `).all(username);

    // Calculate analytics
    const allTransactions = db.prepare(`
      SELECT * FROM transactions WHERE user_id = ? AND status = 'completed'
    `).all(username);
    
    const totalSales = allTransactions.reduce((sum, tx) => sum + tx.total, 0);
    const totalTransactions = allTransactions.length;
    const avgOrderValue = totalTransactions > 0 ? totalSales / totalTransactions : 0;
    
    // Get unique customers
    const uniqueCustomers = new Set(allTransactions.map(tx => tx.customer_id));
    const uniqueCustomerCount = uniqueCustomers.size;
    
    // Calculate recent activity (last 7 days)
    const recentActivity = db.prepare(`
      SELECT COUNT(*) as count, SUM(total) as total
      FROM transactions 
      WHERE user_id = ? AND status = 'completed' 
      AND date(transaction_date) >= date('now', '-7 days')
    `).get(username);

    // Get top customers by total sales
    const topCustomers = db.prepare(`
      SELECT 
        c.name,
        c.email,
        COUNT(t.id) as transaction_count,
        SUM(t.total) as total_spent
      FROM transactions t
      JOIN customers c ON t.customer_id = c.id
      WHERE t.user_id = ? AND t.status = 'completed'
      GROUP BY t.customer_id, c.name, c.email
      ORDER BY total_spent DESC
      LIMIT 5
    `).all(username);

    // Get top products by sales
    const topProducts = db.prepare(`
      SELECT 
        p.name,
        COUNT(t.id) as sales_count,
        SUM(t.total) as total_revenue
      FROM transactions t
      JOIN products p ON t.product_id = p.id
      WHERE t.user_id = ? AND t.status = 'completed'
      GROUP BY t.product_id, p.name
      ORDER BY total_revenue DESC
      LIMIT 5
    `).all(username);

    const userData = {
      username: user.username,
      fullName: user.full_name || username,
      email: user.email || `${username}@paypal.com`,
      balance: user.balance || 0,
      totalSales: totalSales,
      totalTransactions: totalTransactions,
      avgOrderValue: avgOrderValue,
      uniqueCustomers: uniqueCustomerCount,
      recentWeekActivity: {
        transactions: recentActivity.count || 0,
        sales: recentActivity.total || 0
      },
      recentTransactions: recentTransactions.slice(0, 10), // Last 10 for context
      topCustomers: topCustomers,
      topProducts: topProducts
    };

    console.log('User financial data loaded:', {
      username: userData.username,
      balance: userData.balance,
      totalSales: userData.totalSales,
      recentTransactions: userData.recentTransactions.length
    });

    console.log('Sending request to OpenRouter...');
    
    // Prepare the conversation history
    const conversationHistory = (messages || []).map(msg => ({
      role: msg.type === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    // Add the current message
    conversationHistory.push({
      role: 'user',
      content: message
    });

    // Add system message with user's financial data for context
    const systemMessage = {
      role: 'system',
      content: `You are a helpful AI assistant for PayPal business users. You help with business analytics, transaction management, payment processing, and general business advice. Keep responses concise and business-focused.

CURRENT USER FINANCIAL DATA:
- Business Name: ${userData.fullName}
- Username: ${userData.username}
- Email: ${userData.email}
- Current Balance: $${userData.balance.toFixed(2)}
- Total Sales (All Time): $${userData.totalSales.toFixed(2)}
- Total Transactions: ${userData.totalTransactions}
- Average Order Value: $${userData.avgOrderValue.toFixed(2)}
- Unique Customers: ${userData.uniqueCustomers}
- Recent Activity (Last 7 Days): ${userData.recentWeekActivity.transactions} transactions, $${userData.recentWeekActivity.sales.toFixed(2)} in sales

RECENT TRANSACTIONS (Last 10):
${userData.recentTransactions.map((tx, i) => 
  `${i + 1}. ${tx.date} - ${tx.customer} - ${tx.productName} - $${tx.total.toFixed(2)} (${tx.status})`
).join('\n')}

TOP CUSTOMERS BY REVENUE:
${userData.topCustomers.map((customer, i) => 
  `${i + 1}. ${customer.name} (${customer.email}) - ${customer.transaction_count} transactions, $${customer.total_spent.toFixed(2)} total`
).join('\n')}

TOP PRODUCTS BY REVENUE:
${userData.topProducts.map((product, i) => 
  `${i + 1}. ${product.name} - ${product.sales_count} sales, $${product.total_revenue.toFixed(2)} revenue`
).join('\n')}

Use this data to provide personalized insights and recommendations. When users ask about their finances, transactions, customers, or business performance, reference this specific data. Always use actual numbers from their account rather than generic examples. Provide actionable business insights based on their real data.

FORMATTING INSTRUCTIONS:
- Use markdown formatting for better readability
- Use **bold** for important numbers and key insights
- Use bullet points for lists and recommendations
- Use headers (##) to organize longer responses
- Use code formatting for specific values or technical terms
- Keep responses well-structured and easy to scan`
    };

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'PayPal Demo App'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [systemMessage, ...conversationHistory],
        stream: true,
        max_tokens: 1000,
        temperature: 0.7
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('OpenRouter API error:', response.status, response.statusText);
      const errorData = await response.text();
      console.error('Error details:', errorData);
      return res.status(response.status).json({ error: 'Failed to get AI response' });
    }

    // Set up streaming response
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Cache-Control');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          res.write('data: [DONE]\n\n');
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              res.write('data: [DONE]\n\n');
              break;
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              
              if (content) {
                const dataToSend = `data: ${JSON.stringify({ content })}\n\n`;
                res.write(dataToSend);
                res.flush && res.flush(); // Ensure immediate sending
                console.log('Streaming chunk:', content);
              }
            } catch (e) {
              // Skip invalid JSON
              continue;
            }
          }
        }
      }
    } catch (streamError) {
      console.error('Streaming error:', streamError);
      res.write(`data: ${JSON.stringify({ error: 'Streaming error' })}\n\n`);
    }

    res.end();
  } catch (error) {
    console.error('Chat API error:', error);
    
    // Handle specific timeout errors
    if (error.name === 'AbortError') {
      return res.status(408).json({ 
        error: 'Request timeout - OpenRouter API is taking too long to respond. Please try again.' 
      });
    }
    
    // Handle connection errors
    if (error.cause?.code === 'UND_ERR_CONNECT_TIMEOUT') {
      return res.status(503).json({ 
        error: 'Unable to connect to AI service. Please check your internet connection and try again.' 
      });
    }
    
    // Handle fetch errors with fallback
    if (error.message.includes('fetch failed')) {
      console.log('OpenRouter API unavailable, providing fallback response');
      
      // Provide a helpful fallback response
      const fallbackResponse = `I'm currently experiencing connectivity issues with the AI service. However, I can see you're asking about your PayPal business account.

**Your Account Summary:**
- **Current Balance:** $${userData.balance.toFixed(2)}
- **Total Sales:** $${userData.totalSales.toFixed(2)}
- **Total Transactions:** ${userData.totalTransactions}
- **Average Order Value:** $${userData.avgOrderValue.toFixed(2)}

**Recent Activity (Last 7 Days):**
- **Transactions:** ${userData.recentWeekActivity.transactions}
- **Sales:** $${userData.recentWeekActivity.sales.toFixed(2)}

The AI service should be back online shortly. Please try your question again in a few moments for more detailed insights and analysis.`;

      // Return as streaming response format
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('Access-Control-Allow-Origin', '*');
      
      // Send the fallback response as chunks
      const chunks = fallbackResponse.split(' ');
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i] + (i < chunks.length - 1 ? ' ' : '');
        res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
        // Small delay to simulate streaming
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      res.write('data: [DONE]\n\n');
      res.end();
      return;
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
} 