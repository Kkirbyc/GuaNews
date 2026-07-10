import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE } from '../config/api';
import { useTilt } from '../hooks/useTilt';
import {
  SearchIcon, ArrowRightIcon, CompassIcon,
  PoliticsIcon, FinanceIcon, ScienceIcon, TechIcon,
  SportsIcon, ClimateIcon, CultureIcon, HealthIcon,
} from '../components/Icons';
import './Explore.css';

const topics = [
  { name: 'Politics', Icon: PoliticsIcon, api: 'politics', tint: '#5FE39B' },
  { name: 'Finance', Icon: FinanceIcon, api: 'business', tint: '#E7CE92' },
  { name: 'Science', Icon: ScienceIcon, api: 'science', tint: '#5ED6E3' },
  { name: 'Tech', Icon: TechIcon, api: 'technology', tint: '#9B8CFF' },
  { name: 'Sports', Icon: SportsIcon, api: 'sports', tint: '#FF9F5E' },
  { name: 'Climate', Icon: ClimateIcon, api: 'science', tint: '#4FE0A6' },
  { name: 'Culture', Icon: CultureIcon, api: 'entertainment', tint: '#FF7EC8' },
  { name: 'Health', Icon: HealthIcon, api: 'health', tint: '#FF6B7A' },
];

const regions = [
  { name: 'East Asia', count: 89 },
  { name: 'Europe', count: 124 },
  { name: 'North America', count: 98 },
  { name: 'South Asia', count: 67 },
  { name: 'Middle East', count: 54 },
  { name: 'Latin America', count: 43 },
  { name: 'Africa', count: 38 },
  { name: 'Oceania', count: 22 },
  { name: 'Global', count: 156 },
];

const languages = [
  { code: 'EN', name: 'English', count: 248 },
  { code: '中', name: '中文', count: 186 },
  { code: 'ES', name: 'Español', count: 142 },
  { code: 'FR', name: 'Français', count: 118 },
  { code: 'JA', name: '日本語', count: 96 },
  { code: 'DE', name: 'Deutsch', count: 88 },
  { code: 'KO', name: '한국어', count: 74 },
  { code: 'PT', name: 'Português', count: 68 },
  { code: 'AR', name: 'العربية', count: 61 },
  { code: '+', name: '40+ more', count: null },
];

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000 / 60);
  if (diff < 60) return `${diff} min ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)} days ago`;
}

function TopicTile({ topic, active, onClick }) {
  const tilt = useTilt(8);
  const { Icon } = topic;
  return (
    <button
      className={`topic-tile tilt ${active ? 'active' : ''}`}
      style={{ '--tint': topic.tint }}
      onClick={onClick}
      {...tilt}
    >
      <span className="topic-badge"><Icon size={22} /></span>
      <span className="topic-name">{topic.name}</span>
      <span className="topic-cta">Explore <ArrowRightIcon size={13} /></span>
    </button>
  );
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

        <header className="explore-header">
          <div className="explore-kicker">Discover</div>
          <h1 className="explore-title">Explore the <em>World</em></h1>
          <p className="explore-sub">Browse by topic, region, or language — find what matters to you.</p>
        </header>

        <div className="search-bar">
          <SearchIcon size={18} />
          <input
            className="search-input"
            type="text"
            placeholder="Search topics, countries, events…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
          {searching
            ? <div className="mini-spinner" />
            : <kbd className="search-kbd">Enter</kbd>}
        </div>

        {/* SEARCH / TOPIC RESULTS */}
        {showResults && (
          <section className="results-block">
            <div className="section-label">
              {searchResults.length > 0 ? `Results for "${searchQuery}"` : `${activeTopic} stories`}
            </div>
            <div className="search-results">
              {displayResults.map((article, i) => (
                <Link key={i} to={`/article/${i}`} state={{ article }} className="result-item">
                  <div className="result-title">{article.title}</div>
                  <div className="result-desc">{article.description}</div>
                  <div className="result-meta">{article.source} · {timeAgo(article.publishedAt)}</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {loadingTopic && (
          <div className="explore-loading"><div className="mini-spinner" /> Loading {activeTopic} stories…</div>
        )}

        {/* TOPICS */}
        <div className="section-label">Browse by Topic</div>
        <div className="topic-grid">
          {topics.map(t => (
            <TopicTile
              key={t.name}
              topic={t}
              active={activeTopic === t.name}
              onClick={() => handleTopicClick(t)}
            />
          ))}
        </div>

        {/* REGIONS + LANGUAGES */}
        <div className="explore-split">
          <div className="panel region-panel">
            <div className="panel-head">
              <div className="panel-title">Browse by Region</div>
              <div className="panel-sub">Click a region to focus</div>
            </div>
            <div className="region-grid">
              {regions.map(r => (
                <button
                  key={r.name}
                  className={`region-chip ${activeRegion === r.name ? 'active' : ''}`}
                  onClick={() => setActiveRegion(r.name)}
                >
                  <CompassIcon size={16} />
                  <span className="region-name">{r.name}</span>
                  <span className="region-count">{r.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="panel lang-panel">
            <div className="panel-head">
              <div className="panel-title">Languages</div>
              <div className="panel-sub">40+ available</div>
            </div>
            <div className="lang-list">
              {languages.map(l => (
                <div key={l.name} className="lang-row">
                  <span className="lang-code">{l.code}</span>
                  <span className="lang-name">{l.name}</span>
                  {l.count && <span className="lang-count">{l.count}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Explore;
