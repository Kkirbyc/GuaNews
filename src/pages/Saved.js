import React from 'react';
import { Link } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';
import { HeartIcon, ArrowRightIcon } from '../components/Icons';
import './Saved.css';

function Saved() {
  const { saved, toggleSave } = useLibrary();

  return (
    <div className="saved-page fade-up">
      <div className="saved-main">
        <div className="saved-header">
          <h1 className="saved-title">Saved</h1>
          <p className="saved-subtitle">
            {saved.length} {saved.length === 1 ? 'story' : 'stories'} in your library.
          </p>
        </div>

        {saved.length === 0 ? (
          <div className="saved-empty">
            <p className="saved-empty-title">Nothing saved yet</p>
            <p className="saved-empty-sub">Tap the heart on any story to keep it here.</p>
            <Link to="/" className="saved-cta">
              Browse Today <ArrowRightIcon size={15} />
            </Link>
          </div>
        ) : (
          <div className="saved-grid">
            {saved.map((article, i) => (
              <div key={article.url} className="saved-card">
                <Link to={`/article/${i}`} state={{ article }} className="saved-card-link">
                  <div className="saved-card-cat">Saved</div>
                  <div className="saved-card-title">{article.title}</div>
                  {article.description && (
                    <div className="saved-card-summary">{article.description}</div>
                  )}
                  <div className="saved-card-source">{article.source}</div>
                </Link>
                <button
                  className="saved-remove"
                  onClick={() => toggleSave(article)}
                  aria-label="Remove from saved"
                >
                  <HeartIcon size={16} filled />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Saved;
