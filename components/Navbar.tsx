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
            <span className="nav-brand-title">Plateau Lawyers Bar Forum</span>
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
            className={`icon-linescales menu-toggle${open ? ' active' : ''}`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((current) => !current)}
          >
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <line x1="100" y1="58" x2="100" y2="142" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="scale-line-1" />
              <line x1="78" y1="72" x2="122" y2="72" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="scale-line-2" />
              <line x1="78" y1="72" x2="72" y2="88" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="scale-line-3" />
              <line x1="122" y1="72" x2="128" y2="88" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="scale-line-4" />
              <path d="M66 88 Q72 96 78 88" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="scale-line-5" />
              <path d="M122 88 Q128 96 134 88" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="scale-line-5" />
              <line x1="82" y1="82" x2="118" y2="118" stroke="currentColor" strokeWidth="5" strokeLinecap="round" className="x-line-1" />
              <line x1="118" y1="82" x2="82" y2="118" stroke="currentColor" strokeWidth="5" strokeLinecap="round" className="x-line-2" />
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
