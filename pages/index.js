import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import BalanceCard from '../components/BalanceCard';
import QuickCard from '../components/QuickCard';
import QuickAccessWrapper from '../components/QuickAccessWrapper';
import AnalyticsWrapper from '../components/AnalyticsWrapper';
import PromoBanner from '../components/PromoBanner';
import RecentActivityTable from '../components/RecentActivityTable';
import ScrollableSection from '../components/ScrollableSection';
import Footer from '../components/Footer';
import styles from '../styles/Main.module.css';

export default function Home() {
  const router = useRouter();
  const { user } = router.query;
  const [cookieUser, setCookieUser] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      // Auto-collapse on mobile
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

  const displayUser = user || cookieUser;

  if (!displayUser) {
    return null;
  }

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const closeSidebar = () => {
    setCollapsed(true);
  };

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
          <div className={styles.container}>
            <BalanceCard />
            <ScrollableSection itemWidth={290}>
              <QuickCard icon="tray" title="Review 2 disputes" desc="Responding quickly helps you and your customers." />
              <QuickCard icon="truck" title="Ship 2 new order" desc="Print labels and schedule pick up for your new orders." />
              <QuickCard icon="user" title="Review 5 inquiries" desc="5 customers inquired about custom orders for Christmas." />
              <QuickCard icon="hand-coins" title="Finalize your loan application" desc="Finish the last few steps now to get as fast, flexible loan." />
            </ScrollableSection>
            <QuickAccessWrapper />
            <AnalyticsWrapper />
            <PromoBanner />
            <RecentActivityTable />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
} 