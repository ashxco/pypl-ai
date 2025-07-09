import db from '../lib/db';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Button from '../components/Button';

export async function getServerSideProps({ req }) {
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

  const rows = db.prepare('SELECT username, password, balance, full_name, email, business_name FROM users').all();
  return {
    props: { users: rows },
  };
}

export default function Admin({ users: initialUsers }) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(null); // 'edit', 'delete'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  console.log('Admin page rendered with users:', users);

  const handleAction = (user, action) => {
    console.log('Action triggered:', action, 'for user:', user);
    
    if (action === 'view') {
      // Navigate to user details page
      router.push(`/user/${user.username}`);
      return;
    }
    
    setSelectedUser(user);
    setModalType(action);
    setFormData({ username: user.username, password: user.password });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log('Closing modal');
    setIsModalOpen(false);
    setSelectedUser(null);
    setModalType(null);
    setFormData({ username: '', password: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log('Form input changed:', name, value);
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    console.log('Submitting form data:', formData);
    console.log('Original user:', selectedUser);

    try {
      const response = await fetch('/api/updateUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalUsername: selectedUser.username,
          newUsername: formData.username,
          newPassword: formData.password,
        }),
      });

      if (response.ok) {
        console.log('User updated successfully');
        // Update the local state
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.username === selectedUser.username 
              ? { username: formData.username, password: formData.password }
              : user
          )
        );
        handleCloseModal();
      } else {
        console.error('Failed to update user');
        alert('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    
    console.log('Deleting user:', selectedUser);

    try {
      const response = await fetch('/api/deleteUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: selectedUser.username,
        }),
      });

      if (response.ok) {
        console.log('User deleted successfully');
        // Update the local state
        setUsers(prevUsers => 
          prevUsers.filter(user => user.username !== selectedUser.username)
        );
        handleCloseModal();
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

  const renderModalContent = () => {
    switch (modalType) {
      case 'edit':
        return (
          <div>
            <h2 style={{ 
              marginTop: 0, 
              marginBottom: '20px',
              color: '#1e293b',
              fontSize: '24px',
              fontWeight: '700'
            }}>
              Edit Credentials
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Username:
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#000'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  required
                />
              </div>
              
              <div style={{ marginBottom: '32px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Password:
                </label>
                <input
                  type="text"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#000'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  required
                />
              </div>
              
              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                justifyContent: 'flex-end' 
              }}>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCloseModal}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        );

      case 'delete':
        return (
          <div>
            <h2 style={{ 
              marginTop: 0, 
              marginBottom: '20px',
              color: '#dc2626',
              fontSize: '24px',
              fontWeight: '700'
            }}>
              Delete User
            </h2>
            
            <p style={{ 
              marginBottom: '32px',
              color: '#6b7280',
              fontSize: '16px',
              lineHeight: '1.5'
            }}>
              Are you sure you want to delete <strong>{selectedUser?.username}</strong>? This action cannot be undone.
            </p>
            
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              justifyContent: 'flex-end' 
            }}>
              <Button
                type="button"
                variant="secondary"
                onClick={handleCloseModal}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleDelete}
                disabled={isLoading}
                style={{
                  background: isLoading ? '#dc2626' : '#dc2626',
                  opacity: isLoading ? 0.6 : 1
                }}
                onMouseEnter={(e) => !isLoading && (e.target.style.background = '#b91c1c')}
                onMouseLeave={(e) => !isLoading && (e.target.style.background = '#dc2626')}
              >
                {isLoading ? 'Deleting...' : 'Delete User'}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const handleLogout = () => {
    console.log('Logging out admin user');
    // Clear the admin cookie
    document.cookie = 'role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    // Redirect to login page
    router.push('/login');
  };

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
            <h1 style={{ 
              margin: 0, 
              fontSize: '20px',
              fontWeight: '600',
              color: '#1e293b'
            }}>
              Admin Panel
            </h1>
            <div style={{ 
              height: '20px', 
              width: '1px', 
              background: '#e2e8f0' 
            }}></div>
            <span style={{
              fontSize: '14px',
              color: '#64748b',
              fontWeight: '500'
            }}>
              User Management System
            </span>
          </div>
          
          <div style={{ display: 'flex', gap: '16px' }}>
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
        
        <div style={{ 
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}>
          <div style={{ 
            padding: '24px 32px', 
            borderBottom: '1px solid #e2e8f0',
            background: 'rgba(248, 250, 252, 0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ 
                  margin: 0, 
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#1e293b'
                }}>
                  Users ({users.length})
                </h2>
                <p style={{
                  margin: '4px 0 0 0',
                  fontSize: '13px',
                  color: '#64748b',
                  fontStyle: 'italic'
                }}>
                  Click any row to view detailed user information
                </p>
              </div>
            </div>
          </div>
          
          <div style={{ overflow: 'hidden' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              fontSize: '14px'
            }}>
              <thead>
                <tr style={{ 
                  background: '#f8fafc',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  <th style={{ 
                    padding: '16px 24px', 
                    textAlign: 'left', 
                    fontWeight: '600',
                    color: '#374151',
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    User
                  </th>
                  <th style={{ 
                    padding: '16px 24px', 
                    textAlign: 'left', 
                    fontWeight: '600',
                    color: '#374151',
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Contact
                  </th>
                  <th style={{ 
                    padding: '16px 24px', 
                    textAlign: 'right', 
                    fontWeight: '600',
                    color: '#374151',
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Balance
                  </th>
                  <th style={{ 
                    padding: '16px 24px', 
                    textAlign: 'center', 
                    fontWeight: '600',
                    color: '#374151',
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr 
                    key={user.username} 
                    style={{ 
                      borderBottom: index === users.length - 1 ? 'none' : '1px solid #f1f5f9',
                      transition: 'background-color 0.15s ease',
                      cursor: 'pointer'
                    }}
                    onClick={() => router.push(`/user/${user.username}`)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <td style={{ 
                      padding: '20px 24px',
                      color: '#1e293b'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: '#e0e9fd',
                          color: '#002991',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: '600',
                          flexShrink: 0
                        }}>
                          {(user.full_name || user.username).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ 
                            fontWeight: '600',
                            fontSize: '15px',
                            color: '#1e293b',
                            marginBottom: '2px'
                          }}>
                            {user.full_name || user.username}
                          </div>
                          {user.business_name && (
                            <div style={{ 
                              fontSize: '13px',
                              color: '#059669',
                              fontWeight: '500',
                              marginBottom: '2px'
                            }}>
                              {user.business_name}
                            </div>
                          )}
                          <div style={{ 
                            fontSize: '13px',
                            color: '#64748b',
                            fontFamily: 'monospace'
                          }}>
                            @{user.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ 
                      padding: '20px 24px',
                      color: '#374151'
                    }}>
                      <div>
                        <div style={{ 
                          fontSize: '14px',
                          fontWeight: '500',
                          marginBottom: '2px'
                        }}>
                          {user.email || `${user.username}@paypal.com`}
                        </div>
                        <div style={{ 
                          fontSize: '12px',
                          color: '#64748b'
                        }}>
                          Password: {'•'.repeat(user.password.length)}
                        </div>
                      </div>
                    </td>
                    <td style={{ 
                      padding: '20px 24px',
                      textAlign: 'right',
                      color: '#1e293b',
                      fontWeight: '600',
                      fontSize: '15px'
                    }}>
                      ${(user.balance || 0).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </td>
                    <td style={{ 
                      padding: '20px 24px',
                      textAlign: 'center'
                    }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction(user, 'edit');
                          }}
                          style={{
                            background: 'transparent',
                            color: '#64748b',
                            border: '1px solid #e2e8f0',
                            height: '32px',
                            padding: '0 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = '#f8fafc';
                            e.target.style.borderColor = '#cbd5e1';
                            e.target.style.color = '#374151';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'transparent';
                            e.target.style.borderColor = '#e2e8f0';
                            e.target.style.color = '#64748b';
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction(user, 'delete');
                          }}
                          style={{
                            background: 'transparent',
                            color: '#dc2626',
                            border: '1px solid #fecaca',
                            height: '32px',
                            padding: '0 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = '#fef2f2';
                            e.target.style.borderColor = '#fca5a5';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'transparent';
                            e.target.style.borderColor = '#fecaca';
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '32px',
            borderRadius: '16px',
            width: '480px',
            maxWidth: '90vw',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #e2e8f0'
          }}>
            {renderModalContent()}
          </div>
        </div>
      )}
    </div>
  );
} 