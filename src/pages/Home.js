import React, { useState, useEffect } from 'react';
import './Home.css';

const API_BASE = 'https://guanews-backend.onrender.com';

const tickerItems = [
  { flag: '🇯🇵', country: 'Japan', text: 'BOJ holds rates, yen weakens to 152' },
  { flag: '🇧🇷', country: 'Brazil', text: 'Amazon hits reforestation milestone' },
  { flag: '🇩🇪', country: 'Germany', text: 'Coalition talks enter final round' },
  { flag: '🇮🇳', country: 'India', text: 'Rupee strengthens on record FDI inflows' },
  { flag: '🇺🇦', country: 'Ukraine', text: 'Peace talks resume in Istanbul' },
];

const categories = ['All', '🌍 Politics', '💹 Finance', '🔬 Science', '⚽ Sports', '🎭 Culture', '💻 Tech', '🌿 Climate'];
const categoryMap = {
  '🌍 Politics': 'politics', '💹 Finance': 'business', '🔬 Science': 'science',
  '⚽ Sports': 'sports', '🎭 Culture': 'entertainment', '💻 Tech': 'technology', '🌿 Climate': 'science',
};

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000 / 60);
  if (diff < 60) return `${diff} min ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
  return `${Math.floor(diff / 1440)} days ago`;
}

function NewsCard({ article, isHero = false }) {
  const [svg, setSvg] = useState(null);

  useEffect(() => {
    const fetchSvg = async () => {
      try {
        const res = await fetch(`${API_BASE}/illustration?title=${encodeURIComponent(article.title)}`);
        const data = await res.json();
        setSvg(data.svg);
      } catch (err) {}
    };
    fetchSvg();
  }, [article.title]);

  if (isHero) {
    return (
      <a href={article.url} target="_blank" rel="noreferrer" className="hero-card">
        <div className="hero-art">
          {svg ? (
            <div className="hero-svg" dangerouslySetInnerHTML={{ __html: svg }} />
          ) : (
            <div className="svg-loading">
              <div className="loading-spinner" />
              <div className="art-label">Generating illustration...</div>
            </div>
          )}
        </div>
        <div className="hero-content">
          <div>
            <div className="category-row">
              <div className="category-tag">Top Story</div>
            </div>
            <h1 className="hero-title">{article.title}</h1>
            <div className="gold-bar" />
            <div className="summary-label">Summary</div>
            <p className="hero-summary">{article.description}</p>
          </div>
          <div className="hero-footer">
            <div className="source-row">
              <div>
                <div className="source-name">{article.source}</div>
                <div className="source-meta">{timeAgo(article.publishedAt)}</div>
              </div>
            </div>
            <button className="read-btn">Read full story <span className="arr">→</span></button>
          </div>
        </div>
      </a>
    );
  }

  return (
    <a href={article.url} target="_blank" rel="noreferrer" className="news-card">
      <div className="card-svg-wrap">
        {svg ? (
          <div className="card-svg" dangerouslySetInnerHTML={{ __html: svg }} />
        ) : (
          <div className="card-svg-loading"><div className="loading-spinner small" /></div>
        )}
      </div>
      <div className="card-cat">News</div>
      <div className="card-title">{article.title}</div>
      <div className="card-summary">{article.description}</div>
      <div className="card-footer">
        <div className="card-source">{article.source} · {timeAgo(article.publishedAt)}</div>
        <div className="card-actions">
          <button className="act-btn" onClick={e => e.preventDefault()}>♡</button>
          <button className="act-btn" onClick={e => e.preventDefault()}>＋</button>
        </div>
      </div>
    </a>
  );
}

function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentLang, setCurrentLang] = useState('en');
  const [translating, setTranslating] = useState(false);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Listen for language change from Nav
  useEffect(() => {
    const handleLangChange = () => {
      const newLang = window.__guaLang || 'en';
      setCurrentLang(newLang);
    };
    window.addEventListener('langchange', handleLangChange);
    return () => window.removeEventListener('langchange', handleLangChange);
  }, []);

  const fetchNews = async (category, lang) => {
    const isTranslated = lang && lang !== 'en';
    isTranslated ? setTranslating(true) : setLoading(true);
    try {
      const apiCategory = categoryMap[category] || 'general';
      let url;
      if (isTranslated) {
        url = category === 'All'
          ? `${API_BASE}/news/translated?language=${lang}`
          : `${API_BASE}/news/translated?language=${lang}&category=${apiCategory}`;
      } else {
        url = category === 'All'
          ? `${API_BASE}/news`
          : `${API_BASE}/news?category=${apiCategory}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setArticles(data.articles || []);
    } catch (err) {
      console.error('Failed to fetch news:', err);
    }
    setLoading(false);
    setTranslating(false);
  };

  useEffect(() => {
    fetchNews(activeCategory, currentLang);
  }, [activeCategory, currentLang]);

  const hero = articles[0];
  const sidebar = articles.slice(1, 4);
  const grid = articles.slice(4, 10);

  return (
    <div className="home fade-up">
      <div className="ticker-bar">
        <div className="ticker-label"><div className="pulse-dot" />Flash</div>
        <div className="ticker-track">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <div key={i} className="ticker-item">
              {item.flag} <strong>{item.country}:</strong> {item.text}
            </div>
          ))}
        </div>
      </div>

      <div className="home-main">
        <div className="date-row">
          <div className="date-text">
            {today}
            <span className="edition-num">{currentLang !== 'en' ? '🌐 Translated' : 'Live'}</span>
          </div>
          <div className="stories-count">{articles.length} stories</div>
        </div>

        {(loading || translating) && (
          <div className="loading-state">
            <div className="loading-spinner" />
            <span>{translating ? 'Translating with AI...' : 'Fetching latest news...'}</span>
          </div>
        )}

        {!loading && !translating && hero && (
          <div className="hero-layout">
            <NewsCard article={hero} isHero={true} />
            <div className="sidebar">
              {sidebar.map((article, i) => (
                <a key={i} href={article.url} target="_blank" rel="noreferrer" className="sidebar-card">
                  <div className="sb-cat">News</div>
                  <div className="sb-title">{article.title}</div>
                  <div className="sb-meta">{article.source} · {timeAgo(article.publishedAt)}</div>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="filter-row">
          <div className="filter-pills">
            {categories.map(cat => (
              <button key={cat} className={`pill ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>
                {cat}
              </button>
            ))}
          </div>
          <div className="filter-sort">Sorted by latest ↓</div>
        </div>

        {!loading && !translating && grid.length > 0 && (
          <>
            <div className="section-label">More stories</div>
            <div className="news-grid">
              {grid.map((article, i) => <NewsCard key={i} article={article} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;