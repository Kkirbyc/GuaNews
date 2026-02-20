import React, { useState, useEffect } from 'react';
import './Flash.css';

const API_BASE = 'http://127.0.0.1:8000';

const filters = ['All', '🌍 Politics', '💹 Finance', '💻 Tech', '🔬 Science', '🌿 Climate'];

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000 / 60);
  if (diff < 1) return 'just now';
  if (diff < 60) return `${diff} min ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)} days ago`;
}

function Flash() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [notifications, setNotifications] = useState({
    Politics: true, Finance: true, Tech: false, Science: false, Climate: true
  });

  useEffect(() => {
    const fetchFlash = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/news?pageSize=20`);
        const data = await res.json();
        setArticles(data.articles || []);
      } catch (err) {
        console.error('Failed to fetch flash news:', err);
      }
      setLoading(false);
    };
    fetchFlash();
  }, []);

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
          ) : (
            <div className="flash-feed">
              <div className="time-label">
                <span className="time-text">Latest</span>
                <div className="time-line" />
              </div>

              {displayed.map((item, i) => (
                <a
                  key={i}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
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
                      <div className="flash-actions">
                        <button className="flash-act" onClick={e => e.preventDefault()}>♡</button>
                        <button className="flash-act" onClick={e => e.preventDefault()}>＋</button>
                        <button className="flash-act" onClick={e => e.preventDefault()}>↗</button>
                      </div>
                    </div>
                  </div>
                </a>
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
                <span style={{ fontSize: '16px' }}>
                  {key === 'Politics' ? '🌍' : key === 'Finance' ? '💹' : key === 'Tech' ? '💻' : key === 'Science' ? '🔬' : '🌿'}
                </span>
                <span className="notify-name">{key}</span>
                <div className={`notify-toggle ${val ? '' : 'off'}`} onClick={() => toggleNotif(key)} />
              </div>
            ))}
          </div>

          <div className="sidebar-card">
            <div className="sidebar-title">Most Recent</div>
            {articles.slice(0, 3).map((item, i) => (
              <a key={i} href={item.url} target="_blank" rel="noreferrer" className="most-read-item" style={{ textDecoration: 'none' }}>
                <span className="most-read-num">0{i + 1}</span>
                <div>
                  <div className="most-read-title">{item.title}</div>
                  <div className="most-read-meta">{item.source} · {timeAgo(item.publishedAt)}</div>
                </div>
              </a>
            ))}
          </div>

        </aside>

      </div>
    </div>
  );
}

export default Flash;