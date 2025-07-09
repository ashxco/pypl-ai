import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import db from '../../lib/db';

export async function getServerSideProps({ req, params }) {
  const cookies = req.headers.cookie || '';
  const isAdmin = cookies.split(';').some((c) => c.trim().startsWith('role=admin'));

  if (!isAdmin) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  try {
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(params.username);
    
    if (!user) {
      return {
        notFound: true,
      };
    }

    return {
      props: { 
        user,
        username: params.username
      },
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return {
      notFound: true,
    };
  }
}

export default function UserDetails({ user: initialUser, username }) {
  const router = useRouter();
  const [user, setUser] = useState(initialUser);
  const [isLoading, setIsLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [transactionOptions, setTransactionOptions] = useState({
    customers: [],
    paymentMethods: [],
    products: [],
    statusOptions: []
  });

  console.log('User details page loaded for:', username, initialUser);

  useEffect(() => {
    if (username) {
      fetchUserDetails(username);
    }
  }, [username]);

  const fetchUserDetails = async (username) => {
    try {
      console.log('Fetching comprehensive user details for:', username);
      const response = await fetch(`/api/getUserDetails?username=${username}`);
      const data = await response.json();
      console.log('User details response:', data);
      
      if (response.ok) {
        setUser(data);
      } else {
        console.error('Failed to fetch user details:', data.message);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleBackToAdmin = () => {
    router.push('/admin');
  };

  const handleLogout = () => {
    console.log('Logging out admin user');
    // Clear the admin cookie
    document.cookie = 'role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    // Redirect to login page
    router.push('/login');
  };

  const handleEditUser = () => {
    console.log('Opening edit modal for user:', user);
    setEditFormData({
      username: user.username || '',
      password: user.password || '',
      fullName: user.fullName || '',
      email: user.email || '',
      phone: user.phone || '',
      status: user.status || 'Active',
      balance: user.balance || 0
    });
    setShowEditModal(true);
  };

  const handleDeleteUser = async () => {
    if (!confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/deleteUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
        }),
      });

      if (response.ok) {
        console.log('User deleted successfully');
        alert('User deleted successfully');
        router.push('/admin');
      } else {
        console.error('Failed to delete user');
        alert('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    if (!status || typeof status !== 'string') {
      return { bg: '#f9fafb', color: '#374151', border: '#d1d5db' };
    }
    
    switch (status.toLowerCase()) {
      case 'completed':
        return { bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' };
      case 'pending':
        return { bg: '#fef3c7', color: '#92400e', border: '#fcd34d' };
      case 'failed':
        return { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' };
      case 'active':
        return { bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' };
      case 'verified':
        return { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' };
      default:
        return { bg: '#f9fafb', color: '#374151', border: '#d1d5db' };
    }
  };

  const handleEditFormChange = (field, value) => {
    console.log('Form field changed:', field, value);
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveUser = async () => {
    console.log('Saving user with data:', editFormData);
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/updateUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalUsername: username,
          ...editFormData
        }),
      });

      if (response.ok) {
        console.log('User updated successfully');
        setShowEditModal(false);
        // Refresh user data
        await fetchUserDetails(editFormData.username);
        // If username changed, redirect to new URL
        if (editFormData.username !== username) {
          router.push(`/user/${editFormData.username}`);
        }
      } else {
        const errorData = await response.json();
        console.error('Failed to update user:', errorData.message);
        alert('Failed to update user: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransactionClick = async (transaction) => {
    console.log('Editing transaction:', transaction);
    setEditingTransaction({
      id: transaction.rawId,
      customerId: transaction.customerId,
      productId: transaction.productId,
      paymentMethodId: transaction.paymentMethodId,
      amount: transaction.amount,
      fees: transaction.fees,
      total: transaction.total,
      status: transaction.status.toLowerCase()
    });
    
    // Fetch dropdown options
    try {
      const response = await fetch(`/api/getTransactionOptions?username=${username}`);
      if (response.ok) {
        const options = await response.json();
        setTransactionOptions(options);
        setShowTransactionModal(true);
      } else {
        console.error('Failed to fetch transaction options');
        alert('Failed to load transaction options');
      }
    } catch (error) {
      console.error('Error fetching transaction options:', error);
      alert('Error loading transaction options');
    }
  };

  const handleTransactionFormChange = (field, value) => {
    console.log('Transaction form field changed:', field, value);
    
    setEditingTransaction(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate fees and total when amount changes
      if (field === 'amount') {
        const amount = parseFloat(value) || 0;
        // Calculate fees: 2.9% + $0.30 (typical PayPal fee structure)
        const calculatedFees = Math.round((amount * 0.029 + 0.30) * 100) / 100;
        const calculatedTotal = Math.round((amount - calculatedFees) * 100) / 100;
        
        updated.fees = calculatedFees;
        updated.total = calculatedTotal;
        
        console.log('Auto-calculated fees and total:', {
          amount: amount,
          fees: calculatedFees,
          total: calculatedTotal
        });
      }
      
      // Recalculate total when fees change manually
      if (field === 'fees') {
        const amount = parseFloat(prev.amount) || 0;
        const fees = parseFloat(value) || 0;
        const calculatedTotal = Math.round((amount - fees) * 100) / 100;
        
        updated.total = calculatedTotal;
        
        console.log('Recalculated total from manual fees:', {
          amount: amount,
          fees: fees,
          total: calculatedTotal
        });
      }
      
      return updated;
    });
  };

  const handleSaveTransaction = async () => {
    console.log('Saving transaction with data:', editingTransaction);
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/updateTransaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId: editingTransaction.id,
          customerId: editingTransaction.customerId,
          productId: editingTransaction.productId,
          paymentMethodId: editingTransaction.paymentMethodId,
          amount: parseFloat(editingTransaction.amount),
          fees: parseFloat(editingTransaction.fees),
          total: parseFloat(editingTransaction.total),
          status: editingTransaction.status
        }),
      });

      if (response.ok) {
        console.log('Transaction updated successfully');
        setShowTransactionModal(false);
        // Refresh user data to show updated transaction
        await fetchUserDetails(username);
      } else {
        const errorData = await response.json();
        console.error('Failed to update transaction:', errorData.message);
        alert('Failed to update transaction: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
      alert('Error updating transaction');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h1 style={{ color: '#333', marginBottom: '20px' }}>Loading...</h1>
          <p style={{ color: '#666', marginBottom: '30px' }}>Fetching user details...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      overflowX: 'hidden',
      overflowY: 'auto'
    }}>
      {/* Header with Navigation Links */}
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
        padding: '16px 32px',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={handleBackToAdmin}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#64748b',
                fontSize: '14px',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(100, 116, 139, 0.1)';
                e.target.style.color = '#1e293b';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'none';
                e.target.style.color = '#64748b';
              }}
            >
              ← Back to Admin
            </button>
            <div style={{ 
              height: '20px', 
              width: '1px', 
              background: '#e2e8f0' 
            }}></div>
            <h1 style={{ 
              margin: 0, 
              fontSize: '20px',
              fontWeight: '600',
              color: '#1e293b'
            }}>
              {user.fullName || user.username}
            </h1>
          </div>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              onClick={handleEditUser}
              style={{
                background: 'none',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                color: '#64748b',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#f8fafc';
                e.target.style.borderColor = '#cbd5e1';
                e.target.style.color = '#1e293b';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'none';
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.color = '#64748b';
              }}
            >
              Edit User
            </button>
            <button
              onClick={handleDeleteUser}
              disabled={isLoading}
              style={{
                background: 'none',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '8px 16px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                color: '#dc2626',
                transition: 'all 0.2s ease',
                opacity: isLoading ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.background = '#fef2f2';
                  e.target.style.borderColor = '#fca5a5';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.background = 'none';
                  e.target.style.borderColor = '#fecaca';
                }
              }}
            >
              {isLoading ? 'Deleting...' : 'Delete User'}
            </button>
            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                color: '#64748b',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#fef2f2';
                e.target.style.borderColor = '#fca5a5';
                e.target.style.color = '#dc2626';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'none';
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.color = '#64748b';
              }}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        padding: '32px', 
        maxWidth: '1200px', 
        margin: '0 auto',
        width: '100%',
        minHeight: 'calc(100vh - 80px)' // Account for header height
      }}>
        {/* User Profile Section */}
        <div style={{ 
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          marginBottom: '32px'
        }}>
          <div style={{ 
            padding: '32px', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '24px'
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              fontWeight: '700',
              flexShrink: 0,
              border: '3px solid rgba(255, 255, 255, 0.3)'
            }}>
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{
                margin: 0,
                fontSize: '32px',
                fontWeight: '700'
              }}>
                {user.fullName || user.username}
              </h2>
              <p style={{
                margin: '8px 0 0 0',
                fontSize: '18px',
                opacity: 0.9
              }}>
                {user.email} • {user.phone}
              </p>
              <div style={{
                marginTop: '16px',
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap'
              }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  {user.status}
                </div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Member since {formatDate(user.createdDate)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Summary Table */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          marginBottom: '32px'
        }}>
          <h3 style={{
            margin: '0 0 20px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: '#1e293b'
          }}>
            Account Summary
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Metric
                  </th>
                  <th style={{
                    padding: '12px 16px',
                    textAlign: 'right',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#374151',
                    fontWeight: '500'
                  }}>
                    Account Balance
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#374151',
                    textAlign: 'right',
                    fontWeight: '600'
                  }}>
                    {formatCurrency(user.balance)}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#374151',
                    fontWeight: '500'
                  }}>
                    Total Sales
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#374151',
                    textAlign: 'right',
                    fontWeight: '600'
                  }}>
                    {formatCurrency(user.analytics?.totalSales || 0)}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#374151',
                    fontWeight: '500'
                  }}>
                    Total Transactions
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#374151',
                    textAlign: 'right',
                    fontWeight: '600'
                  }}>
                    {user.analytics?.totalTransactions || 0}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#374151',
                    fontWeight: '500'
                  }}>
                    Avg Order Value
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#374151',
                    textAlign: 'right',
                    fontWeight: '600'
                  }}>
                    {formatCurrency(user.analytics?.avgOrderValue || 0)}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#374151',
                    fontWeight: '500'
                  }}>
                    Repeat Customers
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#374151',
                    textAlign: 'right',
                    fontWeight: '600'
                  }}>
                    {user.analytics?.repeatCustomers || 0}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#374151',
                    fontWeight: '500'
                  }}>
                    Conversion Rate
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#374151',
                    textAlign: 'right',
                    fontWeight: '600'
                  }}>
                    {user.analytics?.conversionRate || 0}%
                  </td>
                </tr>
                <tr>
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#374151',
                    fontWeight: '500'
                  }}>
                    PayPal Transactions
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#374151',
                    textAlign: 'right',
                    fontWeight: '600'
                  }}>
                    {user.analytics?.paypalPercentage || 0}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* All Transactions */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          marginBottom: '32px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <div>
              <h3 style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: '600',
                color: '#1e293b'
              }}>
                All Transactions
              </h3>
              <p style={{
                margin: '4px 0 0 0',
                fontSize: '12px',
                color: '#64748b',
                fontStyle: 'italic'
              }}>
                Click any transaction to edit its details
              </p>
            </div>
            <span style={{
              background: '#f3f4f6',
              color: '#6b7280',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              {user.recentTransactions?.length || 0} transactions
            </span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Date
                  </th>
                  <th style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Customer
                  </th>
                  <th style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Product
                  </th>
                  <th style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Payment Method
                  </th>
                  <th style={{
                    padding: '12px 16px',
                    textAlign: 'right',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Amount
                  </th>
                  <th style={{
                    padding: '12px 16px',
                    textAlign: 'right',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Fees
                  </th>
                  <th style={{
                    padding: '12px 16px',
                    textAlign: 'right',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Total
                  </th>
                  <th style={{
                    padding: '12px 16px',
                    textAlign: 'center',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {user.recentTransactions?.map((transaction, index) => (
                  <tr 
                    key={index} 
                    style={{ 
                      borderBottom: '1px solid #f3f4f6',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease'
                    }}
                    onClick={() => handleTransactionClick(transaction)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <td style={{
                      padding: '12px 16px',
                      fontSize: '14px',
                      color: '#374151'
                    }}>
                      {formatDate(transaction.date)}
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      fontSize: '14px',
                      color: '#374151'
                    }}>
                      <div>
                        <div style={{ fontWeight: '500' }}>{transaction.customer}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{transaction.customerEmail}</div>
                      </div>
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      fontSize: '14px',
                      color: '#374151'
                    }}>
                      {transaction.productName}
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      fontSize: '14px',
                      color: '#374151'
                    }}>
                      {transaction.paymentMethod}
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      fontSize: '14px',
                      color: '#374151',
                      textAlign: 'right',
                      fontWeight: '600'
                    }}>
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      fontSize: '14px',
                      color: '#dc2626',
                      textAlign: 'right',
                      fontWeight: '500'
                    }}>
                      -{formatCurrency(transaction.fees)}
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      fontSize: '14px',
                      color: '#374151',
                      textAlign: 'right',
                      fontWeight: '700'
                    }}>
                      {formatCurrency(transaction.total)}
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      textAlign: 'center'
                    }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: getStatusColor(transaction.status).bg,
                        color: getStatusColor(transaction.status).color,
                        border: `1px solid ${getStatusColor(transaction.status).border}`
                      }}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit User Modal */}
        {showEditModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '32px',
              width: '100%',
              maxWidth: '800px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
                paddingBottom: '16px',
                borderBottom: '1px solid #e2e8f0'
              }}>
                <h2 style={{
                  margin: 0,
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#1e293b'
                }}>
                  Edit User Details
                </h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#64748b',
                    padding: '4px',
                    borderRadius: '4px'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#1e293b'}
                  onMouseLeave={(e) => e.target.style.color = '#64748b'}
                >
                  ×
                </button>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px',
                marginBottom: '32px'
              }}>
                {/* Basic Information */}
                <div>
                  <h3 style={{
                    margin: '0 0 16px 0',
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1e293b'
                  }}>
                    Basic Information
                  </h3>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151'
                    }}>
                      Username
                    </label>
                    <input
                      type="text"
                      value={editFormData.username || ''}
                      onChange={(e) => handleEditFormChange('username', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151'
                    }}>
                      Password
                    </label>
                    <input
                      type="password"
                      value={editFormData.password || ''}
                      onChange={(e) => handleEditFormChange('password', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151'
                    }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editFormData.fullName || ''}
                      onChange={(e) => handleEditFormChange('fullName', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151'
                    }}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={editFormData.email || ''}
                      onChange={(e) => handleEditFormChange('email', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151'
                    }}>
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={editFormData.phone || ''}
                      onChange={(e) => handleEditFormChange('phone', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151'
                    }}>
                      Status
                    </label>
                    <select
                      value={editFormData.status || 'Active'}
                      onChange={(e) => handleEditFormChange('status', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Suspended">Suspended</option>
                      <option value="Verified">Verified</option>
                    </select>
                  </div>
                </div>

                {/* Account Settings */}
                <div>
                  <h3 style={{
                    margin: '0 0 16px 0',
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1e293b'
                  }}>
                    Account Settings
                  </h3>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151'
                    }}>
                      Account Balance ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editFormData.balance || 0}
                      onChange={(e) => handleEditFormChange('balance', parseFloat(e.target.value) || 0)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                    />
                    <p style={{
                      margin: '6px 0 0 0',
                      fontSize: '12px',
                      color: '#6b7280',
                      fontStyle: 'italic'
                    }}>
                      Manually adjustable for refunds, bonuses, or corrections
                    </p>
                  </div>

                  <div style={{
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '16px'
                  }}>
                    <h4 style={{
                      margin: '0 0 8px 0',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151'
                    }}>
                      📊 Analytics Note
                    </h4>
                    <p style={{
                      margin: 0,
                      fontSize: '12px',
                      color: '#6b7280',
                      lineHeight: '1.5'
                    }}>
                      Metrics like Total Sales, Total Transactions, Average Order Value, etc. are automatically calculated from actual transaction data and cannot be manually edited.
                    </p>
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                paddingTop: '16px',
                borderTop: '1px solid #e2e8f0'
              }}>
                <button
                  onClick={() => setShowEditModal(false)}
                  style={{
                    padding: '12px 24px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    background: '#ffffff',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#f9fafb';
                    e.target.style.borderColor = '#9ca3af';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#ffffff';
                    e.target.style.borderColor = '#d1d5db';
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveUser}
                  disabled={isLoading}
                  style={{
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '8px',
                    background: isLoading ? '#9ca3af' : '#3b82f6',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.target.style.background = '#2563eb';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) {
                      e.target.style.background = '#3b82f6';
                    }
                  }}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Transaction Modal */}
        {showTransactionModal && editingTransaction && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '32px',
              width: '100%',
              maxWidth: '800px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
                paddingBottom: '16px',
                borderBottom: '1px solid #e2e8f0'
              }}>
                <h2 style={{
                  margin: 0,
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#1e293b'
                }}>
                  Edit Transaction
                </h2>
                <button
                  onClick={() => setShowTransactionModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#64748b',
                    padding: '4px',
                    borderRadius: '4px'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#1e293b'}
                  onMouseLeave={(e) => e.target.style.color = '#64748b'}
                >
                  ×
                </button>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '32px'
              }}>
                {/* Transaction Details */}
                <div>
                  <h3 style={{
                    margin: '0 0 16px 0',
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1e293b'
                  }}>
                    Transaction Details
                  </h3>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151'
                    }}>
                      Customer
                    </label>
                    <select
                      value={editingTransaction.customerId || ''}
                      onChange={(e) => handleTransactionFormChange('customerId', parseInt(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="">Select Customer</option>
                      {transactionOptions.customers.map(customer => (
                        <option key={customer.id} value={customer.id}>
                          {customer.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151'
                    }}>
                      Product
                    </label>
                    <select
                      value={editingTransaction.productId || ''}
                      onChange={(e) => handleTransactionFormChange('productId', parseInt(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="">Select Product</option>
                      {transactionOptions.products.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151'
                    }}>
                      Payment Method
                    </label>
                    <select
                      value={editingTransaction.paymentMethodId || ''}
                      onChange={(e) => handleTransactionFormChange('paymentMethodId', parseInt(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="">Select Payment Method</option>
                      {transactionOptions.paymentMethods.map(method => (
                        <option key={method.id} value={method.id}>
                          {method.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151'
                    }}>
                      Status
                    </label>
                    <select
                      value={editingTransaction.status || ''}
                      onChange={(e) => handleTransactionFormChange('status', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="">Select Status</option>
                      {transactionOptions.statusOptions.map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Financial Details */}
                <div>
                  <h3 style={{
                    margin: '0 0 16px 0',
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1e293b'
                  }}>
                    Financial Details
                  </h3>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151'
                    }}>
                      Amount ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingTransaction.amount || ''}
                      onChange={(e) => handleTransactionFormChange('amount', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151'
                    }}>
                      Fees ($) <span style={{ color: '#059669', fontSize: '12px' }}>• Auto-calculated</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingTransaction.fees || ''}
                      onChange={(e) => handleTransactionFormChange('fees', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        backgroundColor: '#f8fafc'
                      }}
                      placeholder="Auto-calculated from amount"
                    />
                    <p style={{
                      margin: '4px 0 0 0',
                      fontSize: '11px',
                      color: '#6b7280',
                      fontStyle: 'italic'
                    }}>
                      Based on 2.9% + $0.30 fee structure. Can be manually adjusted.
                    </p>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151'
                    }}>
                      Net Total ($) <span style={{ color: '#059669', fontSize: '12px' }}>• Auto-calculated</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingTransaction.total || ''}
                      readOnly
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        backgroundColor: '#f9fafb',
                        color: '#374151',
                        fontWeight: '600'
                      }}
                      placeholder="Amount - Fees"
                    />
                    <p style={{
                      margin: '4px 0 0 0',
                      fontSize: '11px',
                      color: '#6b7280',
                      fontStyle: 'italic'
                    }}>
                      Net amount after fees (Amount - Fees)
                    </p>
                  </div>

                  <div style={{
                    background: '#f0f9ff',
                    border: '1px solid #bae6fd',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '16px'
                  }}>
                    <h4 style={{
                      margin: '0 0 8px 0',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#0369a1'
                    }}>
                      🤖 Auto-Calculation
                    </h4>
                    <p style={{
                      margin: 0,
                      fontSize: '12px',
                      color: '#0369a1',
                      lineHeight: '1.5'
                    }}>
                      When you enter an amount, fees and net total are automatically calculated using PayPal's 2.9% + $0.30 fee structure. You can manually adjust fees if needed.
                    </p>
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                paddingTop: '16px',
                borderTop: '1px solid #e2e8f0'
              }}>
                <button
                  onClick={() => setShowTransactionModal(false)}
                  style={{
                    padding: '12px 24px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    background: '#ffffff',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#f9fafb';
                    e.target.style.borderColor = '#9ca3af';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#ffffff';
                    e.target.style.borderColor = '#d1d5db';
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTransaction}
                  disabled={isLoading}
                  style={{
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '8px',
                    background: isLoading ? '#9ca3af' : '#059669',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.target.style.background = '#047857';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) {
                      e.target.style.background = '#059669';
                    }
                  }}
                >
                  {isLoading ? 'Saving...' : 'Save Transaction'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
} 