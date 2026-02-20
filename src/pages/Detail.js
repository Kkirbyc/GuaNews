import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articles } from '../data/articles';
import './Detail.css';

function Detail() {
  const { id } = useParams();
  const article = articles.find(a => a.id === parseInt(id)) || articles[0];
  const [saved, setSaved] = useState(false);

  return (
    <div className="detail fade-up">
      <div className="detail-layout">
        <article>

          <div className="breadcrumb">
            <Link to="/">Today</Link>
            <span className="breadcrumb-sep">›</span>
            <span>{article.category}</span>
            <span className="breadcrumb-sep">›</span>
            <span>{article.title.substring(0, 40)}...</span>
          </div>

          <div className="article-header">
            <div className="article-category">{article.category}</div>
            <h1 className="article-title">{article.title}</h1>
            <div className="article-meta">
              <div className="meta-source">
                <span className="meta-flag">{article.sourceFlag}</span>
                <div>
                  <div className="meta-name">{article.source}</div>
                  <div className="meta-info">February 17, 2026</div>
                </div>
              </div>
              <span className="meta-dot">·</span>
              <span className="meta-info">{article.readTime}</span>
              <span className="meta-dot">·</span>
              <span className="meta-info">Translated from English</span>
              <div className="meta-actions">
                <button
                  className={`action-pill ${saved ? 'filled' : ''}`}
                  onClick={() => setSaved(!saved)}
                >
                  {saved ? '♡ Saved' : '♡ Save'}
                </button>
                <button className="action-pill">↗ Share</button>
              </div>
            </div>
          </div>

          <div className="article-divider" />

          {/* AI SUMMARY */}
          <div className="summary-box">
            <div className="summary-header">
              <div className="summary-label">⚡ AI Summary — In 30 seconds</div>
              <div className="ai-badge">AI Generated</div>
            </div>
            <div className="summary-points">
              {article.points.map((point, i) => (
                <div key={i} className="summary-point">
                  <span className="point-num">0{i + 1}</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* LANG SWITCHER */}
          <div className="lang-switcher">
            <span className="lang-switcher-label">Read in:</span>
            {['English', '中文', '日本語', 'Español'].map(lang => (
              <button key={lang} className={`lang-btn ${lang === 'English' ? 'active' : ''}`}>{lang}</button>
            ))}
            <button className="lang-btn">+ More</button>
          </div>

          {/* BODY */}
          <div className="article-body">
            {article.body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {/* PERSPECTIVES */}
          <div className="perspectives">
            <div className="perspectives-header">
              <div className="perspectives-title">🌐 How the world sees it</div>
              <div className="perspectives-sub">{article.perspectives.length} sources · {article.perspectives.length} perspectives</div>
            </div>
            {article.perspectives.map((p, i) => (
              <div key={i} className="perspective-item">
                <span className="perspective-flag">{p.flag}</span>
                <div className="perspective-body">
                  <div className="perspective-source">
                    {p.source}
                    <span className={`stance-tag stance-${p.stanceColor}`}>{p.stance}</span>
                  </div>
                  <div className="perspective-text">{p.text}</div>
                </div>
              </div>
            ))}
          </div>

          {/* SOURCE LINK */}
          <div className="source-link-box">
            <div className="source-link-left">
              <span style={{ fontSize: '24px' }}>{article.sourceFlag}</span>
              <div>
                <div className="source-link-text">Original source</div>
                <div className="source-link-name">{article.source} — Full article in English</div>
              </div>
            </div>
            <a href="#top" className="original-btn">Read original ↗</a>
          </div>

        </article>

        {/* SIDEBAR */}
        <aside className="detail-sidebar">

          <div className="sidebar-section">
            <div className="sidebar-title">Key Facts</div>
            {article.facts.map((fact, i) => (
              <div key={i} className="fact-item">
                <div className="fact-bullet" />
                {fact}
              </div>
            ))}
          </div>

          <div className="sidebar-section">
            <div className="sidebar-title">Related Stories</div>
            {article.related.map(r => (
              <Link key={r.id} to={`/article/${r.id}`} className="related-item">
                <div className="related-body">
                  <div className="related-cat">{r.category}</div>
                  <div className="related-title">{r.title}</div>
                  <div className="related-meta">{r.source} · {r.readTime}</div>
                </div>
              </Link>
            ))}
          </div>

          <div className="sidebar-section">
            <div className="sidebar-title">Source Transparency</div>
            <div className="trust-text">
              This story was sourced from <strong>{article.source}</strong>, cross-referenced with <strong>{article.perspectives.length} independent outlets</strong>, and translated by GuaNews AI.
            </div>
            <div className="trust-badge">✓ No editorial bias detected</div>
          </div>

        </aside>

      </div>
    </div>
  );
}

export default Detail;