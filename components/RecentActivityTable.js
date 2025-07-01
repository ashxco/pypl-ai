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

export default function RecentActivityTable() {
  const [isClient, setIsClient] = useState(false);
  const [screenSize, setScreenSize] = useState('desktop');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
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

  // Fetch transactions with pagination
  const fetchTransactions = (page = 1) => {
    setIsTransitioning(true);
    
    // Fade out current content
    setTimeout(() => {
      setLoading(true);
      fetch(`/api/transactions?page=${page}&limit=10`, { method: 'GET', credentials: 'include' })
        .then(async (res) => {
          if (!res.ok) throw new Error('Failed to fetch transactions');
          const data = await res.json();
          setTransactions(data.transactions);
          setPagination(data.pagination);
          setCurrentPage(page);
          setLoading(false);
          
          // Fade in new content
          setTimeout(() => {
            setIsTransitioning(false);
          }, 50);
        })
        .catch((err) => {
          setError('Unable to load transactions');
          setLoading(false);
          setIsTransitioning(false);
        });
    }, 150); // Wait for fade out
  };

  // Initial fetch
  useEffect(() => {
    fetchTransactions(1);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchTransactions(newPage);
    }
  };

  const handlePageClick = (e, pageNum) => {
    e.preventDefault();
    handlePageChange(pageNum);
  };

  const handlePrevClick = (e) => {
    e.preventDefault();
    handlePageChange(pagination.page - 1);
  };

  const handleNextClick = (e) => {
    e.preventDefault();
    handlePageChange(pagination.page + 1);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const totalPages = pagination.totalPages;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const currentPage = pagination.page;
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);
      
      if (currentPage <= 3) {
        endPage = Math.min(totalPages, 5);
      }
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(1, totalPages - 4);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
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

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Recent Activity</h2>
        </div>
        <div className={styles.loading}>Loading transactions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Recent Activity</h2>
        </div>
        <div className={styles.loading} style={{ color: 'red' }}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Recent Activity</h2>
      </div>
      <div className={`${styles.gridContainer} ${isTransitioning ? styles.fadeOut : styles.fadeIn}`}>
        <AgGridReact
          columnDefs={
            screenSize === 'mobile' ? mobileColumnDefs :
            screenSize === 'tablet' ? tabletColumnDefs :
            desktopColumnDefs
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