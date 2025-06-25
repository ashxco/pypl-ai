import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BarChart from '../components/BarChart';
import LineChart from '../components/LineChart';
import styles from '../styles/ModernDashboard.module.css';

export default function Analytics() {
  const router = useRouter();
  const { user } = router.query;
  const [cookieUser, setCookieUser] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Dropdown states
  const [segmentDropdown, setSegmentDropdown] = useState(false);
  const [paymentDropdown, setPaymentDropdown] = useState(false);
  const [timeDropdown, setTimeDropdown] = useState(false);
  const [channelsDropdown, setChannelsDropdown] = useState(false);
  
  // Selected values
  const [selectedSegment, setSelectedSegment] = useState('All Segments');
  const [selectedPayment, setSelectedPayment] = useState('All payment methods');
  const [selectedTime, setSelectedTime] = useState('Last 30 days');
  const [selectedChannels, setSelectedChannels] = useState('All sales channels');
  
  // Visualization toggles
  const [showVisualization, setShowVisualization] = useState(true);
  const [showAovVisualization, setShowAovVisualization] = useState(true);
  const [showConversionVisualization, setShowConversionVisualization] = useState(true);
  


  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!user) {
      const match = document.cookie.match(/(?:^|; )username=([^;]+)/);
      if (match) {
        setCookieUser(decodeURIComponent(match[1]));
      } else {
        router.replace('/login');
      }
    }
  }, [user, router]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(`[class*="customDropdown"]`)) {
        setSegmentDropdown(false);
        setPaymentDropdown(false);
        setTimeDropdown(false);
        setChannelsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const displayUser = user || cookieUser;

  if (!displayUser) {
    return null;
  }

  // Last 30 days sales data with channel breakdown
  const salesData = [
    { date: "Nov 1", revenue: 3150, shopify: 2205, storeA: 315, invoicing: 315, other: 315 },
    { date: "Nov 2", revenue: 2850, shopify: 1995, storeA: 285, invoicing: 285, other: 285 },
    { date: "Nov 3", revenue: 3900, shopify: 2730, storeA: 390, invoicing: 390, other: 390 },
    { date: "Nov 4", revenue: 3600, shopify: 2520, storeA: 360, invoicing: 360, other: 360 },
    { date: "Nov 5", revenue: 2400, shopify: 1680, storeA: 240, invoicing: 240, other: 240 },
    { date: "Nov 6", revenue: 2100, shopify: 1470, storeA: 210, invoicing: 210, other: 210 },
    { date: "Nov 7", revenue: 2700, shopify: 1890, storeA: 270, invoicing: 270, other: 270 },
    { date: "Nov 8", revenue: 3300, shopify: 2310, storeA: 330, invoicing: 330, other: 330 },
    { date: "Nov 9", revenue: 4350, shopify: 3045, storeA: 435, invoicing: 435, other: 435 },
    { date: "Nov 10", revenue: 4650, shopify: 3255, storeA: 465, invoicing: 465, other: 465 },
    { date: "Nov 11", revenue: 5400, shopify: 3780, storeA: 540, invoicing: 540, other: 540 },
    { date: "Nov 12", revenue: 4200, shopify: 2940, storeA: 420, invoicing: 420, other: 420 },
    { date: "Nov 13", revenue: 3600, shopify: 2520, storeA: 360, invoicing: 360, other: 360 },
    { date: "Nov 14", revenue: 2550, shopify: 1785, storeA: 255, invoicing: 255, other: 255 },
    { date: "Nov 15", revenue: 3150, shopify: 2205, storeA: 315, invoicing: 315, other: 315 },
    { date: "Nov 16", revenue: 4350, shopify: 3045, storeA: 435, invoicing: 435, other: 435 },
    { date: "Nov 17", revenue: 4800, shopify: 3360, storeA: 480, invoicing: 480, other: 480 },
    { date: "Nov 18", revenue: 3450, shopify: 2415, storeA: 345, invoicing: 345, other: 345 },
    { date: "Nov 19", revenue: 3900, shopify: 2730, storeA: 390, invoicing: 390, other: 390 },
    { date: "Nov 20", revenue: 3600, shopify: 2520, storeA: 360, invoicing: 360, other: 360 },
    { date: "Nov 21", revenue: 2850, shopify: 1995, storeA: 285, invoicing: 285, other: 285 },
    { date: "Nov 22", revenue: 3150, shopify: 2205, storeA: 315, invoicing: 315, other: 315 },
    { date: "Nov 23", revenue: 4200, shopify: 2940, storeA: 420, invoicing: 420, other: 420 },
    { date: "Nov 24", revenue: 5100, shopify: 3570, storeA: 510, invoicing: 510, other: 510 },
    { date: "Nov 25", revenue: 3300, shopify: 2310, storeA: 330, invoicing: 330, other: 330 },
    { date: "Nov 26", revenue: 2700, shopify: 1890, storeA: 270, invoicing: 270, other: 270 },
    { date: "Nov 27", revenue: 3150, shopify: 2205, storeA: 315, invoicing: 315, other: 315 },
    { date: "Nov 28", revenue: 4050, shopify: 2835, storeA: 405, invoicing: 405, other: 405 },
    { date: "Nov 29", revenue: 4650, shopify: 3255, storeA: 465, invoicing: 465, other: 465 },
    { date: "Nov 30", revenue: 4350, shopify: 3045, storeA: 435, invoicing: 435, other: 435 },
  ];

  // Average Order Value data by payment method
  const aovData = [
    { date: "Nov 1", paypal: 112.45, paypalCredit: 98.32, creditDebit: 89.67 },
    { date: "Nov 2", paypal: 105.89, paypalCredit: 92.45, creditDebit: 82.23 },
    { date: "Nov 3", paypal: 118.67, paypalCredit: 105.12, creditDebit: 94.34 },
    { date: "Nov 4", paypal: 114.32, paypalCredit: 101.76, creditDebit: 90.45 },
    { date: "Nov 5", paypal: 102.76, paypalCredit: 91.45, creditDebit: 79.11 },
    { date: "Nov 6", paypal: 98.34, paypalCredit: 87.67, creditDebit: 75.89 },
    { date: "Nov 7", paypal: 107.45, paypalCredit: 95.18, creditDebit: 84.67 },
    { date: "Nov 8", paypal: 113.67, paypalCredit: 100.32, creditDebit: 89.78 },
    { date: "Nov 9", paypal: 127.89, paypalCredit: 112.45, creditDebit: 100.34 },
    { date: "Nov 10", paypal: 132.56, paypalCredit: 116.78, creditDebit: 104.91 },
    { date: "Nov 11", paypal: 148.32, paypalCredit: 130.65, creditDebit: 116.78 },
    { date: "Nov 12", paypal: 122.45, paypalCredit: 107.89, creditDebit: 96.23 },
    { date: "Nov 13", paypal: 116.78, paypalCredit: 102.45, creditDebit: 91.34 },
    { date: "Nov 14", paypal: 101.23, paypalCredit: 89.76, creditDebit: 79.45 },
    { date: "Nov 15", paypal: 112.45, paypalCredit: 98.67, creditDebit: 87.89 },
    { date: "Nov 16", paypal: 127.78, paypalCredit: 112.92, creditDebit: 100.45 },
    { date: "Nov 17", paypal: 135.23, paypalCredit: 119.56, creditDebit: 106.78 },
    { date: "Nov 18", paypal: 117.67, paypalCredit: 103.34, creditDebit: 92.56 },
    { date: "Nov 19", paypal: 120.45, paypalCredit: 106.89, creditDebit: 94.23 },
    { date: "Nov 20", paypal: 115.34, paypalCredit: 101.67, creditDebit: 89.78 },
    { date: "Nov 21", paypal: 105.56, paypalCredit: 92.45, creditDebit: 81.67 },
    { date: "Nov 22", paypal: 112.78, paypalCredit: 99.23, creditDebit: 87.45 },
    { date: "Nov 23", paypal: 123.89, paypalCredit: 109.56, creditDebit: 96.23 },
    { date: "Nov 24", paypal: 140.45, paypalCredit: 123.78, creditDebit: 109.34 },
    { date: "Nov 25", paypal: 114.23, paypalCredit: 100.45, creditDebit: 88.67 },
    { date: "Nov 26", paypal: 108.67, paypalCredit: 95.89, creditDebit: 84.45 },
    { date: "Nov 27", paypal: 112.89, paypalCredit: 99.45, creditDebit: 87.78 },
    { date: "Nov 28", paypal: 125.45, paypalCredit: 110.67, creditDebit: 97.89 },
    { date: "Nov 29", paypal: 132.78, paypalCredit: 117.45, creditDebit: 103.56 },
    { date: "Nov 30", paypal: 127.56, paypalCredit: 112.23, creditDebit: 99.34 },
  ];

  // PayPal Checkout Conversion Rate data (percentage)
  const conversionData = [
    { date: "Nov 1", paypalUser: 4.85, guestUser: 2.12 },
    { date: "Nov 2", paypalUser: 4.52, guestUser: 1.89 },
    { date: "Nov 3", paypalUser: 5.24, guestUser: 2.45 },
    { date: "Nov 4", paypalUser: 4.98, guestUser: 2.28 },
    { date: "Nov 5", paypalUser: 4.15, guestUser: 1.76 },
    { date: "Nov 6", paypalUser: 3.89, guestUser: 1.63 },
    { date: "Nov 7", paypalUser: 4.38, guestUser: 1.95 },
    { date: "Nov 8", paypalUser: 4.76, guestUser: 2.18 },
    { date: "Nov 9", paypalUser: 5.67, guestUser: 2.82 },
    { date: "Nov 10", paypalUser: 5.92, guestUser: 2.98 },
    { date: "Nov 11", paypalUser: 6.35, guestUser: 3.24 },
    { date: "Nov 12", paypalUser: 5.41, guestUser: 2.67 },
    { date: "Nov 13", paypalUser: 5.08, guestUser: 2.41 },
    { date: "Nov 14", paypalUser: 4.02, guestUser: 1.71 },
    { date: "Nov 15", paypalUser: 4.85, guestUser: 2.12 },
    { date: "Nov 16", paypalUser: 5.67, guestUser: 2.82 },
    { date: "Nov 17", paypalUser: 6.15, guestUser: 3.08 },
    { date: "Nov 18", paypalUser: 5.18, guestUser: 2.52 },
    { date: "Nov 19", paypalUser: 5.24, guestUser: 2.45 },
    { date: "Nov 20", paypalUser: 4.98, guestUser: 2.28 },
    { date: "Nov 21", paypalUser: 4.52, guestUser: 1.89 },
    { date: "Nov 22", paypalUser: 4.85, guestUser: 2.12 },
    { date: "Nov 23", paypalUser: 5.41, guestUser: 2.67 },
    { date: "Nov 24", paypalUser: 6.48, guestUser: 3.35 },
    { date: "Nov 25", paypalUser: 4.76, guestUser: 2.18 },
    { date: "Nov 26", paypalUser: 4.38, guestUser: 1.95 },
    { date: "Nov 27", paypalUser: 4.85, guestUser: 2.12 },
    { date: "Nov 28", paypalUser: 5.58, guestUser: 2.73 },
    { date: "Nov 29", paypalUser: 5.92, guestUser: 2.98 },
    { date: "Nov 30", paypalUser: 5.67, guestUser: 2.82 },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const closeSidebar = () => {
    setCollapsed(true);
  };

  // Close all dropdowns helper function
  const closeAllDropdowns = () => {
    setSegmentDropdown(false);
    setPaymentDropdown(false);
    setTimeDropdown(false);
    setChannelsDropdown(false);
  };

  // Custom toggle functions that close other dropdowns
  const toggleSegmentDropdown = () => {
    if (segmentDropdown) {
      setSegmentDropdown(false);
    } else {
      closeAllDropdowns();
      setSegmentDropdown(true);
    }
  };

  const toggleTimeDropdown = () => {
    if (timeDropdown) {
      setTimeDropdown(false);
    } else {
      closeAllDropdowns();
      setTimeDropdown(true);
    }
  };



  const toggleChannelsDropdown = () => {
    if (channelsDropdown) {
      setChannelsDropdown(false);
    } else {
      closeAllDropdowns();
      setChannelsDropdown(true);
    }
  };

  const togglePaymentDropdown = () => {
    if (paymentDropdown) {
      setPaymentDropdown(false);
    } else {
      closeAllDropdowns();
      setPaymentDropdown(true);
    }
  };

  // Custom Dropdown Component
  const CustomDropdown = ({ isOpen, toggle, selected, options, onChange }) => (
    <div className={styles.customDropdown}>
      <button 
        className={`${styles.dropdownButton} ${isOpen ? styles.open : ''}`}
        onClick={toggle}
      >
        <span>{selected}</span>
        <i className={`ph ph-caret-down ${styles.dropdownIcon} ${isOpen ? styles.rotated : ''}`}></i>
      </button>
      {isOpen && (
        <div className={styles.dropdownMenu}>
          {options.map((option, index) => (
            <div
              key={index}
              className={`${styles.dropdownItem} ${option === selected ? styles.selected : ''}`}
              onClick={() => {
                onChange(option);
                toggle();
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );



  return (
    <div style={{ height: '100vh' }}>
      <Sidebar 
        username={displayUser} 
        isAdmin={false} 
        collapsed={collapsed} 
        onClose={closeSidebar}
      />
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh', 
        marginLeft: isMobile ? '0' : (collapsed ? '0' : '250px'),
        transition: 'margin-left 0.3s ease',
        width: isMobile ? '100%' : 'auto'
      }}>
        <Header toggleSidebar={toggleSidebar} />
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <div className={styles.analyticsContainer}>
            {/* Page Title */}
            <div className={styles.pageTitle}>
              <h1>Business Performance</h1>
              <div className={styles.titleControls}>
                <CustomDropdown
                  isOpen={timeDropdown}
                  toggle={toggleTimeDropdown}
                  selected={selectedTime}
                  options={['Last 30 days', 'Last 7 days', 'Last 90 days', 'Last 6 months', 'Last year', 'Custom range']}
                  onChange={setSelectedTime}
                />
                <button className={styles.primaryButton}>
                  Generate Report
                </button>
              </div>
            </div>

            <div className={styles.mainContent}>
              {/* Left Panel */}
              <div className={styles.leftPanel}>


                {/* Sales */}
                <div className={styles.dailyStats}>
                  <div className={styles.salesHeader}>
                    <h3>Sales</h3>
                    <div className={styles.salesControls}>
                      <div className={styles.salesDropdowns}>
                        <CustomDropdown
                          isOpen={segmentDropdown}
                          toggle={toggleSegmentDropdown}
                          selected={selectedSegment}
                          options={['All Segments', 'New Customers', 'Repeat Customers', 'High Value Customers', 'Custom Segment A', 'Custom Segment B']}
                          onChange={setSelectedSegment}
                        />
                        <CustomDropdown
                          isOpen={channelsDropdown}
                          toggle={toggleChannelsDropdown}
                          selected={selectedChannels}
                          options={['All sales channels', 'Shopify', 'Store A', 'Invoicing', 'Other']}
                          onChange={setSelectedChannels}
                        />
                      </div>
                      <div className={styles.toggleContainer}>
                        <span className={styles.toggleLabel}>Chart</span>
                        <label className={styles.toggleSwitch}>
                          <input 
                            type="checkbox" 
                            checked={showVisualization}
                            onChange={(e) => setShowVisualization(e.target.checked)}
                          />
                          <span className={styles.toggleSlider}></span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Sales Bar Chart - with slide animation */}
                  <div className={`${styles.chartContainer} ${!showVisualization ? styles.hidden : ''}`}>
                    <BarChart
                      data={salesData}
                      index="date"
                      categories={["revenue"]}
                      colors={["blue"]}
                      valueFormatter={(value) => {
                        return `$${new Intl.NumberFormat('en-US').format(value)}`;
                      }}
                      height={250}
                      showGridLines={true}
                      showTooltip={true}
                      startEndOnly={true}
                    />
                  </div>
                  
                  <div className={styles.statRow}>
                    <div className={styles.statLabel}>
                      {showVisualization && <div className={styles.legendColor} style={{ backgroundColor: '#0066F5' }}></div>}
                      <span style={{ fontWeight: 'bold' }}>Overall</span>
                    </div>
                    <span>${new Intl.NumberFormat('en-US').format(salesData.reduce((sum, item) => sum + item.revenue, 0))}</span>
                  </div>
                  
                  <div className={styles.statRowIndented}>
                    <div className={styles.statLabel}>
                      {showVisualization && <div className={styles.legendColor} style={{ backgroundColor: '#00C853' }}></div>}
                      <span>Shopify</span>
                    </div>
                    <span>$73,575</span>
                  </div>
                  <div className={styles.statRowIndented}>
                    <div className={styles.statLabel}>
                      {showVisualization && <div className={styles.legendColor} style={{ backgroundColor: '#FF6D00' }}></div>}
                      <span>Store A</span>
                    </div>
                    <span>$10,515</span>
                  </div>
                  <div className={styles.statRowIndented}>
                    <div className={styles.statLabel}>
                      {showVisualization && <div className={styles.legendColor} style={{ backgroundColor: '#00BCD4' }}></div>}
                      <span>Invoicing</span>
                    </div>
                    <span>$10,515</span>
                  </div>
                  <div className={styles.statRowIndented}>
                    <div className={styles.statLabel}>
                      {showVisualization && <div className={styles.legendColor} style={{ backgroundColor: '#9C27B0' }}></div>}
                      <span>Other</span>
                    </div>
                    <span>$10,515</span>
                  </div>
                </div>

                {/* Average Order Value */}
                <div className={styles.dailyStats}>
                  <div className={styles.salesHeader}>
                    <h3>Average Order Value</h3>
                    <div className={styles.salesControls}>
                      <div className={styles.salesDropdowns}>
                        <CustomDropdown
                          isOpen={paymentDropdown}
                          toggle={togglePaymentDropdown}
                          selected={selectedPayment}
                          options={['All payment methods', 'PayPal', 'PayPal Credit', 'Credit and Debit Cards']}
                          onChange={setSelectedPayment}
                        />
                      </div>
                      <div className={styles.toggleContainer}>
                        <span className={styles.toggleLabel}>Chart</span>
                        <label className={styles.toggleSwitch}>
                          <input 
                            type="checkbox" 
                            checked={showAovVisualization}
                            onChange={(e) => setShowAovVisualization(e.target.checked)}
                          />
                          <span className={styles.toggleSlider}></span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {/* AOV Bar Chart - with slide animation */}
                  <div className={`${styles.chartContainer} ${!showAovVisualization ? styles.hidden : ''}`}>
                    <BarChart
                      data={aovData}
                      index="date"
                      categories={["paypal", "paypalCredit", "creditDebit"]}
                      colors={["navy", "blue", "cyan"]}
                      valueFormatter={(value) => {
                        return `$${value.toFixed(2)}`;
                      }}
                      height={250}
                      showGridLines={true}
                      showTooltip={true}
                      startEndOnly={true}
                    />
                  </div>
                  
                  <div className={styles.statRow}>
                    <div className={styles.statLabel}>
                      {showAovVisualization && <div className={styles.legendColor} style={{ backgroundColor: '#1e40af' }}></div>}
                      <span>PayPal</span>
                    </div>
                    <span>${(aovData.reduce((sum, item) => sum + item.paypal, 0) / aovData.length).toFixed(2)}</span>
                  </div>
                  
                  <div className={styles.statRow}>
                    <div className={styles.statLabel}>
                      {showAovVisualization && <div className={styles.legendColor} style={{ backgroundColor: '#0066F5' }}></div>}
                      <span>PayPal Credit</span>
                    </div>
                    <span>${(aovData.reduce((sum, item) => sum + item.paypalCredit, 0) / aovData.length).toFixed(2)}</span>
                  </div>
                  
                  <div className={styles.statRow}>
                    <div className={styles.statLabel}>
                      {showAovVisualization && <div className={styles.legendColor} style={{ backgroundColor: '#06b6d4' }}></div>}
                      <span>Credit and Debit Cards</span>
                    </div>
                    <span>${(aovData.reduce((sum, item) => sum + item.creditDebit, 0) / aovData.length).toFixed(2)}</span>
                  </div>
                </div>

                {/* PayPal Checkout Conversion Rate */}
                <div className={styles.dailyStats}>
                  <div className={styles.salesHeader}>
                    <h3>PayPal Checkout Conversion Rate</h3>
                    <div className={styles.salesControls}>
                      <div className={styles.toggleContainer}>
                        <span className={styles.toggleLabel}>Chart</span>
                        <label className={styles.toggleSwitch}>
                          <input 
                            type="checkbox" 
                            checked={showConversionVisualization}
                            onChange={(e) => setShowConversionVisualization(e.target.checked)}
                          />
                          <span className={styles.toggleSlider}></span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Conversion Rate Line Chart - with slide animation */}
                  <div className={`${styles.chartContainer} ${!showConversionVisualization ? styles.hidden : ''}`}>
                    <LineChart
                      data={conversionData}
                      index="date"
                      categories={["paypalUser", "guestUser"]}
                      colors={["navy", "indigo"]}
                      valueFormatter={(value) => {
                        return `${value.toFixed(2)}%`;
                      }}
                      height={250}
                      showGridLines={true}
                      showTooltip={true}
                      startEndOnly={true}
                    />
                  </div>
                  
                  <div className={styles.statRow}>
                    <div className={styles.statLabel}>
                      {showConversionVisualization && <div className={styles.legendColor} style={{ backgroundColor: '#1e40af' }}></div>}
                      <span>PayPal User</span>
                    </div>
                    <span>{(conversionData.reduce((sum, item) => sum + item.paypalUser, 0) / conversionData.length).toFixed(2)}%</span>
                  </div>
                  
                  <div className={styles.statRow}>
                    <div className={styles.statLabel}>
                      {showConversionVisualization && <div className={styles.legendColor} style={{ backgroundColor: '#6366f1' }}></div>}
                      <span>Guest User</span>
                    </div>
                    <span>{(conversionData.reduce((sum, item) => sum + item.guestUser, 0) / conversionData.length).toFixed(2)}%</span>
                  </div>
                </div>

              </div>

              {/* Right Panel - Recent Orders */}
              <div className={styles.rightPanel}>
                <div className={styles.recentOrders}>
                  <h3>Highlights</h3>
                  <div className={styles.insightsList}>
                    <div className={styles.insightItem}>
                      <div className={styles.insightIcon}>
                        <i className="ph ph-lightbulb"></i>
                      </div>
                      <div className={styles.insightContent}>
                        <div className={styles.insightTitle}>Revenue Opportunity</div>
                        <div className={styles.insightText}>Your conversion rate is 15% higher on weekends. Consider running targeted campaigns on Friday-Sunday.</div>
                        <div className={styles.insightActions}>
                          <button className={styles.insightCta}>Create Campaign</button>
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.insightItem}>
                      <div className={styles.insightIcon}>
                        <i className="ph ph-trend-up"></i>
                      </div>
                      <div className={styles.insightContent}>
                        <div className={styles.insightTitle}>Trending Product</div>
                        <div className={styles.insightText}>Art Canvas Print sales increased 45% this month. Stock levels may need adjustment to meet demand.</div>
                        <div className={styles.insightActions}>
                          <button className={styles.insightCta}>Adjust Inventory</button>
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.insightItem}>
                      <div className={styles.insightIcon}>
                        <i className="ph ph-warning"></i>
                      </div>
                      <div className={styles.insightContent}>
                        <div className={styles.insightTitle}>Customer Retention Alert</div>
                        <div className={styles.insightText}>23% of customers haven't returned in 60+ days. Consider launching a re-engagement email campaign.</div>
                        <div className={styles.insightActions}>
                          <button className={styles.insightCta}>Launch Campaign</button>
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.insightItem}>
                      <div className={styles.insightIcon}>
                        <i className="ph ph-device-mobile"></i>
                      </div>
                      <div className={styles.insightContent}>
                        <div className={styles.insightTitle}>Optimization Tip</div>
                        <div className={styles.insightText}>Mobile users show 28% lower conversion. Optimize mobile checkout flow to capture missed revenue.</div>
                        <div className={styles.insightActions}>
                          <button className={styles.insightCta}>Optimize Now</button>
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.insightItem}>
                      <div className={styles.insightIcon}>
                        <i className="ph ph-trophy"></i>
                      </div>
                      <div className={styles.insightContent}>
                        <div className={styles.insightTitle}>Peak Performance</div>
                        <div className={styles.insightText}>Yesterday achieved your highest daily revenue in 3 months. Analyze what drove this success.</div>
                        <div className={styles.insightActions}>
                          <button className={styles.insightCta}>View Analysis</button>
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.insightItem}>
                      <div className={styles.insightIcon}>
                        <i className="ph ph-credit-card"></i>
                      </div>
                      <div className={styles.insightContent}>
                        <div className={styles.insightTitle}>Payment Insights</div>
                        <div className={styles.insightText}>PayPal transactions have 12% higher average order value. Promote this payment option more prominently.</div>
                        <div className={styles.insightActions}>
                          <button className={styles.insightCta}>Update Settings</button>
                        </div>
              </div>
            </div>

                    <div className={styles.insightItem}>
                      <div className={styles.insightIcon}>
                        <i className="ph ph-calendar-check"></i>
                      </div>
                      <div className={styles.insightContent}>
                        <div className={styles.insightTitle}>Seasonal Trend</div>
                        <div className={styles.insightText}>Based on historical data, expect 35% revenue increase in the next 4 weeks. Prepare inventory accordingly.</div>
                        <div className={styles.insightActions}>
                          <button className={styles.insightCta}>Plan Inventory</button>
                        </div>
                      </div>
            </div>

                    <div className={styles.insightItem}>
                      <div className={styles.insightIcon}>
                        <i className="ph ph-rocket-launch"></i>
                      </div>
                      <div className={styles.insightContent}>
                        <div className={styles.insightTitle}>Growth Opportunity</div>
                        <div className={styles.insightText}>New customer acquisition cost decreased 18%. Now is an optimal time to increase marketing spend.</div>
                        <div className={styles.insightActions}>
                          <button className={styles.insightCta}>Increase Spend</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
} 