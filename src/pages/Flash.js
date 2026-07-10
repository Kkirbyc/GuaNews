import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE } from '../config/api';
import { useLanguage } from '../context/LanguageContext';
import { useLibrary } from '../context/LibraryContext';
import { HeartIcon, ShareIcon } from '../components/Icons';
import { shareArticle } from './Home';
import './Flash.css';

const filters = ['All', '🌍 Politics', '💹 Finance', '💻 Tech', '🔬 Science', '🌿 Climate'];
const filterMap = {
  '🌍 Politics': 'politics', '💹 Finance': 'business', '💻 Tech': 'technology',
  '🔬 Science': 'science', '🌿 Climate': 'science',
};

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000 / 60);
  if (diff < 1) return 'just now';
  if (diff < 60) return `${diff} min ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)} days ago`;
}

function FlashActions({ article }) {
  const { isSaved, toggleSave } = useLibrary();
  const saved = isSaved(article.url);
  const stop = (fn) => (e) => { e.preventDefault(); e.stopPropagation(); fn(); };
  return (
    <div className="flash-actions">
      <button
        className={`flash-act ${saved ? 'is-saved' : ''}`}
        onClick={stop(() => toggleSave(article))}
        aria-label={saved ? 'Remove from saved' : 'Save article'}
        aria-pressed={saved}
      >
        <HeartIcon size={16} filled={saved} />
      </button>
      <button className="flash-act" onClick={stop(() => shareArticle(article))} aria-label="Share article">
        <ShareIcon size={15} />
      </button>
    </div>
  );
}

function Flash() {
  const { lang } = useLanguage();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [notifications, setNotifications] = useState({
    Politics: true, Finance: true, Tech: false, Science: false, Climate: true
  });

  useEffect(() => {
    let isActive = true;

    const fetchFlash = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ pageSize: '20', language: lang });
        const apiCategory = filterMap[activeFilter];
        if (apiCategory) params.set('category', apiCategory);
        const res = await fetch(`${API_BASE}/news?${params}`);
        const data = await res.json();
        if (isActive) {
          setArticles(data.articles || []);
        }
      } catch (err) {
        console.error('Failed to fetch flash news:', err);
      }
      if (isActive) {
        setLoading(false);
      }
    };
    fetchFlash();

    return () => {
      isActive = false;
    };
  }, [lang, activeFilter]);

  const toggleNotif = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const displayed = articles.slice(0, 12);

  return (
    <div className="flash-page fade-up">
      <div className="flash-layout">

        <div className="flash-main">

          <div className="flash-header">
            <div className="flash-title-row">
              <div className="flash-live-badge">
                <div className="live-dot" />
                Live
              </div>
              <div className="flash-page-title">Flash</div>
            </div>
            <div className="flash-filters">
              {filters.map(f => (
                <button
                  key={f}
                  className={`filter-pill ${activeFilter === f ? 'active' : ''}`}
                  onClick={() => setActiveFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '40px 0', color: 'var(--ink-faint)' }}>
              <div className="live-dot" style={{ background: 'var(--green-muted)', width: 8, height: 8 }} />
              Loading latest updates...
            </div>
          ) : displayed.length === 0 ? (
            <div className="flash-empty">No updates in this category right now.</div>
          ) : (
            <div className="flash-feed">
              <div className="time-label">
                <span className="time-text">Latest</span>
                <div className="time-line" />
              </div>

              {displayed.map((item, i) => (
                <Link
                  key={i}
                  to={`/article/${i}`}
                  state={{ article: item }}
                  className={`flash-item ${i < 2 ? 'is-new' : ''}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div className="flash-timeline">
                    <div className={`timeline-dot ${i === 0 ? 'breaking' : i < 2 ? 'new' : ''}`} />
                    <div className="timeline-line" />
                  </div>
                  <div className="flash-content">
                    <div className="flash-item-top">
                      <span className="flash-cat">News</span>
                      {i === 0 && <span className="breaking-tag">Latest</span>}
                      <span className="flash-time">{timeAgo(item.publishedAt)}</span>
                    </div>
                    <div className="flash-item-title">{item.title}</div>
                    <div className="flash-item-summary">{item.description}</div>
                    <div className="flash-item-footer">
                      <div className="flash-source">{item.source}</div>
                      <FlashActions article={item} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>

        <aside className="flash-sidebar">

          <div className="sidebar-card">
            <div className="sidebar-title">Live Stats</div>
            <div className="stat-row"><span className="stat-label">Stories loaded</span><span className="stat-value green">{articles.length}</span></div>
            <div className="stat-row"><span className="stat-label">Last update</span><span className="stat-value">just now</span></div>
            <div className="stat-row"><span className="stat-label">Source</span><span className="stat-value">NewsAPI</span></div>
          </div>

          <div className="sidebar-card">
            <div className="sidebar-title">Notify Me</div>
            {Object.entries(notifications).map(([key, val]) => (
              <div key={key} className="notify-item">
                <span className="notify-name">{key}</span>
                <button
                  className={`notify-toggle ${val ? '' : 'off'}`}
                  onClick={() => toggleNotif(key)}
                  aria-label={`Toggle ${key} notifications`}
                  aria-pressed={val}
                />
              </div>
            ))}
          </div>

          <div className="sidebar-card">
            <div className="sidebar-title">Most Recent</div>
            {articles.slice(0, 3).map((item, i) => (
              <Link key={i} to={`/article/${i}`} state={{ article: item }} className="most-read-item" style={{ textDecoration: 'none' }}>
                <span className="most-read-num">0{i + 1}</span>
                <div>
                  <div className="most-read-title">{item.title}</div>
                  <div className="most-read-meta">{item.source} · {timeAgo(item.publishedAt)}</div>
                </div>
              </Link>
            ))}
          </div>

        </aside>

      </div>
    </div>
  );
}

export default Flash;
