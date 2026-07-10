import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { API_BASE } from '../config/api';
import { useLibrary } from '../context/LibraryContext';
import { HeartIcon, ShareIcon, ArrowRightIcon } from '../components/Icons';
import { shareArticle } from './Home';
import './Detail.css';

/* Strip anything executable before rendering model-generated SVG. */
function sanitizeSvg(svg) {
  if (!svg || !svg.trim().toLowerCase().startsWith('<svg')) return '';
  return svg
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/\son\w+\s*=\s*'[^']*'/gi, '')
    .replace(/javascript:/gi, '');
}

function Detail() {
  const location = useLocation();
  const article = location.state?.article;
  const { isSaved, toggleSave } = useLibrary();

  const [summary, setSummary] = useState({ status: 'loading', points: [] });
  const [svg, setSvg] = useState({ status: 'loading', code: '' });

  useEffect(() => {
    if (!article) return;
    let active = true;
    setSummary({ status: 'loading', points: [] });
    setSvg({ status: 'loading', code: '' });

    (async () => {
      try {
        const params = new URLSearchParams({
          title: article.title || '',
          description: article.description || '',
        });
        const res = await fetch(`${API_BASE}/summarize?${params}`);
        const data = await res.json();
        if (active) {
          setSummary({
            status: data.points && data.points.length ? 'done' : 'error',
            points: data.points || [],
          });
        }
      } catch (err) {
        if (active) setSummary({ status: 'error', points: [] });
      }
    })();

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/illustration?title=${encodeURIComponent(article.title || '')}`);
        const data = await res.json();
        const clean = sanitizeSvg(data.svg || '');
        if (active) setSvg({ status: clean ? 'done' : 'error', code: clean });
      } catch (err) {
        if (active) setSvg({ status: 'error', code: '' });
      }
    })();

    return () => { active = false; };
  }, [article]);

  if (!article) {
    return (
      <div className="detail fade-up">
        <div className="detail-empty">
          <h1>Article not available</h1>
          <p>Open a story from the feed to read its AI brief.</p>
          <Link to="/" className="original-btn">Back to Today</Link>
        </div>
      </div>
    );
  }

  const saved = isSaved(article.url);
  const published = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  return (
    <div className="detail fade-up">
      <div className="detail-wrap">
        <div className="breadcrumb">
          <Link to="/">Today</Link>
          <span className="breadcrumb-sep">›</span>
          <span>{article.source}</span>
        </div>

        {/* AI ILLUSTRATION */}
        <div className="detail-illustration">
          {svg.status === 'done' ? (
            <div className="detail-svg" dangerouslySetInnerHTML={{ __html: svg.code }} />
          ) : svg.status === 'loading' ? (
            <div className="detail-svg-loading">
              <div className="loading-spinner" />
              <span>Illustrating…</span>
            </div>
          ) : (
            <div className="detail-svg-fallback"><span>G</span></div>
          )}
        </div>

        <div className="article-header">
          <div className="article-category">Brief</div>
          <h1 className="article-title">{article.title}</h1>
          <div className="article-meta">
            <div className="meta-source">
              <div>
                <div className="meta-name">{article.source}</div>
                {published && <div className="meta-info">{published}</div>}
              </div>
            </div>
            <div className="meta-actions">
              <button
                className={`action-pill ${saved ? 'filled' : ''}`}
                onClick={() => toggleSave(article)}
                aria-pressed={saved}
              >
                <HeartIcon size={15} filled={saved} /> {saved ? 'Saved' : 'Save'}
              </button>
              <button className="action-pill" onClick={() => shareArticle(article)}>
                <ShareIcon size={15} /> Share
              </button>
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

          {summary.status === 'loading' && (
            <div className="summary-points">
              {[0, 1, 2].map(i => (
                <div key={i} className="summary-point summary-skeleton">
                  <span className="point-num">0{i + 1}</span>
                  <span className="skeleton-line" />
                </div>
              ))}
            </div>
          )}

          {summary.status === 'done' && (
            <div className="summary-points">
              {summary.points.map((point, i) => (
                <div key={i} className="summary-point">
                  <span className="point-num">0{i + 1}</span>
                  <span>{point.replace(/^\d+[.)]\s*/, '')}</span>
                </div>
              ))}
            </div>
          )}

          {summary.status === 'error' && (
            <div className="summary-error">Summary unavailable right now — read the full story below.</div>
          )}
        </div>

        {/* LEAD */}
        <div className="article-body">
          <p>{article.description}</p>
        </div>

        {/* SOURCE LINK */}
        <div className="source-link-box">
          <div className="source-link-left">
            <div>
              <div className="source-link-text">Original source</div>
              <div className="source-link-name">{article.source}</div>
            </div>
          </div>
          <a href={article.url} target="_blank" rel="noreferrer" className="original-btn">
            Read original <ArrowRightIcon size={15} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Detail;
