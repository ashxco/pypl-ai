import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule, themeQuartz } from 'ag-grid-community';
import { useState, useEffect } from 'react';
import styles from '../styles/RecentActivityTable.module.css';

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
  
  if (method.includes('PayPal')) {
    iconClass = 'ph ph-paypal-logo';
    if (method.includes('Balance')) {
      methodName = 'PayPal';
      methodNumber = 'PayPal Balance';
    } else if (method.includes('Credit')) {
      methodName = 'PayPal';
      methodNumber = 'PayPal Credit';
    } else {
      methodName = 'PayPal';
    }
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
  } else if (method.includes('Bank')) {
    iconClass = 'ph ph-bank';
    methodName = 'Bank';
    methodNumber = 'Checking ending in ••••';
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

export default function RecentActivityTable() {
  const [isClient, setIsClient] = useState(false);
  const [screenSize, setScreenSize] = useState('desktop');

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
        return `$${params.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
        return `$${params.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
    },
    {
      headerName: 'Fees',
      field: 'fees',
      width: 100,
      cellClass: `${styles.feesAmount} ${styles.rightAligned}`,
      headerClass: styles.rightAligned,
      valueFormatter: (params) => {
        return `-$${params.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
        return `$${params.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
        return `$${params.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
    },
    {
      headerName: 'Fees',
      field: 'fees',
      width: 100,
      cellClass: `${styles.feesAmount} ${styles.rightAligned}`,
      headerClass: styles.rightAligned,
      valueFormatter: (params) => {
        return `-$${params.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
        return `$${params.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
    }
  ];

  const rowData = [
    {
      date: '2024-01-30T14:30:00',
      name: 'John Smith',
      email: 'john.smith@email.com',
      paymentMethod: 'PayPal Balance',
      productName: 'Premium Subscription - Annual Plan',
      amount: 299.99,
      fees: 9.00,
      total: 290.99
    },
    {
      date: '2024-01-30T09:15:00',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      paymentMethod: 'Visa **** 4532',
      productName: 'E-commerce Website Development',
      amount: 1250.00,
      fees: 37.50,
      total: 1212.50
    },
    {
      date: '2024-01-29T16:45:00',
      name: 'Mike Davis',
      email: 'mike.davis@business.net',
      paymentMethod: 'Mastercard **** 8901',
      productName: 'Digital Marketing Course',
      amount: 149.99,
      fees: 4.50,
      total: 145.49
    },
    {
      date: '2024-01-29T11:20:00',
      name: 'Emily Wilson',
      email: 'emily.wilson@design.co',
      paymentMethod: 'PayPal Credit',
      productName: 'Graphic Design Package',
      amount: 450.00,
      fees: 13.50,
      total: 436.50
    },
    {
      date: '2024-01-28T13:10:00',
      name: 'Robert Brown',
      email: 'robert.brown@consulting.org',
      paymentMethod: 'Bank Transfer',
      productName: 'Consulting Services - Q1 2024',
      amount: 2500.00,
      fees: 75.00,
      total: 2425.00
    },
    {
      date: '2024-01-28T08:30:00',
      name: 'Lisa Garcia',
      email: 'lisa.garcia@tech.com',
      paymentMethod: 'Visa **** 1234',
      productName: 'Mobile App Development',
      amount: 3200.00,
      fees: 96.00,
      total: 3104.00
    },
    {
      date: '2024-01-27T15:25:00',
      name: 'David Miller',
      email: 'david.miller@marketing.io',
      paymentMethod: 'PayPal Balance',
      productName: 'SEO Optimization Service',
      amount: 750.00,
      fees: 22.50,
      total: 727.50
    },
    {
      date: '2024-01-27T10:40:00',
      name: 'Jennifer Taylor',
      email: 'jennifer.taylor@photo.studio',
      paymentMethod: 'Mastercard **** 5678',
      productName: 'Photography Session',
      amount: 350.00,
      fees: 10.50,
      total: 339.50
    },
    {
      date: '2024-01-26T17:55:00',
      name: 'Thomas Anderson',
      email: 'thomas.anderson@hosting.com',
      paymentMethod: 'PayPal Credit',
      productName: 'Web Hosting - 2 Years',
      amount: 240.00,
      fees: 7.20,
      total: 232.80
    },
    {
      date: '2024-01-26T12:05:00',
      name: 'Maria Rodriguez',
      email: 'maria.rodriguez@creative.mx',
      paymentMethod: 'Bank Transfer',
      productName: 'Business Logo Design',
      amount: 125.00,
      fees: 3.75,
      total: 121.25
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
        <div className={styles.header}>
          <h2 className={styles.title}>Recent Activity</h2>
        </div>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Recent Activity</h2>
      </div>
      <div className={styles.gridContainer}>
        <AgGridReact
          columnDefs={
            screenSize === 'mobile' ? mobileColumnDefs :
            screenSize === 'tablet' ? tabletColumnDefs :
            desktopColumnDefs
          }
          rowData={rowData}
          defaultColDef={defaultColDef}
          domLayout='autoHeight'
          suppressHorizontalScroll={false}
          suppressMenuHide={true}
          theme={myTheme}
        />
      </div>
    </div>
  );
} 