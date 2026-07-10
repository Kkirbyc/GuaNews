import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { GlobeIcon, ChevronDownIcon, SunIcon, MoonIcon } from './Icons';
import './Nav.css';

function Nav() {
  const location = useLocation();
  const { lang, setLang, languages } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const currentLang = languages.find(l => l.code === lang) || languages[0];

  const navLinks = [
    { to: '/', label: 'Today' },
    { to: '/explore', label: 'Explore' },
    { to: '/flash', label: 'Flash' },
    { to: '/saved', label: 'Saved' },
  ];

  return (
    <nav className="nav">
      <Link to="/" className="nav-logo">
        GuaNews <span className="nav-logo-dot">·</span>
      </Link>

      <div className="nav-center">
        {navLinks.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={location.pathname === to ? 'active' : ''}
            aria-current={location.pathname === to ? 'page' : undefined}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="nav-right">
        <button
          className="icon-btn"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          {theme === 'dark' ? <SunIcon size={18} /> : <MoonIcon size={18} />}
        </button>

        <div className="lang-selector">
          <button
            className="lang-pill"
            onClick={() => setShowLangMenu(v => !v)}
            aria-haspopup="listbox"
            aria-expanded={showLangMenu}
          >
            <GlobeIcon size={15} />
            {currentLang.label}
            <ChevronDownIcon size={14} />
          </button>
          {showLangMenu && (
            <div className="lang-dropdown" role="listbox">
              {languages.map(l => (
                <div
                  key={l.code}
                  role="option"
                  aria-selected={lang === l.code}
                  className={`lang-option ${lang === l.code ? 'active' : ''}`}
                  onClick={() => { setLang(l.code); setShowLangMenu(false); }}
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
