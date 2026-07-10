import React from 'react';
import { Link } from 'react-router-dom';
import {
  PoliticsIcon, FinanceIcon, ScienceIcon, TechIcon,
  SportsIcon, ClimateIcon, CultureIcon, HealthIcon,
} from './Icons';
import './TrendingRail.css';

const cats = [
  { name: 'Politics', Icon: PoliticsIcon, tint: '#5FE39B' },
  { name: 'Finance', Icon: FinanceIcon, tint: '#E7CE92' },
  { name: 'Science', Icon: ScienceIcon, tint: '#5ED6E3' },
  { name: 'Tech', Icon: TechIcon, tint: '#9B8CFF' },
  { name: 'Sports', Icon: SportsIcon, tint: '#FF9F5E' },
  { name: 'Climate', Icon: ClimateIcon, tint: '#4FE0A6' },
  { name: 'Culture', Icon: CultureIcon, tint: '#FF7EC8' },
  { name: 'Health', Icon: HealthIcon, tint: '#FF6B7A' },
];

function TrendingRail({ articles }) {
  const hot = (articles || []).slice(0, 10);
  if (hot.length === 0) return null;

  // Duplicate each track so the -50% translate loops seamlessly.
  const catLoop = [...cats, ...cats];
  const newsLoop = [...hot, ...hot];

  return (
    <section className="trend">
      <div className="trend-head">
        <div className="trend-title"><span className="live-pip" /> Trending Now</div>
        <div className="trend-hint">hover to pause</div>
      </div>

      {/* Category chips — scroll left */}
      <div className="marquee">
        <div className="marquee-track cat-track">
          {catLoop.map((c, i) => (
            <span className="trend-chip" style={{ '--tint': c.tint }} key={`c${i}`} aria-hidden={i >= cats.length}>
              <c.Icon size={15} />
              {c.name}
            </span>
          ))}
        </div>
      </div>

      {/* Hot news cards — scroll right (reverse) */}
      <div className="marquee">
        <div className="marquee-track news-track">
          {newsLoop.map((a, i) => {
            const rank = (i % hot.length) + 1;
            return (
              <Link
                to={`/article/hot-${i % hot.length}`}
                state={{ article: a }}
                className="trend-card"
                key={`n${i}`}
                aria-hidden={i >= hot.length}
                tabIndex={i >= hot.length ? -1 : 0}
              >
                <span className="trend-rank">{String(rank).padStart(2, '0')}</span>
                <div className="trend-card-body">
                  <div className="trend-card-src">{a.source}</div>
                  <div className="trend-card-title">{a.title}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default TrendingRail;
