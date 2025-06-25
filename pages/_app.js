import '../styles/globals.css';
import '../styles/Main.module.css';
import Footer from '../components/Footer';
import { useRouter } from 'next/router';

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const showFooter = router.pathname === '/login';

  return (
    <>
      <Component {...pageProps} />
      {showFooter && <Footer />}
    </>
  );
} 