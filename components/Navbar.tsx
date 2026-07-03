'use client';

import { useEffect, useState } from 'react';

const navItems = [
  { href: '#about', label: 'About' },
  { href: '#governance', label: 'Governance' },
  { href: '#executives', label: 'Leadership' },
  { href: '#services', label: 'Programmes' },
  { href: '#events', label: 'Events' },
  { href: '#trustees', label: 'Trustees' },
  { href: '#news-updates', label: 'News' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#videos', label: 'Videos' },
  { href: '#membership', label: 'Membership' },
  { href: '#contact', label: 'Contact' }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <>
      <nav className={`nav-glass${scrolled ? ' scrolled' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="nav-inner site-container">
          <a href="#hero" className="nav-brand" onClick={closeMenu}>
            <img src="/images/Logo.jpg" alt="PLBF logo" className="nav-brand-logo" />
            <div className="nav-brand-text">
              <span className="nav-brand-title">PLBF</span>
              <span className="nav-brand-sub">Plateau Lawyers</span>
            </div>
          </a>

          <div className="nav-desktop">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="nav-link">
                {item.label}
              </a>
            ))}
            <a href="#membership" className="nav-cta">
              Become a Member
            </a>
          </div>

          <button
            type="button"
            className={`menu-toggle${open ? ' is-open' : ''}`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((current) => !current)}
          >
            <svg className="justice-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="3.4" r="1.1" />
              <path d="M12 4.5v15" />
              <path d="M7.5 19.5h9" />
              <path d="M4.5 6.2h15" />
              <path d="M12 4.8 6 6.4M12 4.8l6 1.6" />
              <path d="M4.5 6.2 2 11.4a2.5 2.5 0 0 0 5 0L4.5 6.2Z" />
              <path d="M19.5 6.2 17 11.4a2.5 2.5 0 0 0 5 0l-2.5-5.2Z" />
            </svg>
          </button>
        </div>
      </nav>

      <div className={`mobile-menu${open ? ' open' : ''}`} role="dialog" aria-label="Mobile navigation">
        {navItems.map((item) => (
          <a key={item.href} href={item.href} className="mobile-nav-link" onClick={closeMenu}>
            {item.label}
          </a>
        ))}
        <a href="#membership" className="mag-btn" onClick={closeMenu}>
          <span>Become a Member</span>
        </a>
      </div>
    </>
  );
}
