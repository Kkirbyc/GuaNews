import React, { useState } from 'react';
import './Explore.css';

const API_BASE = 'https://guanews-backend.onrender.com';

const topics = [
  { name: 'Politics', count: null, icon: '🌍', api: 'politics' },
  { name: 'Finance', count: null, icon: '💹', api: 'business' },
  { name: 'Science', count: null, icon: '🔬', api: 'science' },
  { name: 'Tech', count: null, icon: '💻', api: 'technology' },
  { name: 'Sports', count: null, icon: '⚽', api: 'sports' },
  { name: 'Climate', count: null, icon: '🌿', api: 'science' },
  { name: 'Culture', count: null, icon: '🎭', api: 'entertainment' },
  { name: 'Health', count: null, icon: '❤️', api: 'health' },
];

const regions = [
  { name: 'East Asia', flag: '🌏', count: 89 },
  { name: 'Europe', flag: '🌍', count: 124 },
  { name: 'North America', flag: '🌎', count: 98 },
  { name: 'South Asia', flag: '🌏', count: 67 },
  { name: 'Middle East', flag: '🌍', count: 54 },
  { name: 'Latin America', flag: '🌎', count: 43 },
  { name: 'Africa', flag: '🌍', count: 38 },
  { name: 'Oceania', flag: '🌏', count: 22 },
  { name: 'Global', flag: '🌐', count: 156 },
];

const languages = [
  { flag: '🇬🇧', name: 'English', count: 248 },
  { flag: '🇨🇳', name: '中文', count: 186 },
  { flag: '🇪🇸', name: 'Español', count: 142 },
  { flag: '🇫🇷', name: 'Français', count: 118 },
  { flag: '🇯🇵', name: '日本語', count: 96 },
  { flag: '🇩🇪', name: 'Deutsch', count: 88 },
  { flag: '🇰🇷', name: '한국어', count: 74 },
  { flag: '🇵🇹', name: 'Português', count: 68 },
  { flag: '🇸🇦', name: 'العربية', count: 61 },
  { flag: '➕', name: 'More', count: null },
];

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000 / 60);
  if (diff < 60) return `${diff} min ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)} days ago`;
}

function Explore() {
  const [activeTopic, setActiveTopic] = useState(null);
  const [activeRegion, setActiveRegion] = useState('East Asia');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [topicResults, setTopicResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [loadingTopic, setLoadingTopic] = useState(false);

  const handleSearch = async (e) => {
    if (e.key !== 'Enter' || !searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`${API_BASE}/news/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setSearchResults(data.articles || []);
    } catch (err) {
      console.error('Search failed:', err);
    }
    setSearching(false);
  };

  const handleTopicClick = async (topic) => {
    setActiveTopic(topic.name);
    setLoadingTopic(true);
    setSearchResults([]);
    try {
      const res = await fetch(`${API_BASE}/news?category=${topic.api}`);
      const data = await res.json();
      setTopicResults(data.articles || []);
    } catch (err) {
      console.error('Topic fetch failed:', err);
    }
    setLoadingTopic(false);
  };

  const displayResults = searchResults.length > 0 ? searchResults : topicResults;
  const showResults = displayResults.length > 0;

  return (
    <div className="explore fade-up">
      <div className="explore-main">

        <div className="page-header">
          <h1 className="page-title">Explore the World</h1>
          <p className="page-subtitle">Browse by topic, region, or language — find what matters to you.</p>
        </div>

        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            type="text"
            placeholder="Search topics, countries, events... (press Enter)"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
          {searching && <div className="loading-spinner" style={{ width: 16, height: 16, border: '2px solid #ccc', borderTopColor: 'var(--green-muted)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />}
        </div>

        {/* SEARCH / TOPIC RESULTS */}
        {showResults && (
          <>
            <div className="section-label" style={{ marginBottom: 16 }}>
              {searchResults.length > 0 ? `Search results for "${searchQuery}"` : `${activeTopic} stories`}
            </div>
            <div className="search-results">
              {displayResults.map((article, i) => (
                <a key={i} href={article.url} target="_blank" rel="noreferrer" className="result-item">
                  <div className="result-title">{article.title}</div>
                  <div className="result-desc">{article.description}</div>
                  <div className="result-meta">{article.source} · {timeAgo(article.publishedAt)}</div>
                </a>
              ))}
            </div>
            <div style={{ height: 32 }} />
          </>
        )}

        {loadingTopic && (
          <div style={{ padding: '20px 0', color: 'var(--ink-faint)', fontSize: 14 }}>Loading {activeTopic} stories...</div>
        )}

        {/* TOPICS */}
        <div className="section-label">Browse by Topic</div>
        <div className="topic-grid">
          {topics.map(t => (
            <div
              key={t.name}
              className={`topic-card ${activeTopic === t.name ? 'active' : ''}`}
              onClick={() => handleTopicClick(t)}
            >
              <div className="topic-icon">{t.icon}</div>
              <div className="topic-name">{t.name}</div>
              <div className="topic-count">Tap to explore</div>
            </div>
          ))}
        </div>

        {/* REGIONS */}
        <div className="regions-layout">
          <div className="map-container">
            <div className="map-header">
              <div className="map-title">Browse by Region</div>
              <div className="map-sub">Click a region to explore</div>
            </div>
            <div className="regions-grid">
              {regions.map(r => (
                <div
                  key={r.name}
                  className={`region-btn ${activeRegion === r.name ? 'active' : ''}`}
                  onClick={() => setActiveRegion(r.name)}
                >
                  <span className="region-flag">{r.flag}</span>
                  <div className="region-info">
                    <div className="region-name">{r.name}</div>
                    <div className="region-stories">{r.count} stories</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="countries-card">
            <div className="section-label" style={{ marginBottom: '16px' }}>Languages</div>
            {languages.slice(0, 6).map(l => (
              <div key={l.name} className="country-item">
                <span className="country-flag">{l.flag}</span>
                <div className="country-info">
                  <div className="country-name">{l.name}</div>
                  <div className="country-stories">{l.count ? `${l.count} stories` : '40+ languages'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LANGUAGES */}
        <div className="section-label">Browse by Language</div>
        <div className="language-grid">
          {languages.map(l => (
            <div key={l.name} className="lang-card">
              <span className="lang-emoji">{l.flag}</span>
              <div className="lang-name">{l.name}</div>
              <div className="lang-stories">{l.count ? `${l.count} stories` : '40+'}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Explore;