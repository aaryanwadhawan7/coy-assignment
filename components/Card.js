'use client';
import { useRef, useState } from 'react';

const THRESHOLD = 100; // px you must drag before it counts as a swipe

export default function Card({ profile, leaving, onSwipe }) {
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);

  function down(e) {
    if (leaving) return;
    startX.current = e.clientX;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId); // keep receiving events even if finger leaves the card
  }
  function move(e) {
    if (dragging) setDx(e.clientX - startX.current);
  }
  function up() {
    if (!dragging) return;
    setDragging(false);
    if (dx > THRESHOLD) onSwipe('like');
    else if (dx < -THRESHOLD) onSwipe('pass');
    else setDx(0); // not far enough: snap back
  }

  // While leaving (button or finished drag) the card flies off-screen.
  const x = leaving === 'like' ? 600 : leaving === 'pass' ? -600 : dx;
  const style = {
    transform: `translateX(${x}px) rotate(${x / 18}deg)`,
    transition: dragging ? 'none' : 'transform 0.25s ease-out',
  };
  const likeOpacity = Math.min(Math.max(x / THRESHOLD, 0), 1);
  const passOpacity = Math.min(Math.max(-x / THRESHOLD, 0), 1);

  return (
    <article
      className="card"
      style={style}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
    >
      <img
        src={profile.photo}
        alt={`${profile.name}`}
        draggable={false}
        onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
      />
      <span className="stamp like" style={{ opacity: likeOpacity }}>Like</span>
      <span className="stamp pass" style={{ opacity: passOpacity }}>Pass</span>
      <div className="info">
        <h2>{profile.name}, {profile.age}</h2>
        <p className="place">{profile.place}</p>
        <p className="bio">{profile.bio}</p>
        <ul className="tags">
          {profile.interests.map((i) => <li key={i}>{i}</li>)}
        </ul>
      </div>
    </article>
  );
}
