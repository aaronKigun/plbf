'use client';

import { useState } from 'react';

const navItems = [
  { href: '#about', label: 'About' },
  { href: '#governance', label: 'Governance' },
  { href: '#trustees', label: 'Trustees' },
  { href: '#executives', label: 'Leadership' },
  { href: '#services', label: 'Programmes' },
  { href: '#events', label: 'Events' },
  { href: '#news-updates', label: 'News' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#videos', label: 'Videos' },
  { href: '#membership', label: 'Membership' },
  { href: '#contact', label: 'Contact' }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className={`navbar${open ? ' navbar-open' : ''}`}>
      <div className="navbar-inner">
        <a href="#hero" className="brand" onClick={() => setOpen(false)}>
          <img src="/images/Logo.jpg" alt="PLBF logo" className="brand-logo" />
          <span>PLATEAU LAWYERS BAR FORUM</span>
        </a>
        <button
          type="button"
          className={`menu-toggle${open ? ' is-open' : ''}`}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={() => setOpen((current) => !current)}
        >
          <svg
            className="justice-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="3.4" r="1.1" />
            <path d="M12 4.5v15" />
            <path d="M7.5 19.5h9" />
            <path d="M4.5 6.2h15" />
            <path d="M12 4.8 6 6.4M12 4.8l6 1.6" />
            <path d="M4.5 6.2 2 11.4a2.5 2.5 0 0 0 5 0L4.5 6.2Z" />
            <path d="M19.5 6.2 17 11.4a2.5 2.5 0 0 0 5 0l-2.5-5.2Z" />
          </svg>
        </button>
        <div id="primary-navigation" className="nav-links">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
