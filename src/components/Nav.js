import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Nav.css';

export const LanguageContext = React.createContext({ lang: 'en', setLang: () => {} });

function Nav() {
  const location = useLocation();
  const [lang, setLang] = useState('en');
  const [showLangMenu, setShowLangMenu] = useState(false);

  const languages = [
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'zh', label: '中文', name: 'Chinese' },
    { code: 'ja', label: '日本語', name: 'Japanese' },
    { code: 'es', label: 'ES', name: 'Spanish' },
    { code: 'fr', label: 'FR', name: 'French' },
  ];

  const currentLang = languages.find(l => l.code === lang);

  return (
    <nav className="nav">
      <Link to="/" className="nav-logo">
        GuaNews <span className="nav-logo-dot">·</span>
      </Link>

      <div className="nav-center">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Today</Link>
        <Link to="/explore" className={location.pathname === '/explore' ? 'active' : ''}>Explore</Link>
        <Link to="/flash" className={location.pathname === '/flash' ? 'active' : ''}>Flash</Link>
        <Link to="/saved" className={location.pathname === '/saved' ? 'active' : ''}>Saved</Link>
      </div>

      <div className="nav-right">
        <div className="lang-selector" onClick={() => setShowLangMenu(!showLangMenu)}>
          <div className="lang-pill">{currentLang.label} ▾</div>
          {showLangMenu && (
            <div className="lang-dropdown">
              {languages.map(l => (
                <div
                  key={l.code}
                  className={`lang-option ${lang === l.code ? 'active' : ''}`}
                  onClick={() => { setLang(l.code); setShowLangMenu(false); window.__guaLang = l.code; window.dispatchEvent(new Event('langchange')); }}
                >
                  {l.label} — {l.name}
                </div>
              ))}
            </div>
          )}
        </div>
        <button className="sign-in-btn">Sign In</button>
      </div>
    </nav>
  );
}

export default Nav;