import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import TotalBalanceSection from '../components/TotalBalanceSection';
import TopCardsWrapper from '../components/TopCardsWrapper';
import RecentActivityTableHome3 from '../components/RecentActivityTableHome3';
import ChatPromptBox from '../components/ChatPromptBox';
import QuestionPills from '../components/QuestionPills';
import FullScreenChat from '../components/FullScreenChat';
import Footer from '../components/Footer';
import styles from '../styles/Main.module.css';
import Head from 'next/head';
import AnalyticsWrapperHome3 from '../components/AnalyticsWrapperHome3';
import SinceLoginCard from '../components/SinceLoginCard';
import BusinessGlanceCard from '../components/BusinessGlanceCard';

export default function Home3() {
  const router = useRouter();
  const { user } = router.query;
  const [cookieUser, setCookieUser] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isChatActive, setIsChatActive] = useState(false);
  const [initialChatMessage, setInitialChatMessage] = useState('');

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

  // Prevent body scroll when chat is active
  useEffect(() => {
    if (isChatActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isChatActive]);

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

  const handleChatActivate = (message) => {
    setInitialChatMessage(message);
    setIsChatActive(true);
  };

  const handleChatClose = () => {
    setIsChatActive(false);
    setInitialChatMessage('');
  };

  return (
    <div style={{ height: '100vh' }}>
      <Head>
        <title>PayPal | Home3</title>
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
        height: isChatActive ? 'auto' : '100vh', 
        marginLeft: isMobile ? '0' : (collapsed ? '0' : '250px'),
        transition: 'margin-left 0.3s ease',
        width: isMobile ? '100%' : 'auto'
      }}>
        <Header toggleSidebar={toggleSidebar} />
        {!isChatActive ? (
          <main style={{ 
            flex: 1, 
            overflowY: 'auto',
            position: 'relative'
          }}>
            <ChatPromptBox onChatActivate={handleChatActivate} />
            <QuestionPills onQuestionClick={handleChatActivate} />
            <div className={styles.container}>
              <TotalBalanceSection />
              <TopCardsWrapper />
              <RecentActivityTableHome3 />
            </div>
            <Footer />
          </main>
        ) : (
          <FullScreenChat 
            isActive={isChatActive}
            onClose={handleChatClose}
            initialMessage={initialChatMessage}
          />
        )}
      </div>
    </div>
  );
} 