import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Login.module.css';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const router = useRouter();

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please fill username and password');
      triggerShake();
      return;
    }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        if (username === 'admin') {
          router.push('/admin');
        } else {
          router.push('/');
        }
      } else {
        setError('Invalid credentials');
        triggerShake();
      }
    } catch (err) {
      setError('Something went wrong');
      triggerShake();
    }
  };

  return (
    <main className={styles.container}>
      <form onSubmit={handleSubmit} className={`${styles.card} ${shake ? styles.shake : ''}`}>
        <img
          src="https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-wordmark-color.svg"
          alt="PayPal"
          className={styles.logo}
        />

        <Input
          id="username"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <Input
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <div className={styles.errorBanner}>
            <span className={styles.errorIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.25C12.4045 2.25 12.8022 2.35568 13.1533 2.55664C13.5044 2.7576 13.7971 3.04672 14.002 3.39551L22.2002 17.6338C22.3969 17.9713 22.5003 18.3554 22.5 18.7461C22.4996 19.1367 22.3956 19.5203 22.1982 19.8574C21.9962 20.208 21.7039 20.4984 21.3525 20.6992C21.0012 20.8999 20.6028 21.0039 20.1982 21H3.80176C3.39674 21.0042 2.99725 20.901 2.64551 20.7002C2.29387 20.4994 2.00201 20.2083 1.7998 19.8574C1.60268 19.52 1.49902 19.1359 1.49902 18.7451C1.49907 18.3546 1.60284 17.971 1.7998 17.6338L9.99805 3.39551C10.2029 3.04674 10.4957 2.7576 10.8467 2.55664C11.1978 2.35568 11.5955 2.25001 12 2.25ZM12.002 3.74707C11.8604 3.74707 11.7209 3.78381 11.5977 3.85352C11.4747 3.92318 11.3717 4.02338 11.2988 4.14453L3.10059 18.3828C3.03593 18.4923 3.00103 18.617 3.00098 18.7441C3.00098 18.8714 3.03585 18.9968 3.10059 19.1064C3.17205 19.2283 3.27431 19.3293 3.39746 19.3984C3.52069 19.4676 3.66046 19.5024 3.80176 19.5H20.1982C20.3395 19.5024 20.4793 19.4676 20.6025 19.3984C20.7257 19.3293 20.8279 19.2283 20.8994 19.1064C20.9647 18.9972 20.9993 18.8724 21 18.7451C21.0007 18.6179 20.9674 18.4927 20.9033 18.3828L12.7051 4.14453C12.6322 4.02339 12.5292 3.92318 12.4062 3.85352C12.2831 3.78382 12.1435 3.74708 12.002 3.74707ZM12 15.75C12.2983 15.75 12.5849 15.8682 12.7959 16.0791C13.0069 16.2901 13.125 16.5767 13.125 16.875C13.125 17.0975 13.0591 17.315 12.9355 17.5C12.812 17.6849 12.6361 17.8289 12.4307 17.9141C12.2251 17.9992 11.9985 18.0219 11.7803 17.9785C11.5621 17.9351 11.3614 17.8282 11.2041 17.6709C11.0468 17.5136 10.9399 17.3129 10.8965 17.0947C10.8531 16.8765 10.8758 16.6499 10.9609 16.4443C11.0461 16.2389 11.1901 16.063 11.375 15.9395C11.56 15.8159 11.7775 15.75 12 15.75ZM12 9C12.1989 9 12.3896 9.0791 12.5303 9.21973C12.6709 9.36036 12.75 9.55111 12.75 9.75V13.5C12.75 13.6989 12.6709 13.8896 12.5303 14.0303C12.3896 14.1709 12.1989 14.25 12 14.25C11.8011 14.25 11.6104 14.1709 11.4697 14.0303C11.3291 13.8896 11.25 13.6989 11.25 13.5V9.75C11.25 9.55111 11.3291 9.36036 11.4697 9.21973C11.6104 9.07909 11.8011 9.00001 12 9Z" fill="#C31526"/>
              </svg>
            </span>
            <span>{error}</span>
          </div>
        )}

        <Button type="submit" variant="primary">Log In</Button>

        <div className={styles.divider}>
          <span>or</span>
        </div>

        <Button type="button" variant="secondary" onClick={()=>router.push('/login')}>Sign Up</Button>
      </form>
    </main>
  );
} 