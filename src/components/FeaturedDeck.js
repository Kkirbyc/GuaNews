import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from './Icons';
import Blob3D from './Blob3D';
import './FeaturedDeck.css';

/* Per-slide accent — the whole left panel, 3D blob and glow recolor as it
   cycles, mirroring the reference's theme shifts. Free vibrant palette. */
const TINTS = ['#7C5CFF', '#FF6B6B', '#2DD4BF', '#F59E0B', '#F472B6'];
const ADVANCE_MS = 5200;

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 60000);
  if (diff < 1) return 'just now';
  if (diff < 60) return `${diff} min ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)}d ago`;
}

function FeaturedDeck({ articles }) {
  const slides = (articles || []).slice(0, 5);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setActive(a => (a + 1) % slides.length), [slides.length]);

  useEffect(() => { setActive(0); }, [slides.length]);

  useEffect(() => {
    if (paused || slides.length < 2) return undefined;
    const t = setInterval(next, ADVANCE_MS);
    return () => clearInterval(t);
  }, [paused, next, slides.length]);

  if (slides.length === 0) return null;

  const cur = slides[active];
  const tint = TINTS[active % TINTS.length];

  return (
    <section
      className="deck"
      style={{ '--tint': tint }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* LEFT — themed hero */}
      <div className="deck-left">
        <div className="deck-left-inner">
          <div className="deck-kicker">
            Top Story <span className="deck-counter">{String(active + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span>
          </div>

          <div className="deck-stage">
            <div className="deck-halo" aria-hidden="true" />
            <Blob3D tint={tint} />
          </div>

          <h2 className="deck-title" key={active}>{cur.title}</h2>

          <div className="deck-foot">
            <div className="deck-meta">
              <span className="deck-src">{cur.source}</span>
              <span className="deck-dot">·</span>
              <span>{timeAgo(cur.publishedAt)}</span>
            </div>
            <Link to={`/article/deck-${active}`} state={{ article: cur }} className="deck-cta">
              Read <ArrowRightIcon size={15} />
            </Link>
          </div>

          <div className="deck-dots">
            {slides.map((_, i) => (
              <button
                key={i}
                className={`deck-dot-btn ${i === active ? 'on' : ''}`}
                onClick={() => setActive(i)}
                aria-label={`Show story ${i + 1}`}
                aria-current={i === active}
              />
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — synced list */}
      <div className="deck-right">
        <div className="deck-listhead">
          <span>Story</span>
          <span>Source</span>
        </div>
        <div className="deck-list">
          {slides.map((s, i) => (
            <button
              key={i}
              className={`deck-row ${i === active ? 'active' : ''}`}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
            >
              <span className="deck-rank">{String(i + 1).padStart(2, '0')}</span>
              <span
                className="deck-thumb"
                style={s.urlToImage ? { backgroundImage: `url(${s.urlToImage})` } : undefined}
              />
              <span className="deck-row-main">
                <span className="deck-row-title">{s.title}</span>
                <span className="deck-row-src">{s.source}</span>
              </span>
              <span className="deck-row-mark" aria-hidden="true">→</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedDeck;
