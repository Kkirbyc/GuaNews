import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE } from '../config/api';
import { useLanguage } from '../context/LanguageContext';
import { useLibrary } from '../context/LibraryContext';
import { useTilt } from '../hooks/useTilt';
import { HeartIcon, ShareIcon, ArrowRightIcon } from '../components/Icons';
import FeaturedDeck from '../components/FeaturedDeck';
import './Home.css';

const categories = ['All', '🌍 Politics', '💹 Finance', '🔬 Science', '⚽ Sports', '🎭 Culture', '💻 Tech', '🌿 Climate'];
const categoryMap = {
  '🌍 Politics': 'politics', '💹 Finance': 'business', '🔬 Science': 'science',
  '⚽ Sports': 'sports', '🎭 Culture': 'entertainment', '💻 Tech': 'technology', '🌿 Climate': 'science',
};

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000 / 60);
  if (diff < 1) return 'just now';
  if (diff < 60) return `${diff} min ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
  return `${Math.floor(diff / 1440)} days ago`;
}

export async function shareArticle(article) {
  try {
    if (navigator.share) {
      await navigator.share({ title: article.title, url: article.url });
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(article.url);
    }
  } catch (err) {
    // User dismissed the share sheet — nothing to do.
  }
}

function CardActions({ article }) {
  const { isSaved, toggleSave } = useLibrary();
  const saved = isSaved(article.url);
  const stop = (fn) => (e) => { e.preventDefault(); e.stopPropagation(); fn(); };
  return (
    <div className="card-actions">
      <button
        className={`act-btn ${saved ? 'is-saved' : ''}`}
        onClick={stop(() => toggleSave(article))}
        aria-label={saved ? 'Remove from saved' : 'Save article'}
        aria-pressed={saved}
      >
        <HeartIcon size={17} filled={saved} />
      </button>
      <button className="act-btn" onClick={stop(() => shareArticle(article))} aria-label="Share article">
        <ShareIcon size={16} />
      </button>
    </div>
  );
}

function NewsCard({ article, id, isHero = false }) {
  const tilt = useTilt(isHero ? 4 : 7);
  const to = { pathname: `/article/${id}` };
  const state = { article };

  if (isHero) {
    return (
      <Link to={to} state={state} className="hero-card tilt" {...tilt}>
        <div className="hero-art">
          <div className="hero-glow" />
          <div className="svg-placeholder">
            <div className="art-icon">G</div>
            <div className="art-label">Global Brief</div>
          </div>
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
            <span className="read-btn">Read full story <ArrowRightIcon size={15} /></span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={to} state={state} className="news-card tilt" {...tilt}>
      <div className="card-cat">News</div>
      <div className="card-title">{article.title}</div>
      <div className="card-summary">{article.description}</div>
      <div className="card-footer">
        <div className="card-source">{article.source} · {timeAgo(article.publishedAt)}</div>
        <CardActions article={article} />
      </div>
    </Link>
  );
}

function Home() {
  const { lang } = useLanguage();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [translating, setTranslating] = useState(false);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const fetchNews = useCallback(async (category, currentLang) => {
    const isTranslated = currentLang && currentLang !== 'en';
    isTranslated ? setTranslating(true) : setLoading(true);
    try {
      const apiCategory = categoryMap[category] || 'general';
      const params = new URLSearchParams();
      if (isTranslated) params.set('language', currentLang);
      if (category !== 'All') params.set('category', apiCategory);
      const endpoint = isTranslated ? '/news/translated' : '/news';
      const res = await fetch(`${API_BASE}${endpoint}?${params}`);
      const data = await res.json();
      setArticles(data.articles || []);
    } catch (err) {
      console.error('Failed to fetch news:', err);
    }
    setLoading(false);
    setTranslating(false);
  }, []);

  useEffect(() => {
    fetchNews(activeCategory, lang);
  }, [activeCategory, lang, fetchNews]);

  const grid = articles.slice(5, 11);

  return (
    <div className="home fade-up">
      <div className="home-main">

        {/* MASTHEAD */}
        <header className="masthead">
          <div className="masthead-top">
            <span className="masthead-live"><span className="live-pip" /> Live · {today}</span>
            <span className="masthead-badge">World Edition</span>
          </div>
          <h1 className="masthead-title">The Global <em>Brief</em></h1>
          <div className="masthead-rule" />
          <div className="masthead-foot">
            <p className="masthead-sub">World news, distilled by AI — summarized, translated, and illustrated.</p>
            <div className="masthead-chips">
              <span className="mchip">AI summaries</span>
              <span className="mchip">40+ languages</span>
              <span className="mchip">{articles.length ? `${articles.length} live` : 'Live'}</span>
            </div>
          </div>
        </header>

        {(loading || translating) && (
          <div className="loading-state">
            <div className="loading-spinner" />
            <span>{translating ? 'Translating with AI...' : 'Fetching latest news...'}</span>
          </div>
        )}

        {!loading && !translating && articles.length > 0 && (
          <FeaturedDeck articles={articles} />
        )}

        <div className="filter-row">
          <div className="filter-pills">
            {categories.map(cat => (
              <button key={cat} className={`pill ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>
                {cat}
              </button>
            ))}
          </div>
          <div className="filter-sort">Latest ↓</div>
        </div>

        {!loading && !translating && grid.length > 0 && (
          <>
            <div className="section-label">More stories</div>
            <div className="news-grid">
              {grid.map((article, i) => <NewsCard key={i} article={article} id={i + 4} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
