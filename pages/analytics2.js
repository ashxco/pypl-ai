import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BarChart from '../components/BarChart';
import LineChart from '../components/LineChart';
import styles from '../styles/ModernDashboard.module.css';
import Head from 'next/head';

export default function Analytics() {
  const router = useRouter();
  const { user } = router.query;
  const [cookieUser, setCookieUser] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Dropdown states
  const [timeDropdown, setTimeDropdown] = useState(false);
  
  // Selected values
  const [selectedTime, setSelectedTime] = useState('Last 30 days');
  
  // Visualization toggles
  const [showVisualization, setShowVisualization] = useState(true);
  const [showAovVisualization, setShowAovVisualization] = useState(true);
  const [showConversionVisualization, setShowConversionVisualization] = useState(true);
  const [showAuthVisualization, setShowAuthVisualization] = useState(true);
  const [showDisputeVisualization, setShowDisputeVisualization] = useState(true);
  


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
      setTimeDropdown(false);
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

  // Auth Rate data (percentage) - Payment authorization success rates
  const authData = [
    { date: "Nov 1", overall: 95.4, paypal: 98.5, credit: 94.2, debit: 96.8, bank: 92.1 },
    { date: "Nov 2", overall: 95.1, paypal: 98.2, credit: 93.8, debit: 96.5, bank: 91.7 },
    { date: "Nov 3", overall: 95.8, paypal: 98.8, credit: 94.6, debit: 97.1, bank: 92.5 },
    { date: "Nov 4", overall: 95.5, paypal: 98.6, credit: 94.3, debit: 96.9, bank: 92.2 },
    { date: "Nov 5", overall: 94.8, paypal: 98.1, credit: 93.5, debit: 96.3, bank: 91.4 },
    { date: "Nov 6", overall: 94.6, paypal: 97.9, credit: 93.2, debit: 96.1, bank: 91.1 },
    { date: "Nov 7", overall: 95.2, paypal: 98.3, credit: 93.9, debit: 96.6, bank: 91.8 },
    { date: "Nov 8", overall: 95.6, paypal: 98.7, credit: 94.4, debit: 97.0, bank: 92.3 },
    { date: "Nov 9", overall: 96.3, paypal: 99.1, credit: 95.2, debit: 97.6, bank: 93.1 },
    { date: "Nov 10", overall: 96.4, paypal: 99.2, credit: 95.4, debit: 97.8, bank: 93.3 },
    { date: "Nov 11", overall: 96.8, paypal: 99.4, credit: 95.8, debit: 98.1, bank: 93.7 },
    { date: "Nov 12", overall: 96.0, paypal: 98.9, credit: 94.9, debit: 97.4, bank: 92.8 },
    { date: "Nov 13", overall: 95.5, paypal: 98.6, credit: 94.3, debit: 96.9, bank: 92.2 },
    { date: "Nov 14", overall: 94.7, paypal: 98.0, credit: 93.3, debit: 96.2, bank: 91.2 },
    { date: "Nov 15", overall: 95.3, paypal: 98.5, credit: 94.1, debit: 96.7, bank: 92.0 },
    { date: "Nov 16", overall: 96.2, paypal: 99.0, credit: 95.1, debit: 97.5, bank: 93.0 },
    { date: "Nov 17", overall: 96.6, paypal: 99.3, credit: 95.6, debit: 97.9, bank: 93.5 },
    { date: "Nov 18", overall: 95.8, paypal: 98.8, credit: 94.7, debit: 97.2, bank: 92.6 },
    { date: "Nov 19", overall: 95.7, paypal: 98.7, credit: 94.5, debit: 97.0, bank: 92.4 },
    { date: "Nov 20", overall: 95.3, paypal: 98.4, credit: 94.0, debit: 96.7, bank: 91.9 },
    { date: "Nov 21", overall: 95.0, paypal: 98.2, credit: 93.7, debit: 96.4, bank: 91.6 },
    { date: "Nov 22", overall: 95.4, paypal: 98.6, credit: 94.2, debit: 96.8, bank: 92.1 },
    { date: "Nov 23", overall: 95.9, paypal: 98.9, credit: 94.8, debit: 97.3, bank: 92.7 },
    { date: "Nov 24", overall: 97.0, paypal: 99.5, credit: 96.1, debit: 98.3, bank: 94.0 },
    { date: "Nov 25", overall: 95.6, paypal: 98.7, credit: 94.4, debit: 97.0, bank: 92.3 },
    { date: "Nov 26", overall: 95.2, paypal: 98.3, credit: 93.9, debit: 96.6, bank: 91.8 },
    { date: "Nov 27", overall: 95.4, paypal: 98.5, credit: 94.1, debit: 96.8, bank: 92.0 },
    { date: "Nov 28", overall: 96.1, paypal: 99.0, credit: 95.0, debit: 97.4, bank: 92.9 },
    { date: "Nov 29", overall: 96.4, paypal: 99.2, credit: 95.3, debit: 97.7, bank: 93.2 },
    { date: "Nov 30", overall: 95.8, paypal: 98.8, credit: 94.6, debit: 97.1, bank: 92.5 },
  ];

  // Dispute Rate data (percentage) - Transaction dispute rates
  const disputeData = [
    { date: "Nov 1", overall: 0.45, chargeback: 0.32, claim: 0.13 },
    { date: "Nov 2", overall: 0.52, chargeback: 0.38, claim: 0.14 },
    { date: "Nov 3", overall: 0.38, chargeback: 0.26, claim: 0.12 },
    { date: "Nov 4", overall: 0.41, chargeback: 0.29, claim: 0.12 },
    { date: "Nov 5", overall: 0.58, chargeback: 0.43, claim: 0.15 },
    { date: "Nov 6", overall: 0.61, chargeback: 0.46, claim: 0.15 },
    { date: "Nov 7", overall: 0.47, chargeback: 0.34, claim: 0.13 },
    { date: "Nov 8", overall: 0.42, chargeback: 0.30, claim: 0.12 },
    { date: "Nov 9", overall: 0.33, chargeback: 0.22, claim: 0.11 },
    { date: "Nov 10", overall: 0.31, chargeback: 0.20, claim: 0.11 },
    { date: "Nov 11", overall: 0.28, chargeback: 0.18, claim: 0.10 },
    { date: "Nov 12", overall: 0.39, chargeback: 0.27, claim: 0.12 },
    { date: "Nov 13", overall: 0.44, chargeback: 0.31, claim: 0.13 },
    { date: "Nov 14", overall: 0.56, chargeback: 0.41, claim: 0.15 },
    { date: "Nov 15", overall: 0.48, chargeback: 0.35, claim: 0.13 },
    { date: "Nov 16", overall: 0.35, chargeback: 0.24, claim: 0.11 },
    { date: "Nov 17", overall: 0.29, chargeback: 0.19, claim: 0.10 },
    { date: "Nov 18", overall: 0.43, chargeback: 0.30, claim: 0.13 },
    { date: "Nov 19", overall: 0.40, chargeback: 0.28, claim: 0.12 },
    { date: "Nov 20", overall: 0.46, chargeback: 0.33, claim: 0.13 },
    { date: "Nov 21", overall: 0.53, chargeback: 0.39, claim: 0.14 },
    { date: "Nov 22", overall: 0.49, chargeback: 0.36, claim: 0.13 },
    { date: "Nov 23", overall: 0.37, chargeback: 0.25, claim: 0.12 },
    { date: "Nov 24", overall: 0.26, chargeback: 0.16, claim: 0.10 },
    { date: "Nov 25", overall: 0.44, chargeback: 0.31, claim: 0.13 },
    { date: "Nov 26", overall: 0.50, chargeback: 0.37, claim: 0.13 },
    { date: "Nov 27", overall: 0.45, chargeback: 0.32, claim: 0.13 },
    { date: "Nov 28", overall: 0.36, chargeback: 0.24, claim: 0.12 },
    { date: "Nov 29", overall: 0.32, chargeback: 0.21, claim: 0.11 },
    { date: "Nov 30", overall: 0.38, chargeback: 0.26, claim: 0.12 },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const closeSidebar = () => {
    setCollapsed(true);
  };

  // Close all dropdowns helper function
  const closeAllDropdowns = () => {
    setTimeDropdown(false);
  };

  // Custom toggle functions that close other dropdowns
  const toggleTimeDropdown = () => {
    if (timeDropdown) {
      setTimeDropdown(false);
    } else {
      closeAllDropdowns();
      setTimeDropdown(true);
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
      <Head>
        <title>PayPal | Business Performance</title>
      </Head>
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
              <h1 
                className={styles.clickableTitle}
                onClick={() => router.push('/analytics')}
              >
                Business Performance
              </h1>
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

            {/* Highlights Section - Full Width */}
            <div className={styles.highlightsSection}>
              <div className={styles.highlightsGrid}>
                <div className={styles.highlightItem}>
                  <div className={styles.highlightLeft}>
                    <div className={styles.insightIcon}>
                      <i className="ph ph-lightbulb"></i>
                    </div>
                    <div className={styles.highlightContent}>
                      <div className={styles.insightTitle}>Revenue Opportunity</div>
                      <div className={styles.insightText}>Your conversion rate is 15% higher on weekends. Consider running targeted campaigns on Friday-Sunday.</div>
                    </div>
                  </div>
                  <div className={styles.highlightRight}>
                    <button className={styles.insightCta}>Create Campaign</button>
                  </div>
                </div>
                
                <div className={styles.highlightItem}>
                  <div className={styles.highlightLeft}>
                    <div className={styles.insightIcon}>
                      <i className="ph ph-trend-up"></i>
                    </div>
                    <div className={styles.highlightContent}>
                      <div className={styles.insightTitle}>Trending Product</div>
                      <div className={styles.insightText}>Art Canvas Print sales increased 45% this month. Stock levels may need adjustment to meet demand.</div>
                    </div>
                  </div>
                  <div className={styles.highlightRight}>
                    <button className={styles.insightCta}>Adjust Inventory</button>
                  </div>
                </div>
                
                <div className={styles.highlightItem}>
                  <div className={styles.highlightLeft}>
                    <div className={styles.insightIcon}>
                      <i className="ph ph-warning"></i>
                    </div>
                    <div className={styles.highlightContent}>
                      <div className={styles.insightTitle}>Customer Retention Alert</div>
                      <div className={styles.insightText}>23% of customers haven't returned in 60+ days. Consider launching a re-engagement email campaign.</div>
                    </div>
                  </div>
                  <div className={styles.highlightRight}>
                    <button className={styles.insightCta}>Launch Campaign</button>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.twoColumnLayout}>
              {/* Left Column */}
              <div className={styles.leftColumn}>


                {/* Sales */}
                <div className={styles.dailyStats}>
                  <div className={styles.salesHeader}>
                    <h3>Sales</h3>
                    <div className={styles.salesControls}>
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
                  
                  {/* Legend Header */}
                  <div className={styles.legendHeader}>
                    <div className={styles.legendHeaderLabel}>Channel</div>
                    <div className={styles.legendHeaderChange}>30d Change</div>
                    <div className={styles.legendHeaderValue}>Revenue</div>
                  </div>
                  
                  <div className={styles.statRow}>
                    <div className={styles.statLabel}>
                      {showVisualization && <div className={styles.legendColor} style={{ backgroundColor: '#0066F5' }}></div>}
                      <span style={{ fontWeight: 'bold' }}>Overall</span>
                    </div>
                    <span className={styles.changePositive}>+12.3%</span>
                    <span>${new Intl.NumberFormat('en-US').format(salesData.reduce((sum, item) => sum + item.revenue, 0))}</span>
                  </div>
                  
                  <div className={styles.statRowIndented}>
                    <div className={styles.statLabel}>
                      {showVisualization && <div className={styles.legendColor} style={{ backgroundColor: '#00C853' }}></div>}
                      <span>Shopify</span>
                    </div>
                    <span className={styles.changePositive}>+8.7%</span>
                    <span>$73,575</span>
                  </div>
                  <div className={styles.statRowIndented}>
                    <div className={styles.statLabel}>
                      {showVisualization && <div className={styles.legendColor} style={{ backgroundColor: '#FF6D00' }}></div>}
                      <span>Store A</span>
                    </div>
                    <span className={styles.changePositive}>+15.2%</span>
                    <span>$10,515</span>
                  </div>
                  <div className={styles.statRowIndented}>
                    <div className={styles.statLabel}>
                      {showVisualization && <div className={styles.legendColor} style={{ backgroundColor: '#00BCD4' }}></div>}
                      <span>Invoicing</span>
                    </div>
                    <span className={styles.changeNegative}>-3.1%</span>
                    <span>$10,515</span>
                  </div>
                  <div className={styles.statRowIndented}>
                    <div className={styles.statLabel}>
                      {showVisualization && <div className={styles.legendColor} style={{ backgroundColor: '#9C27B0' }}></div>}
                      <span>Other</span>
                    </div>
                    <span className={styles.changePositive}>+6.8%</span>
                    <span>$10,515</span>
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
                  
                  {/* Legend Header */}
                  <div className={styles.legendHeader}>
                    <div className={styles.legendHeaderLabel}>User Type</div>
                    <div className={styles.legendHeaderChange}>30d Change</div>
                    <div className={styles.legendHeaderValue}>Rate</div>
                  </div>
                  
                  <div className={styles.statRow}>
                    <div className={styles.statLabel}>
                      {showConversionVisualization && <div className={styles.legendColor} style={{ backgroundColor: '#1e40af' }}></div>}
                      <span>PayPal User</span>
                    </div>
                    <span className={styles.changePositive}>+8.9%</span>
                    <span>{(conversionData.reduce((sum, item) => sum + item.paypalUser, 0) / conversionData.length).toFixed(2)}%</span>
                  </div>
                  
                  <div className={styles.statRow}>
                    <div className={styles.statLabel}>
                      {showConversionVisualization && <div className={styles.legendColor} style={{ backgroundColor: '#6366f1' }}></div>}
                      <span>Guest User</span>
                    </div>
                    <span className={styles.changePositive}>+12.4%</span>
                    <span>{(conversionData.reduce((sum, item) => sum + item.guestUser, 0) / conversionData.length).toFixed(2)}%</span>
                  </div>
                </div>

                {/* Dispute Rate */}
                <div className={styles.dailyStats}>
                  <div className={styles.salesHeader}>
                    <h3>Dispute Rate</h3>
                    <div className={styles.salesControls}>
                      <div className={styles.toggleContainer}>
                        <span className={styles.toggleLabel}>Chart</span>
                        <label className={styles.toggleSwitch}>
                          <input 
                            type="checkbox" 
                            checked={showDisputeVisualization}
                            onChange={(e) => setShowDisputeVisualization(e.target.checked)}
                          />
                          <span className={styles.toggleSlider}></span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Dispute Rate Line Chart - with slide animation */}
                  <div className={`${styles.chartContainer} ${!showDisputeVisualization ? styles.hidden : ''}`}>
                    <LineChart
                      data={disputeData}
                      index="date"
                      categories={["overall", "chargeback", "claim"]}
                      colors={["#000000", "#ea580c", "#f97316"]}
                      valueFormatter={(value) => {
                        return `${value.toFixed(2)}%`;
                      }}
                      height={250}
                      showGridLines={true}
                      showTooltip={true}
                      startEndOnly={true}
                    />
                  </div>
                  
                  {/* Legend Header */}
                  <div className={styles.legendHeader}>
                    <div className={styles.legendHeaderLabel}>Dispute Type</div>
                    <div className={styles.legendHeaderChange}>30d Change</div>
                    <div className={styles.legendHeaderValue}>Rate</div>
                  </div>
                  
                  <div className={styles.statRow}>
                    <div className={styles.statLabel}>
                      {showDisputeVisualization && <div className={styles.legendColor} style={{ backgroundColor: '#000000' }}></div>}
                      <span style={{ fontWeight: 'bold' }}>Overall</span>
                    </div>
                    <span className={styles.changePositive}>-8.2%</span>
                    <span>{(disputeData.reduce((sum, item) => sum + item.overall, 0) / disputeData.length).toFixed(2)}%</span>
                  </div>
                  
                  <div className={styles.statRow}>
                    <div className={styles.statLabel}>
                      {showDisputeVisualization && <div className={styles.legendColor} style={{ backgroundColor: '#ea580c' }}></div>}
                      <span>Chargebacks</span>
                    </div>
                    <span className={styles.changePositive}>-9.1%</span>
                    <span>{(disputeData.reduce((sum, item) => sum + item.chargeback, 0) / disputeData.length).toFixed(2)}%</span>
                  </div>
                  
                  <div className={styles.statRow}>
                    <div className={styles.statLabel}>
                      {showDisputeVisualization && <div className={styles.legendColor} style={{ backgroundColor: '#f97316' }}></div>}
                      <span>Claims</span>
                    </div>
                    <span className={styles.changePositive}>-5.7%</span>
                    <span>{(disputeData.reduce((sum, item) => sum + item.claim, 0) / disputeData.length).toFixed(2)}%</span>
                  </div>
                </div>

              </div>

              {/* Right Column */}
              <div className={styles.rightColumn}>

                {/* Average Order Value */}
                <div className={styles.dailyStats}>
                  <div className={styles.salesHeader}>
                    <h3>Average Order Value</h3>
                    <div className={styles.salesControls}>
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
                  
                  {/* Legend Header */}
                  <div className={styles.legendHeader}>
                    <div className={styles.legendHeaderLabel}>Payment Method</div>
                    <div className={styles.legendHeaderChange}>30d Change</div>
                    <div className={styles.legendHeaderValue}>Average</div>
                  </div>
                  
                  <div className={styles.statRow}>
                    <div className={styles.statLabel}>
                      {showAovVisualization && <div className={styles.legendColor} style={{ backgroundColor: '#1e40af' }}></div>}
                      <span>PayPal</span>
                    </div>
                    <span className={styles.changePositive}>+5.4%</span>
                    <span>${(aovData.reduce((sum, item) => sum + item.paypal, 0) / aovData.length).toFixed(2)}</span>
                  </div>
                  
                  <div className={styles.statRow}>
                    <div className={styles.statLabel}>
                      {showAovVisualization && <div className={styles.legendColor} style={{ backgroundColor: '#0066F5' }}></div>}
                      <span>PayPal Credit</span>
                    </div>
                    <span className={styles.changePositive}>+2.1%</span>
                    <span>${(aovData.reduce((sum, item) => sum + item.paypalCredit, 0) / aovData.length).toFixed(2)}</span>
                  </div>
                  
                  <div className={styles.statRow}>
                    <div className={styles.statLabel}>
                      {showAovVisualization && <div className={styles.legendColor} style={{ backgroundColor: '#06b6d4' }}></div>}
                      <span>Credit and Debit Cards</span>
                    </div>
                    <span className={styles.changeNegative}>-1.8%</span>
                    <span>${(aovData.reduce((sum, item) => sum + item.creditDebit, 0) / aovData.length).toFixed(2)}</span>
                  </div>
                </div>

                {/* Auth Rate */}
                <div className={styles.dailyStats}>
                  <div className={styles.salesHeader}>
                    <h3>Auth Rate</h3>
                    <div className={styles.salesControls}>
                      <div className={styles.toggleContainer}>
                        <span className={styles.toggleLabel}>Chart</span>
                        <label className={styles.toggleSwitch}>
                          <input 
                            type="checkbox" 
                            checked={showAuthVisualization}
                            onChange={(e) => setShowAuthVisualization(e.target.checked)}
                          />
                          <span className={styles.toggleSlider}></span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Auth Rate Bar Chart - with slide animation */}
                  <div className={`${styles.chartContainer} ${!showAuthVisualization ? styles.hidden : ''}`}>
                    <BarChart
                      data={authData}
                      index="date"
                      categories={["overall"]}
                      colors={["#1e40af"]}
                      valueFormatter={(value) => {
                        return `${value.toFixed(1)}%`;
                      }}
                      height={250}
                      showGridLines={true}
                      showTooltip={true}
                      startEndOnly={true}
                      yAxisDomain={[90, 100]}
                    />
                  </div>
                  
                  {/* Legend Header */}
                  <div className={styles.legendHeader}>
                    <div className={styles.legendHeaderLabel}>Payment Type</div>
                    <div className={styles.legendHeaderChange}>30d Change</div>
                    <div className={styles.legendHeaderValue}>Success Rate</div>
                  </div>
                  
                  <div className={styles.statRow}>
                    <div className={styles.statLabel}>
                      {showAuthVisualization && <div className={styles.legendColor} style={{ backgroundColor: '#1e40af' }}></div>}
                      <span style={{ fontWeight: 'bold' }}>Overall</span>
                    </div>
                    <span className={styles.changePositive}>+0.7%</span>
                    <span>{(authData.reduce((sum, item) => sum + item.overall, 0) / authData.length).toFixed(1)}%</span>
                  </div>
                  
                  <div className={styles.statRow}>
                    <div className={styles.statLabel}>
                      {showAuthVisualization && <div className={styles.legendColor} style={{ backgroundColor: '#0066F5' }}></div>}
                      <span>PayPal</span>
                    </div>
                    <span className={styles.changePositive}>+0.8%</span>
                    <span>{(authData.reduce((sum, item) => sum + item.paypal, 0) / authData.length).toFixed(1)}%</span>
                  </div>
                  
                  <div className={styles.statRow}>
                    <div className={styles.statLabel}>
                      {showAuthVisualization && <div className={styles.legendColor} style={{ backgroundColor: '#00C853' }}></div>}
                      <span>Credit Cards</span>
                    </div>
                    <span className={styles.changePositive}>+1.2%</span>
                    <span>{(authData.reduce((sum, item) => sum + item.credit, 0) / authData.length).toFixed(1)}%</span>
                  </div>
                  
                  <div className={styles.statRow}>
                    <div className={styles.statLabel}>
                      {showAuthVisualization && <div className={styles.legendColor} style={{ backgroundColor: '#FF6D00' }}></div>}
                      <span>Debit Cards</span>
                    </div>
                    <span className={styles.changePositive}>+0.6%</span>
                    <span>{(authData.reduce((sum, item) => sum + item.debit, 0) / authData.length).toFixed(1)}%</span>
                  </div>
                  
                  <div className={styles.statRow}>
                    <div className={styles.statLabel}>
                      {showAuthVisualization && <div className={styles.legendColor} style={{ backgroundColor: '#9C27B0' }}></div>}
                      <span>Bank Transfer</span>
                    </div>
                    <span className={styles.changeNegative}>-0.3%</span>
                    <span>{(authData.reduce((sum, item) => sum + item.bank, 0) / authData.length).toFixed(1)}%</span>
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