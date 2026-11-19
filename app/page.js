'use client';
import { useState } from 'react';
import Discover from '../components/Discover';

export default function App() {
  const [tab, setTab] = useState('discover');

  return (
    <div className="shell">
      <main className="screen">
        {tab === 'home' ? null /* Home stays blank, as the assignment asks */ : <Discover />}
      </main>
      <nav className="tabbar">
        {tab === 'home' ? <div className="home">Home placeholder</div> : <Discover />}
        <button className={tab === 'discover' ? 'on' : ''} onClick={() => setTab('discover')}>Discover</button>
      </nav>
    </div>
  );
}
