import db from '../lib/db';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useState } from 'react';

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

  const rows = db.prepare('SELECT username FROM users').all();
  const users = rows.map((r) => r.username);
  return {
    props: { users },
  };
}

export default function Admin({ users }) {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar username="admin" isAdmin={true} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Header />
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <div className="container" style={{ paddingTop: '24px' }}>
            <div style={{ gridColumn: 'span 12' }}>
              <h1>Admin Panel</h1>
              <h2>User List</h2>
              <ul>
                {users.map((u) => (
                  <li key={u}>{u}</li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 