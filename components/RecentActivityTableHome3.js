import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule, themeQuartz } from 'ag-grid-community';
import { useState, useEffect } from 'react';
import styles from '../styles/RecentActivityTable.module.css';
import tabStyles from '../styles/TableTabs.module.css';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

// Create custom theme
const myTheme = themeQuartz
  .withParams({
    backgroundColor: "#ffffff",
    foregroundColor: "#000000",
    headerBackgroundColor: "#f5f7fa",
    headerFontSize: 14,
    fontSize: 14,
    rowVerticalPaddingScale: 1.5,
    spacing: 9.96,
    borderColor: "#ddd",
    rowBorder: true,
    headerRowBorder: false,
    rowHoverColor: "#ecffff"
  });

// Date cell component
const DateCellRenderer = ({ value }) => {
  const date = new Date(value);
  const dateStr = date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
  const timeStr = date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
  
  return (
    <div className={styles.dateCell}>
      <div className={styles.dateText}>{dateStr}</div>
      <div className={styles.timeText}>{timeStr}</div>
    </div>
  );
};

// Customer cell component for customer data
const CustomerCellRenderer = ({ data }) => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  };

  const initials = getInitials(data.name);

  return (
    <div className={styles.nameCell}>
      <div className={styles.nameWithAvatar}>
        <div className={styles.avatar}>
          {initials}
        </div>
        <div className={styles.nameInfo}>
          <div className={styles.customerName}>{data.name}</div>
          <div className={styles.customerEmail}>{data.email}</div>
        </div>
      </div>
    </div>
  );
};

// Name cell component
const NameCellRenderer = ({ data }) => {
  // Get initials from name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  };

  const initials = getInitials(data.name);

  return (
    <div className={styles.nameCell}>
      <div className={styles.nameWithAvatar}>
        <div className={styles.avatar}>
          {initials}
        </div>
        <div className={styles.nameInfo}>
          <div className={styles.customerName}>{data.name}</div>
          <div className={styles.customerEmail}>{data.email}</div>
        </div>
      </div>
    </div>
  );
};

// Payment method cell component
const PaymentMethodCellRenderer = ({ value }) => {
  const method = value;
  let iconClass = '';
  let methodName = '';
  let methodNumber = '';
  
  if (method === 'PayPal Balance') {
    iconClass = 'ph ph-paypal-logo';
    methodName = 'PayPal';
    methodNumber = 'PayPal Balance';
  } else if (method === 'PayPal Credit') {
    iconClass = 'ph ph-paypal-logo';
    methodName = 'PayPal';
    methodNumber = 'PayPal Credit';
  } else if (method.includes('Visa')) {
    iconClass = 'ph ph-credit-card';
    methodName = 'Visa';
    const match = method.match(/\*\*\*\* (\d+)/);
    if (match) methodNumber = `•••• ${match[1]}`;
  } else if (method.includes('Mastercard')) {
    iconClass = 'ph ph-credit-card';
    methodName = 'Mastercard';
    const match = method.match(/\*\*\*\* (\d+)/);
    if (match) methodNumber = `•••• ${match[1]}`;
  } else if (method === 'Bank Transfer') {
    iconClass = 'ph ph-bank';
    methodName = 'Bank Transfer';
    methodNumber = '';
  } else if (method === 'Apple Pay') {
    iconClass = 'ph ph-device-mobile';
    methodName = 'Apple Pay';
    methodNumber = '';
  } else if (method === 'Google Pay') {
    iconClass = 'ph ph-device-mobile';
    methodName = 'Google Pay';
    methodNumber = '';
  } else if (method === 'Venmo') {
    iconClass = 'ph ph-device-mobile';
    methodName = 'Venmo';
    methodNumber = '';
  } else {
    iconClass = 'ph ph-credit-card';
    methodName = method;
    methodNumber = '';
  }
  
  return (
    <div className={styles.paymentMethodCell}>
      <div className={styles.paymentMethodName}>
        <i className={`${iconClass} ${styles.paymentMethodIcon}`}></i>
        {methodName}
      </div>
      {methodNumber && <div className={styles.paymentMethodNumber}>{methodNumber}</div>}
    </div>
  );
};

// Helper function to format currency values safely
const formatCurrency = (value, isNegative = false) => {
  if (value == null || value === undefined) return '$0.00';
  const formatted = value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return isNegative ? `-$${formatted}` : `$${formatted}`;
};

// Simple customer name renderer with avatar (for new tab structure)
const SimpleCustomerCellRenderer = ({ value }) => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  };

  const initials = getInitials(value);

  return (
    <div className={styles.nameCell}>
      <div className={styles.nameWithAvatar}>
        <div className={styles.avatar}>
          {initials}
        </div>
        <div className={styles.nameInfo}>
          <div className={styles.customerName}>{value}</div>
        </div>
      </div>
    </div>
  );
};

// Customer name renderer with email for new customers tab
const CustomerNameEmailCellRenderer = ({ data }) => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  };

  const initials = getInitials(data.customerName);

  return (
    <div className={styles.nameCell}>
      <div className={styles.nameWithAvatar}>
        <div className={styles.avatar}>
          {initials}
        </div>
        <div className={styles.nameInfo}>
          <div className={styles.customerName}>{data.customerName}</div>
          <div className={styles.customerEmail}>{data.email}</div>
        </div>
      </div>
    </div>
  );
};

// Simple customer name renderer (no email) for customers view
const SimpleCustomerNameCellRenderer = ({ data }) => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  };

  const initials = getInitials(data.customerName);

  return (
    <div className={styles.nameCell}>
      <div className={styles.nameWithAvatar}>
        <div className={styles.avatar}>
          {initials}
        </div>
        <div className={styles.nameInfo}>
          <div className={styles.customerName}>{data.customerName}</div>
        </div>
      </div>
    </div>
  );
};

// Customer renderer with email for transaction data (customer field + email field)
const CustomerWithEmailCellRenderer = ({ data }) => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  };

  const initials = getInitials(data.customer);

  return (
    <div className={styles.nameCell}>
      <div className={styles.nameWithAvatar}>
        <div className={styles.avatar}>
          {initials}
        </div>
        <div className={styles.nameInfo}>
          <div className={styles.customerName}>{data.customer}</div>
          <div className={styles.customerEmail}>{data.email}</div>
        </div>
      </div>
    </div>
  );
};

// First order renderer (date + product)
const FirstOrderCellRenderer = ({ data }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={styles.nameCell}>
      <div className={styles.nameInfo}>
        <div className={styles.customerName}>{formatDate(data.firstOrderDate)}</div>
        <div className={styles.customerEmail}>{data.firstOrder}</div>
      </div>
    </div>
  );
};

// Most recent order renderer (date + product)
const MostRecentOrderCellRenderer = ({ data }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={styles.nameCell}>
      <div className={styles.nameInfo}>
        <div className={styles.customerName}>{formatDate(data.mostRecentOrderDate)}</div>
        <div className={styles.customerEmail}>{data.mostRecentOrder}</div>
      </div>
    </div>
  );
};

// Status badge renderer
const StatusBadgeRenderer = ({ value }) => {
  if (!value) return '';
  
  const getStatusStyle = (status) => {
    const lowerStatus = status.toLowerCase();
    switch (lowerStatus) {
      case 'completed':
        return `${styles.statusBadge} ${styles.statusCompleted}`;
      case 'pending':
        return `${styles.statusBadge} ${styles.statusPending}`;
      case 'processing':
        return `${styles.statusBadge} ${styles.statusProcessing}`;
      case 'awaiting_shipment':
        return `${styles.statusBadge} ${styles.statusAwaiting}`;
      case 'awaiting_approval':
        return `${styles.statusBadge} ${styles.statusAwaiting}`;
      case 'active':
        return `${styles.statusBadge} ${styles.statusActive}`;
      default:
        return `${styles.statusBadge} ${styles.statusDefault}`;
    }
  };

  const formatStatusText = (status) => {
    return status.replace('_', ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <span className={getStatusStyle(value)}>
      {formatStatusText(value)}
    </span>
  );
};

// Mock customer data for customer-focused tabs
const mockCustomers = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    joinDate: '2024-01-10T10:30:00Z',
    totalSpent: 299.97,
    orders: 3,
    status: 'active'
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    joinDate: '2024-01-12T09:15:00Z',
    totalSpent: 149.98,
    orders: 2,
    status: 'active'
  },
  {
    id: 3,
    name: 'Emma Wilson',
    email: 'emma.wilson@email.com',
    joinDate: '2024-01-13T16:45:00Z',
    totalSpent: 59.98,
    orders: 2,
    status: 'active'
  },
  {
    id: 4,
    name: 'David Rodriguez',
    email: 'david.rodriguez@email.com',
    joinDate: '2024-01-14T14:20:00Z',
    totalSpent: 79.97,
    orders: 4,
    status: 'active'
  },
  {
    id: 5,
    name: 'Lisa Anderson',
    email: 'lisa.anderson@email.com',
    joinDate: '2024-01-08T11:30:00Z',
    totalSpent: 399.99,
    orders: 2,
    status: 'active'
  },
  {
    id: 6,
    name: 'James Thompson',
    email: 'james.thompson@email.com',
    joinDate: '2024-01-09T09:45:00Z',
    totalSpent: 199.99,
    orders: 1,
    status: 'active'
  }
];

// Mock data for testing
const mockTransactions = [
  {
    id: 1,
    date: '2024-01-15T10:30:00Z',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    paymentMethod: 'Visa **** 4242',
    productName: 'Premium Subscription',
    amount: 99.99,
    fees: 3.20,
    total: 103.19,
    status: 'completed'
  },
  {
    id: 2,
    date: '2024-01-15T09:15:00Z',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    paymentMethod: 'PayPal Balance',
    productName: 'Digital Course',
    amount: 49.99,
    fees: 1.75,
    total: 51.74,
    status: 'completed'
  },
  {
    id: 3,
    date: '2024-01-14T16:45:00Z',
    name: 'Emma Wilson',
    email: 'emma.wilson@email.com',
    paymentMethod: 'Mastercard **** 8888',
    productName: 'Monthly Plan',
    amount: 29.99,
    fees: 1.20,
    total: 31.19,
    status: 'pending'
  },
  {
    id: 4,
    date: '2024-01-14T14:20:00Z',
    name: 'David Rodriguez',
    email: 'david.rodriguez@email.com',
    paymentMethod: 'Apple Pay',
    productName: 'One-time Purchase',
    amount: 19.99,
    fees: 0.89,
    total: 20.88,
    status: 'completed'
  },
  {
    id: 5,
    date: '2024-01-13T11:30:00Z',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@email.com',
    paymentMethod: 'PayPal Credit',
    productName: 'Annual Subscription',
    amount: 199.99,
    fees: 6.50,
    total: 206.49,
    status: 'completed'
  },
  {
    id: 6,
    date: '2024-01-13T09:45:00Z',
    name: 'James Thompson',
    email: 'james.thompson@email.com',
    paymentMethod: 'Bank Transfer',
    productName: 'Refund - Premium Plan',
    amount: -99.99,
    fees: -3.20,
    total: -103.19,
    status: 'completed'
  },
  {
    id: 7,
    date: '2024-01-12T15:20:00Z',
    name: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    paymentMethod: 'Visa **** 1234',
    productName: 'Starter Package',
    amount: 15.99,
    fees: 0.65,
    total: 16.64,
    status: 'completed'
  },
  {
    id: 8,
    date: '2024-01-12T10:15:00Z',
    name: 'Robert Kim',
    email: 'robert.kim@email.com',
    paymentMethod: 'Google Pay',
    productName: 'Pro Features',
    amount: 79.99,
    fees: 2.80,
    total: 82.79,
    status: 'pending'
  },
  {
    id: 9,
    date: '2024-01-11T13:40:00Z',
    name: 'Jennifer Lee',
    email: 'jennifer.lee@email.com',
    paymentMethod: 'Venmo',
    productName: 'Monthly Subscription',
    amount: 24.99,
    fees: 1.05,
    total: 26.04,
    status: 'completed'
  },
  {
    id: 10,
    date: '2024-01-10T08:25:00Z',
    name: 'Thomas Brown',
    email: 'thomas.brown@email.com',
    paymentMethod: 'Mastercard **** 5678',
    productName: 'Refund - Course Access',
    amount: -49.99,
    fees: -1.75,
    total: -51.74,
    status: 'completed'
  },
  {
    id: 11,
    date: '2024-01-09T17:10:00Z',
    name: 'Amanda White',
    email: 'amanda.white@email.com',
    paymentMethod: 'PayPal Balance',
    productName: 'Enterprise Plan',
    amount: 299.99,
    fees: 9.50,
    total: 309.49,
    status: 'pending'
  },
  {
    id: 12,
    date: '2024-01-08T12:55:00Z',
    name: 'Christopher Davis',
    email: 'christopher.davis@email.com',
    paymentMethod: 'Apple Pay',
    productName: 'Add-on Features',
    amount: 39.99,
    fees: 1.45,
    total: 41.44,
    status: 'completed'
  }
];

// Mock data for new transactions (recent activity)
const mockNewTransactions = [
  {
    id: 1,
    date: '2024-01-15T10:30:00Z',
    customer: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    paymentMethod: 'Visa **** 4242',
    product: 'Premium Subscription',
    amount: 99.99,
    status: 'completed'
  },
  {
    id: 2,
    date: '2024-01-15T09:15:00Z',
    customer: 'Michael Chen',
    email: 'michael.chen@email.com',
    paymentMethod: 'PayPal Balance',
    product: 'Digital Course',
    amount: 49.99,
    status: 'completed'
  },
  {
    id: 3,
    date: '2024-01-14T16:45:00Z',
    customer: 'Emma Wilson',
    email: 'emma.wilson@email.com',
    paymentMethod: 'Mastercard **** 8888',
    product: 'Monthly Plan',
    amount: 29.99,
    status: 'pending'
  },
  {
    id: 4,
    date: '2024-01-14T14:20:00Z',
    customer: 'David Rodriguez',
    email: 'david.rodriguez@email.com',
    paymentMethod: 'Apple Pay',
    product: 'One-time Purchase',
    amount: 19.99,
    status: 'completed'
  },
  {
    id: 5,
    date: '2024-01-13T11:30:00Z',
    customer: 'Lisa Anderson',
    email: 'lisa.anderson@email.com',
    paymentMethod: 'PayPal Credit',
    product: 'Annual Subscription',
    amount: 199.99,
    status: 'completed'
  },
  {
    id: 6,
    date: '2024-01-13T09:45:00Z',
    customer: 'James Thompson',
    email: 'james.thompson@email.com',
    paymentMethod: 'Bank Transfer',
    product: 'Enterprise Plan',
    amount: 299.99,
    status: 'pending'
  },
  {
    id: 7,
    date: '2024-01-12T15:20:00Z',
    customer: 'Maria Garcia',
    paymentMethod: 'Visa **** 1234',
    product: 'Starter Package',
    amount: 15.99,
    status: 'completed'
  },
  {
    id: 8,
    date: '2024-01-12T10:15:00Z',
    customer: 'Robert Kim',
    email: 'robert.kim@email.com',
    paymentMethod: 'Google Pay',
    product: 'Pro Features',
    amount: 79.99,
    status: 'pending'
  },
  {
    id: 9,
    date: '2024-01-11T13:40:00Z',
    customer: 'Jennifer Lee',
    email: 'jennifer.lee@email.com',
    paymentMethod: 'Venmo',
    product: 'Monthly Subscription',
    amount: 24.99,
    status: 'completed'
  },
  {
    id: 10,
    date: '2024-01-11T08:25:00Z',
    customer: 'Thomas Brown',
    email: 'thomas.brown@email.com',
    paymentMethod: 'Mastercard **** 5678',
    product: 'Basic Plan',
    amount: 39.99,
    status: 'completed'
  },
  {
    id: 11,
    date: '2024-01-10T17:10:00Z',
    customer: 'Amanda White',
    email: 'amanda.white@email.com',
    paymentMethod: 'PayPal Balance',
    product: 'Add-on Features',
    amount: 59.99,
    status: 'pending'
  },
  {
    id: 12,
    date: '2024-01-10T12:55:00Z',
    customer: 'Christopher Davis',
    email: 'christopher.davis@email.com',
    paymentMethod: 'Apple Pay',
    product: 'Premium Features',
    amount: 89.99,
    status: 'completed'
  },
  {
    id: 13,
    date: '2024-01-09T16:20:00Z',
    customer: 'Nicole Martinez',
    email: 'nicole.martinez@email.com',
    paymentMethod: 'Visa **** 9876',
    product: 'Consultation Service',
    amount: 149.99,
    status: 'completed'
  },
  {
    id: 14,
    date: '2024-01-09T11:45:00Z',
    customer: 'Kevin Taylor',
    email: 'kevin.taylor@email.com',
    paymentMethod: 'Google Pay',
    product: 'Training Course',
    amount: 199.99,
    status: 'pending'
  },
  {
    id: 15,
    date: '2024-01-08T14:30:00Z',
    customer: 'Rachel Green',
    email: 'rachel.green@email.com',
    paymentMethod: 'Mastercard **** 3456',
    product: 'Monthly Plan',
    amount: 29.99,
    status: 'completed'
  },
  {
    id: 16,
    date: '2024-01-08T09:15:00Z',
    customer: 'Brian Wilson',
    email: 'brian.wilson@email.com',
    paymentMethod: 'PayPal Credit',
    product: 'Pro Subscription',
    amount: 79.99,
    status: 'completed'
  },
  {
    id: 17,
    date: '2024-01-07T18:40:00Z',
    customer: 'Stephanie Clark',
    email: 'stephanie.clark@email.com',
    paymentMethod: 'Apple Pay',
    product: 'Digital Download',
    amount: 19.99,
    status: 'completed'
  },
  {
    id: 18,
    date: '2024-01-07T13:25:00Z',
    customer: 'Daniel Lewis',
    email: 'daniel.lewis@email.com',
    paymentMethod: 'Visa **** 7890',
    product: 'Advanced Course',
    amount: 249.99,
    status: 'pending'
  },
  {
    id: 19,
    date: '2024-01-06T15:30:00Z',
    customer: 'Jessica Brown',
    email: 'jessica.brown@email.com',
    paymentMethod: 'PayPal Balance',
    product: 'Starter Package',
    amount: 39.99,
    status: 'completed'
  },
  {
    id: 20,
    date: '2024-01-06T12:15:00Z',
    customer: 'Ryan Miller',
    email: 'ryan.miller@email.com',
    paymentMethod: 'Mastercard **** 5555',
    product: 'Pro Features',
    amount: 89.99,
    status: 'completed'
  },
  {
    id: 21,
    date: '2024-01-05T18:45:00Z',
    customer: 'Ashley Davis',
    email: 'ashley.davis@email.com',
    paymentMethod: 'Apple Pay',
    product: 'Monthly Subscription',
    amount: 29.99,
    status: 'pending'
  },
  {
    id: 22,
    date: '2024-01-05T14:20:00Z',
    customer: 'Christopher Wilson',
    email: 'christopher.wilson@email.com',
    paymentMethod: 'Google Pay',
    product: 'Annual Plan',
    amount: 199.99,
    status: 'completed'
  },
  {
    id: 23,
    date: '2024-01-04T16:30:00Z',
    customer: 'Amanda Garcia',
    email: 'amanda.garcia@email.com',
    paymentMethod: 'Visa **** 1111',
    product: 'Enterprise Setup',
    amount: 399.99,
    status: 'completed'
  },
  {
    id: 24,
    date: '2024-01-04T11:45:00Z',
    customer: 'Brandon Lee',
    email: 'brandon.lee@email.com',
    paymentMethod: 'PayPal Credit',
    product: 'Training Course',
    amount: 149.99,
    status: 'pending'
  },
  {
    id: 25,
    date: '2024-01-03T19:20:00Z',
    customer: 'Samantha Taylor',
    email: 'samantha.taylor@email.com',
    paymentMethod: 'Bank Transfer',
    product: 'Custom Solution',
    amount: 599.99,
    status: 'completed'
  },
  {
    id: 26,
    date: '2024-01-03T13:15:00Z',
    customer: 'Joshua Martinez',
    email: 'joshua.martinez@email.com',
    paymentMethod: 'Mastercard **** 2222',
    product: 'Basic Plan',
    amount: 19.99,
    status: 'completed'
  },
  {
    id: 27,
    date: '2024-01-02T17:40:00Z',
    customer: 'Nicole Anderson',
    email: 'nicole.anderson@email.com',
    paymentMethod: 'Apple Pay',
    product: 'Premium Features',
    amount: 79.99,
    status: 'pending'
  },
  {
    id: 28,
    date: '2024-01-02T10:25:00Z',
    customer: 'Tyler Johnson',
    email: 'tyler.johnson@email.com',
    paymentMethod: 'PayPal Balance',
    product: 'Quarterly Plan',
    amount: 159.99,
    status: 'completed'
  },
  {
    id: 29,
    date: '2024-01-01T15:50:00Z',
    customer: 'Rachel White',
    email: 'rachel.white@email.com',
    paymentMethod: 'Visa **** 3333',
    product: 'Digital Download',
    amount: 24.99,
    status: 'completed'
  },
  {
    id: 30,
    date: '2023-12-31T20:30:00Z',
    customer: 'Kevin Thompson',
    email: 'kevin.thompson@email.com',
    paymentMethod: 'Google Pay',
    product: 'Advanced Package',
    amount: 299.99,
    status: 'pending'
  },
  {
    id: 31,
    date: '2023-12-31T14:15:00Z',
    customer: 'Melissa Rodriguez',
    email: 'melissa.rodriguez@email.com',
    paymentMethod: 'Mastercard **** 4444',
    product: 'Pro Subscription',
    amount: 99.99,
    status: 'completed'
  },
  {
    id: 32,
    date: '2023-12-30T18:45:00Z',
    customer: 'Jonathan Davis',
    email: 'jonathan.davis@email.com',
    paymentMethod: 'PayPal Credit',
    product: 'Enterprise License',
    amount: 799.99,
    status: 'completed'
  },
  {
    id: 33,
    date: '2023-12-30T12:20:00Z',
    customer: 'Stephanie Miller',
    email: 'stephanie.miller@email.com',
    paymentMethod: 'Bank Transfer',
    product: 'Starter Kit',
    amount: 49.99,
    status: 'pending'
  },
  {
    id: 34,
    date: '2023-12-29T16:35:00Z',
    customer: 'Gregory Wilson',
    email: 'gregory.wilson@email.com',
    paymentMethod: 'Apple Pay',
    product: 'Monthly Plan',
    amount: 29.99,
    status: 'completed'
  },
  {
    id: 35,
    date: '2023-12-29T11:10:00Z',
    customer: 'Christina Garcia',
    email: 'christina.garcia@email.com',
    paymentMethod: 'Visa **** 5555',
    product: 'Premium Course',
    amount: 179.99,
    status: 'completed'
  },
  {
    id: 36,
    date: '2023-12-28T19:25:00Z',
    customer: 'Matthew Brown',
    email: 'matthew.brown@email.com',
    paymentMethod: 'PayPal Balance',
    product: 'Basic Features',
    amount: 39.99,
    status: 'pending'
  },
  {
    id: 37,
    date: '2023-12-28T13:40:00Z',
    customer: 'Lauren Martinez',
    email: 'lauren.martinez@email.com',
    paymentMethod: 'Google Pay',
    product: 'Annual Subscription',
    amount: 249.99,
    status: 'completed'
  },
  {
    id: 38,
    date: '2023-12-27T17:55:00Z',
    customer: 'Andrew Taylor',
    email: 'andrew.taylor@email.com',
    paymentMethod: 'Mastercard **** 6666',
    product: 'Pro Tools',
    amount: 129.99,
    status: 'completed'
  },
  {
    id: 39,
    date: '2023-12-27T10:30:00Z',
    customer: 'Danielle Anderson',
    email: 'danielle.anderson@email.com',
    paymentMethod: 'Apple Pay',
    product: 'Training Materials',
    amount: 89.99,
    status: 'pending'
  },
  {
    id: 40,
    date: '2023-12-26T15:45:00Z',
    customer: 'Nicholas Johnson',
    email: 'nicholas.johnson@email.com',
    paymentMethod: 'PayPal Credit',
    product: 'Enterprise Dashboard',
    amount: 499.99,
    status: 'completed'
  },
  {
    id: 41,
    date: '2023-12-26T12:20:00Z',
    customer: 'Heather White',
    email: 'heather.white@email.com',
    paymentMethod: 'Bank Transfer',
    product: 'Custom Integration',
    amount: 699.99,
    status: 'completed'
  },
  {
    id: 42,
    date: '2023-12-25T18:15:00Z',
    customer: 'Jacob Thompson',
    email: 'jacob.thompson@email.com',
    paymentMethod: 'Visa **** 7777',
    product: 'Holiday Special',
    amount: 59.99,
    status: 'pending'
  },
  {
    id: 43,
    date: '2023-12-25T14:30:00Z',
    customer: 'Michelle Rodriguez',
    email: 'michelle.rodriguez@email.com',
    paymentMethod: 'Google Pay',
    product: 'Premium Package',
    amount: 199.99,
    status: 'completed'
  },
  {
    id: 44,
    date: '2023-12-24T16:45:00Z',
    customer: 'Ryan Davis',
    email: 'ryan.davis@email.com',
    paymentMethod: 'PayPal Balance',
    product: 'Quarterly Subscription',
    amount: 149.99,
    status: 'completed'
  },
  {
    id: 45,
    date: '2023-12-24T11:20:00Z',
    customer: 'Kimberly Miller',
    email: 'kimberly.miller@email.com',
    paymentMethod: 'Mastercard **** 8888',
    product: 'Starter Course',
    amount: 79.99,
    status: 'pending'
  },
  {
    id: 46,
    date: '2023-12-23T19:35:00Z',
    customer: 'Eric Wilson',
    email: 'eric.wilson@email.com',
    paymentMethod: 'Apple Pay',
    product: 'Advanced Tools',
    amount: 259.99,
    status: 'completed'
  },
  {
    id: 47,
    date: '2023-12-23T13:10:00Z',
    customer: 'Tiffany Garcia',
    email: 'tiffany.garcia@email.com',
    paymentMethod: 'PayPal Credit',
    product: 'Pro License',
    amount: 399.99,
    status: 'completed'
  },
  {
    id: 48,
    date: '2023-12-22T17:25:00Z',
    customer: 'Steven Brown',
    email: 'steven.brown@email.com',
    paymentMethod: 'Bank Transfer',
    product: 'Enterprise Suite',
    amount: 899.99,
    status: 'pending'
  },
  {
    id: 49,
    date: '2023-12-22T10:40:00Z',
    customer: 'Brittany Martinez',
    email: 'brittany.martinez@email.com',
    paymentMethod: 'Visa **** 9999',
    product: 'Monthly Premium',
    amount: 49.99,
    status: 'completed'
  },
  {
    id: 50,
    date: '2023-12-21T15:55:00Z',
    customer: 'Justin Taylor',
    email: 'justin.taylor@email.com',
    paymentMethod: 'Google Pay',
    product: 'Basic Package',
    amount: 29.99,
    status: 'completed'
  },
  {
    id: 51,
    date: '2023-12-21T12:30:00Z',
    customer: 'Courtney Anderson',
    email: 'courtney.anderson@email.com',
    paymentMethod: 'PayPal Balance',
    product: 'Training Suite',
    amount: 189.99,
    status: 'pending'
  },
  {
    id: 52,
    date: '2023-12-20T18:45:00Z',
    customer: 'Jeremy Johnson',
    email: 'jeremy.johnson@email.com',
    paymentMethod: 'Mastercard **** 1010',
    product: 'Pro Features',
    amount: 119.99,
    status: 'completed'
  },
  {
    id: 53,
    date: '2023-12-20T14:20:00Z',
    customer: 'Crystal White',
    email: 'crystal.white@email.com',
    paymentMethod: 'Apple Pay',
    product: 'Annual Plan',
    amount: 299.99,
    status: 'completed'
  },
  {
    id: 54,
    date: '2023-12-19T16:35:00Z',
    customer: 'Marcus Thompson',
    email: 'marcus.thompson@email.com',
    paymentMethod: 'PayPal Credit',
    product: 'Custom Development',
    amount: 1299.99,
    status: 'pending'
  },
  {
    id: 55,
    date: '2023-12-19T11:50:00Z',
    customer: 'Vanessa Rodriguez',
    email: 'vanessa.rodriguez@email.com',
    paymentMethod: 'Bank Transfer',
    product: 'Enterprise License',
    amount: 599.99,
    status: 'completed'
  },
  {
    id: 56,
    date: '2023-12-18T19:15:00Z',
    customer: 'Cameron Davis',
    email: 'cameron.davis@email.com',
    paymentMethod: 'Visa **** 2020',
    product: 'Premium Support',
    amount: 149.99,
    status: 'completed'
  },
  {
    id: 57,
    date: '2023-12-18T13:30:00Z',
    customer: 'Alexis Miller',
    email: 'alexis.miller@email.com',
    paymentMethod: 'Google Pay',
    product: 'Starter Bundle',
    amount: 69.99,
    status: 'pending'
  },
  {
    id: 58,
    date: '2023-12-17T17:45:00Z',
    customer: 'Jordan Wilson',
    email: 'jordan.wilson@email.com',
    paymentMethod: 'PayPal Balance',
    product: 'Monthly Pro',
    amount: 79.99,
    status: 'completed'
  }
];

// Mock data for unfulfilled orders
const mockUnfulfilledOrders = [
  {
    id: 1,
    orderDate: '2024-01-14T16:45:00Z',
    customer: 'Emma Wilson',
    email: 'emma.wilson@email.com',
    product: 'Monthly Plan Setup',
    quantity: 1,
    orderValue: 29.99,
    orderStatus: 'pending'
  },
  {
    id: 2,
    orderDate: '2024-01-13T09:45:00Z',
    customer: 'James Thompson',
    email: 'james.thompson@email.com',
    product: 'Enterprise Plan Setup',
    quantity: 1,
    orderValue: 299.99,
    orderStatus: 'processing'
  },
  {
    id: 3,
    orderDate: '2024-01-12T10:15:00Z',
    customer: 'Robert Kim',
    email: 'robert.kim@email.com',
    product: 'Pro Features Activation',
    quantity: 1,
    orderValue: 79.99,
    orderStatus: 'awaiting_shipment'
  },
  {
    id: 4,
    orderDate: '2024-01-10T17:10:00Z',
    customer: 'Amanda White',
    email: 'amanda.white@email.com',
    product: 'Add-on Features',
    quantity: 2,
    orderValue: 59.99,
    orderStatus: 'pending'
  },
  {
    id: 5,
    orderDate: '2024-01-09T11:45:00Z',
    customer: 'Kevin Taylor',
    email: 'kevin.taylor@email.com',
    product: 'Training Course Materials',
    quantity: 1,
    orderValue: 199.99,
    orderStatus: 'processing'
  },
  {
    id: 6,
    orderDate: '2024-01-07T13:25:00Z',
    customer: 'Daniel Lewis',
    email: 'daniel.lewis@email.com',
    product: 'Advanced Course Package',
    quantity: 1,
    orderValue: 249.99,
    orderStatus: 'pending'
  },
  {
    id: 7,
    orderDate: '2024-01-06T15:30:00Z',
    customer: 'Michelle Adams',
    email: 'michelle.adams@email.com',
    product: 'Custom Integration',
    quantity: 1,
    orderValue: 499.99,
    orderStatus: 'awaiting_approval'
  },
  {
    id: 8,
    orderDate: '2024-01-05T12:20:00Z',
    customer: 'Andrew Johnson',
    email: 'andrew.johnson@email.com',
    product: 'Bulk License Package',
    quantity: 10,
    orderValue: 899.99,
    orderStatus: 'processing'
  },
  {
    id: 9,
    orderDate: '2024-01-04T14:15:00Z',
    customer: 'Laura Martinez',
    email: 'laura.martinez@email.com',
    product: 'Premium Support Plan',
    quantity: 1,
    orderValue: 149.99,
    orderStatus: 'pending'
  },
  {
    id: 10,
    orderDate: '2024-01-03T10:30:00Z',
    customer: 'Michael Thompson',
    email: 'michael.thompson@email.com',
    product: 'Enterprise Dashboard',
    quantity: 1,
    orderValue: 399.99,
    orderStatus: 'processing'
  },
  {
    id: 11,
    orderDate: '2024-01-02T15:45:00Z',
    customer: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    product: 'Premium Analytics Package',
    quantity: 1,
    orderValue: 299.99,
    orderStatus: 'pending'
  },
  {
    id: 12,
    orderDate: '2024-01-02T11:20:00Z',
    customer: 'David Wilson',
    email: 'david.wilson@email.com',
    product: 'Custom Integration Setup',
    quantity: 2,
    orderValue: 599.99,
    orderStatus: 'processing'
  },
  {
    id: 13,
    orderDate: '2024-01-01T18:30:00Z',
    customer: 'Jessica Martinez',
    email: 'jessica.martinez@email.com',
    product: 'Training Course Bundle',
    quantity: 1,
    orderValue: 199.99,
    orderStatus: 'awaiting_approval'
  },
  {
    id: 14,
    orderDate: '2024-01-01T14:15:00Z',
    customer: 'Ryan Garcia',
    email: 'ryan.garcia@email.com',
    product: 'Pro License Upgrade',
    quantity: 3,
    orderValue: 449.99,
    orderStatus: 'pending'
  },
  {
    id: 15,
    orderDate: '2023-12-31T16:40:00Z',
    customer: 'Amanda Taylor',
    email: 'amanda.taylor@email.com',
    product: 'Enterprise Support Plan',
    quantity: 1,
    orderValue: 799.99,
    orderStatus: 'processing'
  },
  {
    id: 16,
    orderDate: '2023-12-31T12:25:00Z',
    customer: 'Christopher Lee',
    email: 'christopher.lee@email.com',
    product: 'Advanced Analytics Tools',
    quantity: 1,
    orderValue: 349.99,
    orderStatus: 'awaiting_shipment'
  },
  {
    id: 17,
    orderDate: '2023-12-30T19:50:00Z',
    customer: 'Michelle Brown',
    email: 'michelle.brown@email.com',
    product: 'Custom Dashboard Setup',
    quantity: 1,
    orderValue: 499.99,
    orderStatus: 'pending'
  },
  {
    id: 18,
    orderDate: '2023-12-30T13:35:00Z',
    customer: 'Brandon Davis',
    email: 'brandon.davis@email.com',
    product: 'Bulk Data Processing',
    quantity: 5,
    orderValue: 999.99,
    orderStatus: 'processing'
  },
  {
    id: 19,
    orderDate: '2023-12-29T17:20:00Z',
    customer: 'Stephanie Rodriguez',
    email: 'stephanie.rodriguez@email.com',
    product: 'Premium Feature Set',
    quantity: 1,
    orderValue: 249.99,
    orderStatus: 'awaiting_approval'
  },
  {
    id: 20,
    orderDate: '2023-12-29T10:45:00Z',
    customer: 'Tyler Miller',
    email: 'tyler.miller@email.com',
    product: 'Enterprise Migration',
    quantity: 1,
    orderValue: 1299.99,
    orderStatus: 'pending'
  },
  {
    id: 21,
    orderDate: '2023-12-28T15:30:00Z',
    customer: 'Nicole Anderson',
    email: 'nicole.anderson@email.com',
    product: 'Training Materials Package',
    quantity: 2,
    orderValue: 179.99,
    orderStatus: 'processing'
  },
  {
    id: 22,
    orderDate: '2023-12-28T11:15:00Z',
    customer: 'Joshua Thompson',
    email: 'joshua.thompson@email.com',
    product: 'Custom API Development',
    quantity: 1,
    orderValue: 899.99,
    orderStatus: 'awaiting_shipment'
  },
  {
    id: 23,
    orderDate: '2023-12-27T18:40:00Z',
    customer: 'Rachel White',
    email: 'rachel.white@email.com',
    product: 'Premium Support Package',
    quantity: 1,
    orderValue: 399.99,
    orderStatus: 'pending'
  },
  {
    id: 24,
    orderDate: '2023-12-27T14:25:00Z',
    customer: 'Kevin Johnson',
    email: 'kevin.johnson@email.com',
    product: 'Enterprise Security Setup',
    quantity: 1,
    orderValue: 699.99,
    orderStatus: 'processing'
  },
  {
    id: 25,
    orderDate: '2023-12-26T16:50:00Z',
    customer: 'Melissa Garcia',
    email: 'melissa.garcia@email.com',
    product: 'Advanced Reporting Tools',
    quantity: 3,
    orderValue: 549.99,
    orderStatus: 'awaiting_approval'
  },
  {
    id: 26,
    orderDate: '2023-12-26T12:35:00Z',
    customer: 'Jonathan Martinez',
    email: 'jonathan.martinez@email.com',
    product: 'Custom Workflow Setup',
    quantity: 1,
    orderValue: 449.99,
    orderStatus: 'pending'
  },
  {
    id: 27,
    orderDate: '2023-12-25T19:20:00Z',
    customer: 'Courtney Wilson',
    email: 'courtney.wilson@email.com',
    product: 'Holiday Special Bundle',
    quantity: 2,
    orderValue: 299.99,
    orderStatus: 'processing'
  },
  {
    id: 28,
    orderDate: '2023-12-25T13:45:00Z',
    customer: 'Gregory Taylor',
    email: 'gregory.taylor@email.com',
    product: 'Enterprise License Pack',
    quantity: 10,
    orderValue: 1999.99,
    orderStatus: 'awaiting_shipment'
  },
  {
    id: 29,
    orderDate: '2023-12-24T17:10:00Z',
    customer: 'Christina Brown',
    email: 'christina.brown@email.com',
    product: 'Premium Analytics Setup',
    quantity: 1,
    orderValue: 379.99,
    orderStatus: 'pending'
  },
  {
    id: 30,
    orderDate: '2023-12-24T11:55:00Z',
    customer: 'Matthew Davis',
    email: 'matthew.davis@email.com',
    product: 'Custom Integration Package',
    quantity: 1,
    orderValue: 799.99,
    orderStatus: 'processing'
  },
  {
    id: 31,
    orderDate: '2023-12-23T18:25:00Z',
    customer: 'Lauren Rodriguez',
    email: 'lauren.rodriguez@email.com',
    product: 'Training Course Suite',
    quantity: 1,
    orderValue: 249.99,
    orderStatus: 'awaiting_approval'
  },
  {
    id: 32,
    orderDate: '2023-12-23T14:40:00Z',
    customer: 'Andrew Miller',
    email: 'andrew.miller@email.com',
    product: 'Pro Tools Bundle',
    quantity: 2,
    orderValue: 599.99,
    orderStatus: 'pending'
  },
  {
    id: 33,
    orderDate: '2023-12-22T16:15:00Z',
    customer: 'Danielle Anderson',
    email: 'danielle.anderson@email.com',
    product: 'Enterprise Dashboard Pack',
    quantity: 1,
    orderValue: 899.99,
    orderStatus: 'processing'
  },
  {
    id: 34,
    orderDate: '2023-12-22T12:30:00Z',
    customer: 'Nicholas Thompson',
    email: 'nicholas.thompson@email.com',
    product: 'Advanced Feature Set',
    quantity: 1,
    orderValue: 349.99,
    orderStatus: 'awaiting_shipment'
  },
  {
    id: 35,
    orderDate: '2023-12-21T19:45:00Z',
    customer: 'Heather Johnson',
    email: 'heather.johnson@email.com',
    product: 'Custom Development Package',
    quantity: 1,
    orderValue: 1499.99,
    orderStatus: 'pending'
  },
  {
    id: 36,
    orderDate: '2023-12-21T13:20:00Z',
    customer: 'Jacob White',
    email: 'jacob.white@email.com',
    product: 'Premium Support Setup',
    quantity: 1,
    orderValue: 299.99,
    orderStatus: 'processing'
  },
  {
    id: 37,
    orderDate: '2023-12-20T17:35:00Z',
    customer: 'Michelle Garcia',
    email: 'michelle.garcia@email.com',
    product: 'Enterprise Migration Tools',
    quantity: 1,
    orderValue: 999.99,
    orderStatus: 'awaiting_approval'
  },
  {
    id: 38,
    orderDate: '2023-12-20T11:50:00Z',
    customer: 'Ryan Martinez',
    email: 'ryan.martinez@email.com',
    product: 'Custom Analytics Package',
    quantity: 3,
    orderValue: 749.99,
    orderStatus: 'pending'
  },
  {
    id: 39,
    orderDate: '2023-12-19T18:15:00Z',
    customer: 'Kimberly Wilson',
    email: 'kimberly.wilson@email.com',
    product: 'Training and Support Bundle',
    quantity: 1,
    orderValue: 399.99,
    orderStatus: 'processing'
  },
  {
    id: 40,
    orderDate: '2023-12-19T14:30:00Z',
    customer: 'Eric Taylor',
    email: 'eric.taylor@email.com',
    product: 'Advanced Security Setup',
    quantity: 1,
    orderValue: 599.99,
    orderStatus: 'awaiting_shipment'
  },
  {
    id: 41,
    orderDate: '2023-12-18T16:45:00Z',
    customer: 'Tiffany Brown',
    email: 'tiffany.brown@email.com',
    product: 'Enterprise License Upgrade',
    quantity: 5,
    orderValue: 1299.99,
    orderStatus: 'pending'
  },
  {
    id: 42,
    orderDate: '2023-12-18T12:20:00Z',
    customer: 'Steven Davis',
    email: 'steven.davis@email.com',
    product: 'Custom Workflow Tools',
    quantity: 1,
    orderValue: 449.99,
    orderStatus: 'processing'
  },
  {
    id: 43,
    orderDate: '2023-12-17T19:35:00Z',
    customer: 'Brittany Rodriguez',
    email: 'brittany.rodriguez@email.com',
    product: 'Premium Feature Pack',
    quantity: 1,
    orderValue: 279.99,
    orderStatus: 'awaiting_approval'
  },
  {
    id: 44,
    orderDate: '2023-12-17T13:50:00Z',
    customer: 'Justin Miller',
    email: 'justin.miller@email.com',
    product: 'Enterprise Support Package',
    quantity: 1,
    orderValue: 799.99,
    orderStatus: 'pending'
  },
  {
    id: 45,
    orderDate: '2023-12-16T17:25:00Z',
    customer: 'Courtney Anderson',
    email: 'courtney.anderson@email.com',
    product: 'Advanced Analytics Suite',
    quantity: 2,
    orderValue: 699.99,
    orderStatus: 'processing'
  },
  {
    id: 46,
    orderDate: '2023-12-16T11:40:00Z',
    customer: 'Jeremy Thompson',
    email: 'jeremy.thompson@email.com',
    product: 'Custom Integration Setup',
    quantity: 1,
    orderValue: 549.99,
    orderStatus: 'awaiting_shipment'
  },
  {
    id: 47,
    orderDate: '2023-12-15T18:55:00Z',
    customer: 'Crystal Johnson',
    email: 'crystal.johnson@email.com',
    product: 'Premium Dashboard Package',
    quantity: 1,
    orderValue: 399.99,
    orderStatus: 'pending'
  },
  {
    id: 48,
    orderDate: '2023-12-15T14:10:00Z',
    customer: 'Marcus White',
    email: 'marcus.white@email.com',
    product: 'Enterprise Development Tools',
    quantity: 1,
    orderValue: 1199.99,
    orderStatus: 'processing'
  },
  {
    id: 49,
    orderDate: '2023-12-14T16:25:00Z',
    customer: 'Vanessa Garcia',
    email: 'vanessa.garcia@email.com',
    product: 'Custom Reporting Suite',
    quantity: 1,
    orderValue: 649.99,
    orderStatus: 'awaiting_approval'
  },
  {
    id: 50,
    orderDate: '2023-12-14T12:40:00Z',
    customer: 'Cameron Martinez',
    email: 'cameron.martinez@email.com',
    product: 'Advanced Training Package',
    quantity: 3,
    orderValue: 449.99,
    orderStatus: 'pending'
  },
  {
    id: 51,
    orderDate: '2023-12-13T19:15:00Z',
    customer: 'Alexis Wilson',
    email: 'alexis.wilson@email.com',
    product: 'Enterprise Security Bundle',
    quantity: 1,
    orderValue: 899.99,
    orderStatus: 'processing'
  }
];

// Mock data for new customers (expanded)
const mockNewCustomers = [
  {
    id: 1,
    joinDate: '2024-01-15T10:30:00Z',
    customerName: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    firstOrderDate: '2024-01-15T10:30:00Z',
    firstOrder: 'Premium Subscription',
    totalOrders: 3,
    mostRecentOrderDate: '2024-01-18T14:20:00Z',
    mostRecentOrder: 'Add-on Package',
    totalSpent: 299.97,
    status: 'active'
  },
  {
    id: 2,
    joinDate: '2024-01-14T09:15:00Z',
    customerName: 'Michael Chen',
    email: 'michael.chen@email.com',
    firstOrderDate: '2024-01-14T09:15:00Z',
    firstOrder: 'Digital Course',
    totalOrders: 2,
    mostRecentOrderDate: '2024-01-17T11:30:00Z',
    mostRecentOrder: 'Advanced Course',
    totalSpent: 149.98,
    status: 'active'
  },
  {
    id: 3,
    joinDate: '2024-01-13T16:45:00Z',
    customerName: 'Emma Wilson',
    email: 'emma.wilson@email.com',
    firstOrderDate: '2024-01-13T16:45:00Z',
    firstOrder: 'Monthly Plan',
    totalOrders: 2,
    mostRecentOrderDate: '2024-01-16T09:20:00Z',
    mostRecentOrder: 'Pro Features',
    totalSpent: 109.98,
    status: 'pending'
  },
  {
    id: 4,
    joinDate: '2024-01-12T14:20:00Z',
    customerName: 'David Rodriguez',
    email: 'david.rodriguez@email.com',
    firstOrderDate: '2024-01-12T14:20:00Z',
    firstOrder: 'One-time Purchase',
    totalOrders: 4,
    mostRecentOrderDate: '2024-01-19T16:45:00Z',
    mostRecentOrder: 'Monthly Subscription',
    totalSpent: 119.96,
    status: 'active'
  },
  {
    id: 5,
    joinDate: '2024-01-11T11:30:00Z',
    customerName: 'Lisa Anderson',
    email: 'lisa.anderson@email.com',
    firstOrderDate: '2024-01-11T11:30:00Z',
    firstOrder: 'Annual Subscription',
    totalOrders: 2,
    mostRecentOrderDate: '2024-01-15T13:15:00Z',
    mostRecentOrder: 'Premium Support',
    totalSpent: 399.99,
    status: 'active'
  },
  {
    id: 6,
    joinDate: '2024-01-10T09:45:00Z',
    customerName: 'James Thompson',
    email: 'james.thompson@email.com',
    firstOrderDate: '2024-01-10T09:45:00Z',
    firstOrder: 'Enterprise Plan',
    totalOrders: 1,
    mostRecentOrderDate: '2024-01-10T09:45:00Z',
    mostRecentOrder: 'Enterprise Plan',
    totalSpent: 299.99,
    status: 'active'
  },
  {
    id: 7,
    joinDate: '2024-01-09T15:20:00Z',
    customerName: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    firstOrderDate: '2024-01-09T15:20:00Z',
    firstOrder: 'Starter Package',
    totalOrders: 3,
    mostRecentOrderDate: '2024-01-14T10:30:00Z',
    mostRecentOrder: 'Pro Upgrade',
    totalSpent: 95.97,
    status: 'active'
  },
  {
    id: 8,
    joinDate: '2024-01-08T10:15:00Z',
    customerName: 'Robert Kim',
    email: 'robert.kim@email.com',
    firstOrderDate: '2024-01-08T10:15:00Z',
    firstOrder: 'Pro Features',
    totalOrders: 2,
    mostRecentOrderDate: '2024-01-12T15:40:00Z',
    mostRecentOrder: 'Additional Storage',
    totalSpent: 119.98,
    status: 'active'
  },
  {
    id: 9,
    joinDate: '2024-01-07T13:40:00Z',
    customerName: 'Jennifer Lee',
    email: 'jennifer.lee@email.com',
    firstOrderDate: '2024-01-07T13:40:00Z',
    firstOrder: 'Monthly Subscription',
    totalOrders: 3,
    mostRecentOrderDate: '2024-01-16T08:25:00Z',
    mostRecentOrder: 'Premium Features',
    totalSpent: 104.97,
    status: 'active'
  },
  {
    id: 10,
    joinDate: '2024-01-06T08:25:00Z',
    customerName: 'Thomas Brown',
    email: 'thomas.brown@email.com',
    firstOrderDate: '2024-01-06T08:25:00Z',
    firstOrder: 'Basic Plan',
    totalOrders: 1,
    mostRecentOrderDate: '2024-01-06T08:25:00Z',
    mostRecentOrder: 'Basic Plan',
    totalSpent: 39.99,
    status: 'active'
  },
  {
    id: 11,
    joinDate: '2024-01-05T17:10:00Z',
    customerName: 'Amanda White',
    email: 'amanda.white@email.com',
    firstOrderDate: '2024-01-05T17:10:00Z',
    firstOrder: 'Add-on Features',
    totalOrders: 2,
    mostRecentOrderDate: '2024-01-11T12:30:00Z',
    mostRecentOrder: 'Enterprise Upgrade',
    totalSpent: 359.98,
    status: 'active'
  },
  {
    id: 12,
    joinDate: '2024-01-04T12:55:00Z',
    customerName: 'Christopher Davis',
    email: 'christopher.davis@email.com',
    firstOrderDate: '2024-01-04T12:55:00Z',
    firstOrder: 'Premium Features',
    totalOrders: 3,
    mostRecentOrderDate: '2024-01-13T17:20:00Z',
    mostRecentOrder: 'API Access',
    totalSpent: 249.97,
    status: 'active'
  },
  {
    id: 13,
    joinDate: '2024-01-03T16:20:00Z',
    customerName: 'Nicole Martinez',
    email: 'nicole.martinez@email.com',
    firstOrderDate: '2024-01-03T16:20:00Z',
    firstOrder: 'Consultation Service',
    totalOrders: 2,
    mostRecentOrderDate: '2024-01-09T14:45:00Z',
    mostRecentOrder: 'Follow-up Session',
    totalSpent: 249.98,
    status: 'active'
  },
  {
    id: 14,
    joinDate: '2024-01-02T11:45:00Z',
    customerName: 'Kevin Taylor',
    email: 'kevin.taylor@email.com',
    firstOrderDate: '2024-01-02T11:45:00Z',
    firstOrder: 'Training Course',
    totalOrders: 1,
    mostRecentOrderDate: '2024-01-02T11:45:00Z',
    mostRecentOrder: 'Training Course',
    totalSpent: 199.99,
    status: 'active'
  },
  {
    id: 15,
    joinDate: '2024-01-01T14:30:00Z',
    customerName: 'Rachel Green',
    email: 'rachel.green@email.com',
    firstOrderDate: '2024-01-01T14:30:00Z',
    firstOrder: 'Monthly Plan',
    totalOrders: 4,
    mostRecentOrderDate: '2024-01-18T11:15:00Z',
    mostRecentOrder: 'Premium Upgrade',
    totalSpent: 179.96,
    status: 'active'
  },
  {
    id: 16,
    joinDate: '2023-12-31T18:45:00Z',
    customerName: 'Daniel Lewis',
    email: 'daniel.lewis@email.com',
    firstOrderDate: '2023-12-31T18:45:00Z',
    firstOrder: 'Advanced Course',
    totalOrders: 2,
    mostRecentOrderDate: '2024-01-07T13:25:00Z',
    mostRecentOrder: 'Course Extension',
    totalSpent: 349.98,
    status: 'active'
  },
  {
    id: 17,
    joinDate: '2023-12-30T16:20:00Z',
    customerName: 'Michelle Adams',
    email: 'michelle.adams@email.com',
    firstOrderDate: '2023-12-30T16:20:00Z',
    firstOrder: 'Custom Integration',
    totalOrders: 1,
    mostRecentOrderDate: '2023-12-30T16:20:00Z',
    mostRecentOrder: 'Custom Integration',
    totalSpent: 499.99,
    status: 'active'
  },
  {
    id: 18,
    joinDate: '2023-12-29T12:15:00Z',
    customerName: 'Andrew Johnson',
    email: 'andrew.johnson@email.com',
    firstOrderDate: '2023-12-29T12:15:00Z',
    firstOrder: 'Bulk License Package',
    totalOrders: 2,
    mostRecentOrderDate: '2024-01-05T12:20:00Z',
    mostRecentOrder: 'Additional Licenses',
    totalSpent: 1199.98,
    status: 'active'
  },
  {
    id: 19,
    joinDate: '2023-12-28T14:40:00Z',
    customerName: 'Laura Martinez',
    email: 'laura.martinez@email.com',
    firstOrderDate: '2023-12-28T14:40:00Z',
    firstOrder: 'Premium Support Plan',
    totalOrders: 3,
    mostRecentOrderDate: '2024-01-04T14:15:00Z',
    mostRecentOrder: 'Support Extension',
    totalSpent: 449.97,
    status: 'active'
  },
  {
    id: 20,
    joinDate: '2023-12-27T10:30:00Z',
    customerName: 'Michael Thompson',
    email: 'michael.thompson@email.com',
    firstOrderDate: '2023-12-27T10:30:00Z',
    firstOrder: 'Enterprise Dashboard',
    totalOrders: 1,
    mostRecentOrderDate: '2023-12-27T10:30:00Z',
    mostRecentOrder: 'Enterprise Dashboard',
    totalSpent: 399.99,
    status: 'active'
  },
  {
    id: 21,
    joinDate: '2023-12-26T15:25:00Z',
    customerName: 'Jessica Brown',
    email: 'jessica.brown@email.com',
    firstOrderDate: '2023-12-26T15:25:00Z',
    firstOrder: 'Starter Package',
    totalOrders: 2,
    mostRecentOrderDate: '2024-01-06T15:30:00Z',
    mostRecentOrder: 'Pro Upgrade',
    totalSpent: 79.98,
    status: 'active'
  },
  {
    id: 22,
    joinDate: '2023-12-25T19:10:00Z',
    customerName: 'Ryan Miller',
    email: 'ryan.miller@email.com',
    firstOrderDate: '2023-12-25T19:10:00Z',
    firstOrder: 'Pro Features',
    totalOrders: 3,
    mostRecentOrderDate: '2024-01-06T12:15:00Z',
    mostRecentOrder: 'Advanced Tools',
    totalSpent: 269.97,
    status: 'active'
  },
  {
    id: 23,
    joinDate: '2023-12-24T11:55:00Z',
    customerName: 'Ashley Davis',
    email: 'ashley.davis@email.com',
    firstOrderDate: '2023-12-24T11:55:00Z',
    firstOrder: 'Monthly Subscription',
    totalOrders: 2,
    mostRecentOrderDate: '2024-01-05T18:45:00Z',
    mostRecentOrder: 'Premium Features',
    totalSpent: 109.98,
    status: 'pending'
  },
  {
    id: 24,
    joinDate: '2023-12-23T16:30:00Z',
    customerName: 'Christopher Wilson',
    email: 'christopher.wilson@email.com',
    firstOrderDate: '2023-12-23T16:30:00Z',
    firstOrder: 'Annual Plan',
    totalOrders: 1,
    mostRecentOrderDate: '2023-12-23T16:30:00Z',
    mostRecentOrder: 'Annual Plan',
    totalSpent: 199.99,
    status: 'active'
  },
  {
    id: 25,
    joinDate: '2023-12-22T13:45:00Z',
    customerName: 'Amanda Garcia',
    email: 'amanda.garcia@email.com',
    firstOrderDate: '2023-12-22T13:45:00Z',
    firstOrder: 'Enterprise Setup',
    totalOrders: 2,
    mostRecentOrderDate: '2024-01-04T16:30:00Z',
    mostRecentOrder: 'Additional Services',
    totalSpent: 799.98,
    status: 'active'
  },
  {
    id: 26,
    joinDate: '2023-12-21T17:20:00Z',
    customerName: 'Brandon Lee',
    email: 'brandon.lee@email.com',
    firstOrderDate: '2023-12-21T17:20:00Z',
    firstOrder: 'Training Course',
    totalOrders: 1,
    mostRecentOrderDate: '2023-12-21T17:20:00Z',
    mostRecentOrder: 'Training Course',
    totalSpent: 149.99,
    status: 'pending'
  },
  {
    id: 27,
    joinDate: '2023-12-20T09:35:00Z',
    customerName: 'Samantha Taylor',
    email: 'samantha.taylor@email.com',
    firstOrderDate: '2023-12-20T09:35:00Z',
    firstOrder: 'Custom Solution',
    totalOrders: 2,
    mostRecentOrderDate: '2024-01-03T19:20:00Z',
    mostRecentOrder: 'Solution Extension',
    totalSpent: 1199.98,
    status: 'active'
  },
  {
    id: 28,
    joinDate: '2023-12-19T14:50:00Z',
    customerName: 'Joshua Martinez',
    email: 'joshua.martinez@email.com',
    firstOrderDate: '2023-12-19T14:50:00Z',
    firstOrder: 'Basic Plan',
    totalOrders: 3,
    mostRecentOrderDate: '2024-01-03T13:15:00Z',
    mostRecentOrder: 'Premium Upgrade',
    totalSpent: 89.97,
    status: 'active'
  },
  {
    id: 29,
    joinDate: '2023-12-18T11:25:00Z',
    customerName: 'Nicole Anderson',
    email: 'nicole.anderson@email.com',
    firstOrderDate: '2023-12-18T11:25:00Z',
    firstOrder: 'Premium Features',
    totalOrders: 2,
    mostRecentOrderDate: '2024-01-02T17:40:00Z',
    mostRecentOrder: 'Feature Extension',
    totalSpent: 159.98,
    status: 'pending'
  }
];

// Mock data for refunds processed
const mockRefundsProcessed = [
  {
    id: 1,
    refundDate: '2024-01-13T09:45:00Z',
    customer: 'James Thompson',
    email: 'james.thompson@email.com',
    originalProduct: 'Premium Plan',
    refundAmount: 99.99,
    reason: 'Service not as expected',
    status: 'completed'
  },
  {
    id: 2,
    refundDate: '2024-01-10T08:25:00Z',
    customer: 'Thomas Brown',
    email: 'thomas.brown@email.com',
    originalProduct: 'Course Access',
    refundAmount: 49.99,
    reason: 'Duplicate purchase',
    status: 'completed'
  },
  {
    id: 3,
    refundDate: '2024-01-08T14:15:00Z',
    customer: 'Michelle Roberts',
    email: 'michelle.roberts@email.com',
    originalProduct: 'Annual Subscription',
    refundAmount: 199.99,
    reason: 'Billing error',
    status: 'completed'
  },
  {
    id: 4,
    refundDate: '2024-01-06T11:30:00Z',
    customer: 'Steven Davis',
    email: 'steven.davis@email.com',
    originalProduct: 'Pro Features',
    refundAmount: 79.99,
    reason: 'Technical issues',
    status: 'completed'
  },
  {
    id: 5,
    refundDate: '2024-01-04T16:45:00Z',
    customer: 'Karen Wilson',
    email: 'karen.wilson@email.com',
    originalProduct: 'Monthly Plan',
    refundAmount: 29.99,
    reason: 'Unsatisfied with service',
    status: 'completed'
  },
  {
    id: 6,
    refundDate: '2024-01-02T13:20:00Z',
    customer: 'Paul Anderson',
    email: 'paul.anderson@email.com',
    originalProduct: 'Digital Course',
    refundAmount: 149.99,
    reason: 'Content not accessible',
    status: 'completed'
  },
  {
    id: 7,
    refundDate: '2023-12-30T10:15:00Z',
    customer: 'Linda Martinez',
    email: 'linda.martinez@email.com',
    originalProduct: 'Enterprise Plan',
    refundAmount: 299.99,
    reason: 'Changed requirements',
    status: 'completed'
  },
  {
    id: 8,
    refundDate: '2023-12-28T15:40:00Z',
    customer: 'Mark Johnson',
    email: 'mark.johnson@email.com',
    originalProduct: 'Add-on Package',
    refundAmount: 59.99,
    reason: 'Accidental purchase',
    status: 'completed'
  },
  {
    id: 9,
    refundDate: '2023-12-26T09:25:00Z',
    customer: 'Patricia Lee',
    email: 'patricia.lee@email.com',
    originalProduct: 'Training Course',
    refundAmount: 199.99,
    reason: 'Schedule conflict',
    status: 'completed'
  },
  {
    id: 10,
    refundDate: '2023-12-24T12:10:00Z',
    customer: 'Robert Garcia',
    email: 'robert.garcia@email.com',
    originalProduct: 'Premium Support',
    refundAmount: 149.99,
    reason: 'Service downgrade',
    status: 'completed'
  },
  {
    id: 11,
    refundDate: '2023-12-22T14:55:00Z',
    customer: 'Jennifer Taylor',
    email: 'jennifer.taylor@email.com',
    originalProduct: 'Basic Plan',
    refundAmount: 39.99,
    reason: 'Billing dispute',
    status: 'completed'
  },
  {
    id: 12,
    refundDate: '2023-12-20T11:30:00Z',
    customer: 'David Brown',
    email: 'david.brown@email.com',
    originalProduct: 'Starter Package',
    refundAmount: 15.99,
    reason: 'Not needed',
    status: 'completed'
  }
];

export default function RecentActivityTableHome3() {
  const [isClient, setIsClient] = useState(false);
  const [screenSize, setScreenSize] = useState('desktop');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeTab, setActiveTab] = useState('new_transactions');
  const [isUpdatingView, setIsUpdatingView] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dataType, setDataType] = useState('transactions'); // 'transactions' or 'customers'
  const [stats, setStats] = useState({
    totalReceived: 0,
    newTransactions: 0,
    pendingPayments: 0,
    newCustomers: 0,
    refundsProcessed: 0,
    allTransactions: 0
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 12,
    totalPages: 2,
    hasNextPage: true,
    hasPrevPage: false
  });

  useEffect(() => {
    setIsClient(true);
    
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width <= 768) {
        setScreenSize('mobile');
      } else if (width <= 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Calculate stats from mock data
  const calculateStats = () => {
    return {
      newTransactions: mockNewTransactions.length,
      pendingPayments: mockUnfulfilledOrders.length,
      newCustomers: mockNewCustomers.length,
      refundsProcessed: mockRefundsProcessed.length
    };
  };

  // Filter mock data based on selected tab
  const getFilteredTransactions = (filter) => {
    console.log('Filtering data for:', filter);
    let filtered = [];
    let currentDataType = 'transactions';
    
    switch (filter) {
      case 'new_transactions':
        filtered = mockNewTransactions;
        currentDataType = 'new_transactions';
        break;
      case 'pending':
        filtered = mockUnfulfilledOrders;
        currentDataType = 'unfulfilled_orders';
        break;
      case 'new_customers':
        filtered = mockNewCustomers;
        currentDataType = 'new_customers';
        break;
      case 'refunds':
        filtered = mockRefundsProcessed;
        currentDataType = 'refunds';
        break;
      default:
        // Default to new_transactions
        filtered = mockNewTransactions;
        currentDataType = 'new_transactions';
        break;
    }
    
    setDataType(currentDataType);
    return filtered;
  };

  // Generate filtered transactions based on search query
  const generateFilteredTransactions = (query) => {
    const allTransactions = getFilteredTransactions(activeTab);
    const queryLower = query.toLowerCase();
    
    // Filter based on various fields
    const filtered = allTransactions.filter(transaction => {
      return (
        transaction.customer?.toLowerCase().includes(queryLower) ||
        transaction.description?.toLowerCase().includes(queryLower) ||
        transaction.status?.toLowerCase().includes(queryLower) ||
        transaction.type?.toLowerCase().includes(queryLower) ||
        transaction.amount?.toString().includes(queryLower) ||
        transaction.reference?.toLowerCase().includes(queryLower)
      );
    });
    
    // If no matches found, return some sample filtered data to show the view update worked
    if (filtered.length === 0) {
      return allTransactions.slice(0, 3).map(t => ({
        ...t,
        description: `${query} - ${t.description}`
      }));
    }
    
    return filtered;
  };

    // Fetch transactions with pagination and filtering (using mock data)
  const fetchTransactions = (page = 1, filter = activeTab, isTabSwitch = false) => {
    setIsTransitioning(true);
    
    const processData = () => {
      const filteredData = getFilteredTransactions(filter);
      const limit = 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = filteredData.slice(startIndex, endIndex);
      
      // Calculate and set stats
      const calculatedStats = calculateStats();
      setStats(calculatedStats);
      
      setTransactions(paginatedData);
      setPagination({
        page,
        limit,
        total: filteredData.length,
        totalPages: Math.ceil(filteredData.length / limit),
        hasNextPage: page < Math.ceil(filteredData.length / limit),
        hasPrevPage: page > 1
      });
          setCurrentPage(page);
          setLoading(false);
          
          // Fade in new content
          setTimeout(() => {
            setIsTransitioning(false);
          }, 50);
    };
    
    if (isTabSwitch) {
      // For tab switches, update immediately without delays
      processData();
    } else {
      // For pagination, keep the fade out delay
      setTimeout(() => {
        setLoading(true);
        // Simulate API delay for pagination
        setTimeout(processData, 300);
      }, 150);
    }
  };

  // Initial fetch
  useEffect(() => {
    // Initialize stats immediately
    const calculatedStats = calculateStats();
    setStats(calculatedStats);
    
    fetchTransactions(1);
  }, []);

  // Handle tab change
  const handleTabChange = (tabKey) => {
    console.log('Tab changed to:', tabKey);
    setActiveTab(tabKey);
    setCurrentPage(1);
    fetchTransactions(1, tabKey, true); // Pass true for isTabSwitch
  };

  // Handle view update
  const handleViewUpdate = () => {
    console.log('Creating view for:', searchQuery);
    setIsUpdatingView(true);
    
    // Simulate AI processing and view update
    setTimeout(() => {
      // Filter transactions based on search query
      const filteredTransactions = generateFilteredTransactions(searchQuery);
      setTransactions(filteredTransactions);
      setIsUpdatingView(false);
      
      // Update stats to reflect filtered data
      setStats({
        totalReceived: filteredTransactions.reduce((sum, t) => sum + (t.amount > 0 ? t.amount : 0), 0),
        newTransactions: filteredTransactions.length,
        pendingPayments: filteredTransactions.filter(t => t.status === 'pending').length,
        newCustomers: filteredTransactions.filter(t => t.type === 'payment').length,
        refundsProcessed: filteredTransactions.filter(t => t.type === 'refund').length,
        allTransactions: filteredTransactions.length
      });
    }, 3000);
  };

  const handlePageChange = (newPage) => {
    if (newPage !== currentPage && newPage >= 1 && newPage <= pagination.totalPages) {
      fetchTransactions(newPage);
    }
  };

  const handlePageClick = (e, pageNum) => {
    e.preventDefault();
    handlePageChange(pageNum);
  };

  const handlePrevClick = (e) => {
    e.preventDefault();
    handlePageChange(currentPage - 1);
  };

  const handleNextClick = (e) => {
    e.preventDefault();
    handlePageChange(currentPage + 1);
  };

  const getPageNumbers = () => {
    const { page, totalPages } = pagination;
    const pages = [];
    
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, 5);
      } else if (page >= totalPages - 2) {
        pages.push(totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(page - 2, page - 1, page, page + 1, page + 2);
      }
    }
    
    return pages;
  };

  // Mobile column definitions - only Date, Name, and Total
  const mobileColumnDefs = [
    {
      headerName: 'Date',
      field: 'date',
      width: 100,
      cellRenderer: DateCellRenderer
    },
    {
      headerName: 'Name',
      field: 'name',
      flex: 1,
      minWidth: 150,
      cellRenderer: NameCellRenderer
    },
    {
      headerName: 'Total',
      field: 'total',
      width: 100,
      resizable: false,
      cellClass: `${styles.totalAmount} ${styles.rightAligned}`,
      headerClass: styles.rightAligned,
      valueFormatter: (params) => {
        return formatCurrency(params.value);
      }
    }
  ];

  // Tablet column definitions - Date, Name, Amount, Fees, Total (no Payment Method or Product Name)
  const tabletColumnDefs = [
    {
      headerName: 'Date',
      field: 'date',
      width: 120,
      cellRenderer: DateCellRenderer
    },
    {
      headerName: 'Name',
      field: 'name',
      flex: 1,
      minWidth: 180,
      cellRenderer: NameCellRenderer
    },
    {
      headerName: 'Amount',
      field: 'amount',
      width: 110,
      cellClass: styles.rightAligned,
      headerClass: styles.rightAligned,
      valueFormatter: (params) => {
        return formatCurrency(params.value);
      }
    },
    {
      headerName: 'Fees',
      field: 'fees',
      width: 100,
      cellClass: `${styles.feesAmount} ${styles.rightAligned}`,
      headerClass: styles.rightAligned,
      valueFormatter: (params) => {
        return formatCurrency(params.value, true);
      }
    },
    {
      headerName: 'Total',
      field: 'total',
      width: 130,
      resizable: false,
      cellClass: `${styles.totalAmount} ${styles.rightAligned}`,
      headerClass: styles.rightAligned,
      valueFormatter: (params) => {
        return formatCurrency(params.value);
      }
    }
  ];

  // Desktop column definitions - all columns
  const desktopColumnDefs = [
    {
      headerName: 'Date',
      field: 'date',
      width: 120,
      cellRenderer: DateCellRenderer
    },
    {
      headerName: 'Name',
      field: 'name',
      width: 280,
      cellRenderer: NameCellRenderer
    },
    {
      headerName: 'Payment Method',
      field: 'paymentMethod',
      width: 180,
      cellRenderer: PaymentMethodCellRenderer
    },
    {
      headerName: 'Product Name',
      field: 'productName',
      flex: 1,
      minWidth: 200
    },
    {
      headerName: 'Amount',
      field: 'amount',
      width: 110,
      cellClass: styles.rightAligned,
      headerClass: styles.rightAligned,
      valueFormatter: (params) => {
        return formatCurrency(params.value);
      }
    },
    {
      headerName: 'Fees',
      field: 'fees',
      width: 100,
      cellClass: `${styles.feesAmount} ${styles.rightAligned}`,
      headerClass: styles.rightAligned,
      valueFormatter: (params) => {
        return formatCurrency(params.value, true);
      }
    },
    {
      headerName: 'Total',
      field: 'total',
      width: 130,
      resizable: false,
      cellClass: `${styles.totalAmount} ${styles.rightAligned}`,
      headerClass: styles.rightAligned,
      valueFormatter: (params) => {
        return formatCurrency(params.value);
      }
    }
  ];

  // Customer column definitions for customer-focused tabs
  const customerMobileColumnDefs = [
    {
      headerName: 'Customer',
      field: 'name',
      flex: 1,
      minWidth: 200,
      cellRenderer: CustomerCellRenderer
    },
    {
      headerName: 'Orders',
      field: 'orders',
      width: 80,
      cellClass: styles.rightAligned
    },
    {
      headerName: 'Total Spent',
      field: 'totalSpent',
      width: 120,
      cellClass: `${styles.totalAmount} ${styles.rightAligned}`,
      headerClass: styles.rightAligned,
      valueFormatter: (params) => {
        return formatCurrency(params.value);
      }
    }
  ];

  const customerTabletColumnDefs = [
    {
      headerName: 'Join Date',
      field: 'joinDate',
      width: 120,
      cellRenderer: DateCellRenderer
    },
    {
      headerName: 'Customer',
      field: 'name',
      flex: 1,
      minWidth: 200,
      cellRenderer: CustomerCellRenderer
    },
    {
      headerName: 'Orders',
      field: 'orders',
      width: 80,
      cellClass: styles.rightAligned
    },
    {
      headerName: 'Total Spent',
      field: 'totalSpent',
      width: 130,
      cellClass: `${styles.totalAmount} ${styles.rightAligned}`,
      headerClass: styles.rightAligned,
      valueFormatter: (params) => {
        return formatCurrency(params.value);
      }
    }
  ];

  const customerDesktopColumnDefs = [
    {
      headerName: 'Join Date',
      field: 'joinDate',
      width: 120,
      cellRenderer: DateCellRenderer
    },
    {
      headerName: 'Customer',
      field: 'name',
      width: 280,
      cellRenderer: CustomerCellRenderer
    },
    {
      headerName: 'Status',
      field: 'status',
      width: 100,
      valueFormatter: (params) => {
        if (!params.value) return '';
        return params.value.charAt(0).toUpperCase() + params.value.slice(1);
      }
    },
    {
      headerName: 'Orders',
      field: 'orders',
      width: 100,
      cellClass: styles.rightAligned
    },
    {
      headerName: 'Total Spent',
      field: 'totalSpent',
      width: 130,
      cellClass: `${styles.totalAmount} ${styles.rightAligned}`,
      headerClass: styles.rightAligned,
      valueFormatter: (params) => {
        return formatCurrency(params.value);
      }
    }
  ];

  // New Transactions Column Definitions
  const newTransactionsMobileColumnDefs = [
    {
      headerName: 'Date',
      field: 'date',
      width: 120,
      cellRenderer: DateCellRenderer
    },
    {
      headerName: 'Customer',
      field: 'customer',
      flex: 1,
      minWidth: 180,
      cellRenderer: CustomerWithEmailCellRenderer
    },
    {
      headerName: 'Amount',
      field: 'amount',
      width: 120,
      cellClass: `${styles.totalAmount} ${styles.rightAligned}`,
      headerClass: styles.rightAligned,
      resizable: false,
      valueFormatter: (params) => {
        return formatCurrency(params.value);
      }
    }
  ];

  const newTransactionsTabletColumnDefs = [
    {
      headerName: 'Date',
      field: 'date',
      width: 120,
      cellRenderer: DateCellRenderer
    },
    {
      headerName: 'Customer',
      field: 'customer',
      flex: 1,
      minWidth: 180,
      cellRenderer: CustomerWithEmailCellRenderer
    },
    {
      headerName: 'Product',
      field: 'product',
      flex: 1,
      minWidth: 200
    },
    {
      headerName: 'Amount',
      field: 'amount',
      width: 120,
      cellClass: `${styles.totalAmount} ${styles.rightAligned}`,
      headerClass: styles.rightAligned,
      valueFormatter: (params) => {
        return formatCurrency(params.value);
      }
    },
    {
      headerName: 'Status',
      field: 'status',
      width: 130,
      cellRenderer: StatusBadgeRenderer,
      resizable: false
    }
  ];

  const newTransactionsDesktopColumnDefs = [
    {
      headerName: 'Date',
      field: 'date',
      width: 120,
      cellRenderer: DateCellRenderer
    },
    {
      headerName: 'Customer',
      field: 'customer',
      width: 280,
      cellRenderer: CustomerWithEmailCellRenderer
    },
    {
      headerName: 'Payment Method',
      field: 'paymentMethod',
      width: 180,
      cellRenderer: PaymentMethodCellRenderer
    },
    {
      headerName: 'Product',
      field: 'product',
      flex: 1,
      minWidth: 200
    },
    {
      headerName: 'Amount',
      field: 'amount',
      width: 120,
      cellClass: `${styles.totalAmount} ${styles.rightAligned}`,
      headerClass: styles.rightAligned,
      valueFormatter: (params) => {
        return formatCurrency(params.value);
      }
    },
    {
      headerName: 'Status',
      field: 'status',
      width: 130,
      cellRenderer: StatusBadgeRenderer,
      resizable: false
    }
  ];

  // Unfulfilled Orders Column Definitions
  const unfulfilledOrdersMobileColumnDefs = [
    {
      headerName: 'Order Date',
      field: 'orderDate',
      width: 120,
      cellRenderer: DateCellRenderer
    },
    {
      headerName: 'Customer',
      field: 'customer',
      flex: 1,
      minWidth: 180,
      cellRenderer: CustomerWithEmailCellRenderer
    },
    {
      headerName: 'Order Value',
      field: 'orderValue',
      width: 120,
      cellClass: `${styles.totalAmount} ${styles.rightAligned}`,
      headerClass: styles.rightAligned,
      resizable: false,
      valueFormatter: (params) => {
        return formatCurrency(params.value);
      }
    }
  ];

  const unfulfilledOrdersTabletColumnDefs = [
    {
      headerName: 'Order Date',
      field: 'orderDate',
      width: 120,
      cellRenderer: DateCellRenderer
    },
    {
      headerName: 'Customer',
      field: 'customer',
      flex: 1,
      minWidth: 180,
      cellRenderer: CustomerWithEmailCellRenderer
    },
    {
      headerName: 'Product',
      field: 'product',
      flex: 1,
      minWidth: 200
    },
    {
      headerName: 'Quantity',
      field: 'quantity',
      width: 100,
      cellClass: styles.rightAligned
    },
    {
      headerName: 'Order Value',
      field: 'orderValue',
      width: 120,
      cellClass: `${styles.totalAmount} ${styles.rightAligned}`,
      headerClass: styles.rightAligned,
      resizable: false,
      valueFormatter: (params) => {
        return formatCurrency(params.value);
      }
    }
  ];

  const unfulfilledOrdersDesktopColumnDefs = [
    {
      headerName: 'Order Date',
      field: 'orderDate',
      width: 120,
      cellRenderer: DateCellRenderer
    },
    {
      headerName: 'Customer',
      field: 'customer',
      width: 280,
      cellRenderer: CustomerWithEmailCellRenderer
    },
    {
      headerName: 'Product',
      field: 'product',
      flex: 1,
      minWidth: 200
    },
    {
      headerName: 'Quantity',
      field: 'quantity',
      width: 100,
      cellClass: styles.rightAligned
    },
    {
      headerName: 'Order Value',
      field: 'orderValue',
      width: 120,
      cellClass: `${styles.totalAmount} ${styles.rightAligned}`,
      headerClass: styles.rightAligned,
      valueFormatter: (params) => {
        return formatCurrency(params.value);
      }
    },
    {
      headerName: 'Order Status',
      field: 'orderStatus',
      width: 160,
      cellRenderer: StatusBadgeRenderer,
      resizable: false
    }
  ];

  // New Customers Column Definitions
  const newCustomersMobileColumnDefs = [
    {
      headerName: 'Join Date',
      field: 'joinDate',
      width: 120,
      cellRenderer: DateCellRenderer
    },
    {
      headerName: 'Customer',
      field: 'customerName',
      flex: 1,
      minWidth: 180,
      cellRenderer: CustomerNameEmailCellRenderer
    },
    {
      headerName: 'Total Spent',
      field: 'totalSpent',
      width: 120,
      cellClass: `${styles.totalAmount} ${styles.rightAligned}`,
      headerClass: styles.rightAligned,
      resizable: false,
      valueFormatter: (params) => {
        return formatCurrency(params.value);
      }
    }
  ];

  const newCustomersTabletColumnDefs = [
    {
      headerName: 'Join Date',
      field: 'joinDate',
      width: 120,
      cellRenderer: DateCellRenderer
    },
    {
      headerName: 'Customer',
      field: 'customerName',
      flex: 2,
      minWidth: 200,
      cellRenderer: CustomerNameEmailCellRenderer
    },
    {
      headerName: 'Total Orders',
      field: 'totalOrders',
      width: 120,
      cellClass: styles.rightAligned,
      headerClass: styles.rightAligned
    },
    {
      headerName: 'First Order',
      field: 'firstOrder',
      flex: 1,
      minWidth: 150,
      cellRenderer: FirstOrderCellRenderer
    },
    {
      headerName: 'Total Spent',
      field: 'totalSpent',
      width: 120,
      cellClass: `${styles.totalAmount} ${styles.rightAligned}`,
      headerClass: styles.rightAligned,
      resizable: false,
      valueFormatter: (params) => {
        return formatCurrency(params.value);
      }
    }
  ];

  const newCustomersDesktopColumnDefs = [
    {
      headerName: 'Join Date',
      field: 'joinDate',
      width: 120,
      cellRenderer: DateCellRenderer
    },
    {
      headerName: 'Customer',
      field: 'customerName',
      flex: 1,
      minWidth: 250,
      cellRenderer: CustomerNameEmailCellRenderer
    },
    {
      headerName: 'Total Orders',
      field: 'totalOrders',
      width: 120,
      cellClass: styles.rightAligned,
      headerClass: styles.rightAligned
    },
    {
      headerName: 'First Order',
      field: 'firstOrder',
      width: 180,
      cellRenderer: FirstOrderCellRenderer
    },
    {
      headerName: 'Most Recent Order',
      field: 'mostRecentOrder',
      width: 180,
      cellRenderer: MostRecentOrderCellRenderer
    },
    {
      headerName: 'Total Spent',
      field: 'totalSpent',
      width: 120,
      cellClass: `${styles.totalAmount} ${styles.rightAligned}`,
      headerClass: styles.rightAligned,
      resizable: false,
      valueFormatter: (params) => {
        return formatCurrency(params.value);
      }
    }
  ];

  // Refunds Processed Column Definitions
  const refundsMobileColumnDefs = [
    {
      headerName: 'Refund Date',
      field: 'refundDate',
      width: 120,
      cellRenderer: DateCellRenderer
    },
    {
      headerName: 'Customer',
      field: 'customer',
      flex: 1,
      minWidth: 180,
      cellRenderer: CustomerWithEmailCellRenderer
    },
    {
      headerName: 'Refund Amount',
      field: 'refundAmount',
      width: 140,
      cellClass: `${styles.totalAmount} ${styles.rightAligned}`,
      headerClass: styles.rightAligned,
      resizable: false,
      valueFormatter: (params) => {
        return formatCurrency(params.value);
      }
    }
  ];

  const refundsTabletColumnDefs = [
    {
      headerName: 'Refund Date',
      field: 'refundDate',
      width: 120,
      cellRenderer: DateCellRenderer
    },
    {
      headerName: 'Customer',
      field: 'customer',
      flex: 1,
      minWidth: 180,
      cellRenderer: CustomerWithEmailCellRenderer
    },
    {
      headerName: 'Original Product',
      field: 'originalProduct',
      flex: 1,
      minWidth: 200
    },
    {
      headerName: 'Refund Amount',
      field: 'refundAmount',
      width: 140,
      cellClass: `${styles.totalAmount} ${styles.rightAligned}`,
      headerClass: styles.rightAligned,
      valueFormatter: (params) => {
        return formatCurrency(params.value);
      }
    },
    {
      headerName: 'Status',
      field: 'status',
      width: 130,
      cellRenderer: StatusBadgeRenderer,
      resizable: false
    }
  ];

  const refundsDesktopColumnDefs = [
    {
      headerName: 'Refund Date',
      field: 'refundDate',
      width: 120,
      cellRenderer: DateCellRenderer
    },
    {
      headerName: 'Customer',
      field: 'customer',
      width: 280,
      cellRenderer: CustomerWithEmailCellRenderer
    },
    {
      headerName: 'Original Product',
      field: 'originalProduct',
      width: 200
    },
    {
      headerName: 'Refund Amount',
      field: 'refundAmount',
      width: 140,
      cellClass: `${styles.totalAmount} ${styles.rightAligned}`,
      headerClass: styles.rightAligned,
      valueFormatter: (params) => {
        return formatCurrency(params.value);
      }
    },
    {
      headerName: 'Reason',
      field: 'reason',
      flex: 1,
      minWidth: 200
    },
    {
      headerName: 'Status',
      field: 'status',
      width: 130,
      cellRenderer: StatusBadgeRenderer,
      resizable: false
    }
  ];

  const defaultColDef = {
    sortable: true,
    filter: false,
    resizable: true
  };

  if (!isClient) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading transactions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.loading} style={{ color: 'red' }}>{error}</div>
      </div>
    );
  }

  // Tab configuration
  const tabs = [
    {
      key: 'new_transactions',
      label: 'New transactions',
      value: (stats.newTransactions || 0).toString(),
      color: 'default'
    },
    {
      key: 'pending',
      label: 'New orders',
      value: (stats.pendingPayments || 0).toString(),
      color: 'default'
    },
    {
      key: 'new_customers',
      label: 'New customers',
      value: (stats.newCustomers || 0).toString(),
      color: 'default'
    },
    {
      key: 'refunds',
      label: 'New disputes',
      value: (stats.refundsProcessed || 0).toString(),
      color: 'default'
    }
  ];

  return (
    <div className={styles.container}>
      {/* Section Heading */}
      <div className={styles.sectionHeading}>
        <h2>Activity since you last logged in</h2>
      </div>

      {/* Tabs */}
      <div className={tabStyles.tabsContainer}>
        <div className={tabStyles.tabsWrapper}>
          <div className={tabStyles.tabsList}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`${tabStyles.tabButton} ${activeTab === tab.key ? tabStyles.active : ''}`}
                onClick={() => handleTabChange(tab.key)}
              >
                <div className={`${tabStyles.tabValue} ${tab.color === 'positive' ? tabStyles.positive : ''}`}>
                  {tab.value}
                </div>
                <div className={tabStyles.tabLabel}>{tab.label}</div>
              </button>
            ))}
          </div>
          <div className={tabStyles.searchContainer}>
            <div className={tabStyles.searchInputWrapper}>
              <i className="ph ph-sparkle"></i>
              <input
                type="text"
                placeholder="create a view..."
                className={tabStyles.searchInput}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    handleViewUpdate();
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.gridContainer} ${isTransitioning ? styles.fadeOut : styles.fadeIn}`}>
        {/* Updating View Overlay */}
        {isUpdatingView && (
          <div className={styles.updatingOverlay}>
            <div className={styles.updatingContent}>
              <div className={styles.updatingSpinner}>
                <i className="ph ph-sparkle"></i>
              </div>
              <div className={styles.updatingText}>Updating your transactions...</div>
            </div>
          </div>
        )}
        <AgGridReact
          columnDefs={
            dataType === 'new_transactions' ? (
              screenSize === 'mobile' ? newTransactionsMobileColumnDefs :
              screenSize === 'tablet' ? newTransactionsTabletColumnDefs :
              newTransactionsDesktopColumnDefs
            ) : dataType === 'unfulfilled_orders' ? (
              screenSize === 'mobile' ? unfulfilledOrdersMobileColumnDefs :
              screenSize === 'tablet' ? unfulfilledOrdersTabletColumnDefs :
              unfulfilledOrdersDesktopColumnDefs
            ) : dataType === 'new_customers' ? (
              screenSize === 'mobile' ? newCustomersMobileColumnDefs :
              screenSize === 'tablet' ? newCustomersTabletColumnDefs :
              newCustomersDesktopColumnDefs
            ) : dataType === 'refunds' ? (
              screenSize === 'mobile' ? refundsMobileColumnDefs :
              screenSize === 'tablet' ? refundsTabletColumnDefs :
              refundsDesktopColumnDefs
            ) : (
            screenSize === 'mobile' ? mobileColumnDefs :
            screenSize === 'tablet' ? tabletColumnDefs :
            desktopColumnDefs
            )
          }
          rowData={transactions}
          defaultColDef={defaultColDef}
          suppressHorizontalScroll={false}
          suppressMenuHide={true}
          theme={myTheme}
        />
      </div>
      
      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className={styles.pagination}>
          <div className={styles.paginationControls}>
            <button 
              className={`${styles.paginationBtn} ${!pagination.hasPrevPage ? styles.disabled : ''}`}
              onClick={handlePrevClick}
              disabled={!pagination.hasPrevPage}
            >
              <i className="ph ph-caret-left"></i>
              Previous
            </button>
            
            <div className={styles.pageNumbers}>
              {getPageNumbers().map((pageNum) => (
                <button
                  key={pageNum}
                  className={`${styles.pageNumber} ${pageNum === pagination.page ? styles.active : ''}`}
                  onClick={(e) => handlePageClick(e, pageNum)}
                >
                  {pageNum}
                </button>
              ))}
            </div>
            
            <button 
              className={`${styles.paginationBtn} ${!pagination.hasNextPage ? styles.disabled : ''}`}
              onClick={handleNextClick}
              disabled={!pagination.hasNextPage}
            >
              Next
              <i className="ph ph-caret-right"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 