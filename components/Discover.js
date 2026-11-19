'use client';
import { useCallback, useEffect, useState } from 'react';
import Card from './Card';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Discover() {
  const [view, setView] = useState('swipe'); // 'swipe' | 'matches'
  const [feed, setFeed] = useState(null);    // null = still loading
  const [matches, setMatches] = useState([]);
  const [leaving, setLeaving] = useState(null);
  const [justMatched, setJustMatched] = useState(null);
  const [error, setError] = useState('');
  const [someoneLikesYou, setSomeoneLikesYou] = useState(false);

  const current = feed?.[0];

  const loadMatches = useCallback(async () => {
    const res = await fetch('/api/matches');
    setMatches((await res.json()).matches);
  }, []);

  const loadFeed = useCallback(() => {
    return fetch('/api/feed').then((r) => r.json()).then((d) => setFeed(d.profiles))
      .catch(() => setError('Could not load profiles. Is the server running?'));
  }, []);

  useEffect(() => {
    loadFeed();
    loadMatches();
    fetch('/api/hint').then((r) => r.json()).then((d) => setSomeoneLikesYou(d.someoneLikesYou)).catch(() => {});
  }, [loadFeed, loadMatches]);

  async function resetDemo() {
    setError('');
    await fetch('/api/reset', { method: 'POST' });
    setJustMatched(null);
    setView('swipe');
    await Promise.all([loadFeed(), loadMatches()]);
  }

  const swipe = useCallback(async (action) => {
    if (!current || leaving) return;
    setError('');
    setLeaving(action);
    await sleep(250);
    try {
      const res = await fetch('/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId: current.id, action }),
      });
      if (!res.ok && res.status !== 409) throw new Error();
      const data = await res.json();
      setFeed((f) => f.slice(1));
      if (data.match) {
        setJustMatched(current);
        loadMatches();
      }
    } catch {
      setError('Swipe failed. Try again.');
    }
    setLeaving(null);
  }, [current, leaving, loadMatches]);

  useEffect(() => {
    const onKey = (e) => {
      if (justMatched || view !== 'swipe') return;
      if (e.key === 'ArrowRight') swipe('like');
      if (e.key === 'ArrowLeft') swipe('pass');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [swipe, justMatched, view]);

  return (
    <section className="discover">
      <header className="top">
        <h1 className="logo">coy<span>.</span></h1>
        <div className="seg">
          <button className={view === 'swipe' ? 'on' : ''} onClick={() => setView('swipe')}>Swipe</button>
          <button className={view === 'matches' ? 'on' : ''} onClick={() => setView('matches')}>
            Matches{matches.length ? ` (${matches.length})` : ''}
          </button>
        </div>
      </header>

      {view === 'swipe' && (
        <>
          {someoneLikesYou && (
            <p className="hint">Someone likes you. Keep swiping to find out who.</p>
          )}
          <div className="deck">
            {feed === null && !error && <p className="empty">Loading…</p>}
            {feed && !current && (
              <div className="empty">
                <h2>You have seen everyone for now</h2>
                <p>Check your matches, or come back later for new profiles.</p>
                <button className="btn" onClick={() => setView('matches')}>View matches</button>
                <button className="btn ghost" onClick={resetDemo}>Reset demo</button>
              </div>
            )}
            {current && (
              <Card key={current.id} profile={current} leaving={leaving} onSwipe={swipe} />
            )}
          </div>
          {error && <p className="error" role="alert">{error}</p>}
          {current && (
            <div className="actions">
              <button className="round pass" onClick={() => swipe('pass')} aria-label="Pass">✕</button>
              <button className="round like" onClick={() => swipe('like')} aria-label="Like">♥</button>
            </div>
          )}
        </>
      )}

      {view === 'matches' && (
        <div className="matches">
          {matches.length === 0 ? (
            <div className="empty">
              <h2>No matches yet</h2>
              <p>When you and someone both like each other, they show up here.</p>
            </div>
          ) : (
            <ul>
              {matches.map((m) => (
                <li key={m.id}>
                  <img src={m.photo} alt="" />
                  <div>
                    <strong>{m.name}, {m.age}</strong>
                    <span>{m.place}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <button className="link" onClick={resetDemo}>Reset demo data</button>
        </div>
      )}

      {justMatched && (
        <div className="overlay" role="dialog" aria-label="It's a match">
          <h2>It&apos;s a match!</h2>
          <p>You and {justMatched.name} liked each other.</p>
          <img src={justMatched.photo} alt={justMatched.name} />
          <button className="btn" onClick={() => setJustMatched(null)}>Keep swiping</button>
          <button className="btn ghost" onClick={() => { setJustMatched(null); setView('matches'); }}>
            See matches
          </button>
        </div>
      )}
    </section>
  );
}