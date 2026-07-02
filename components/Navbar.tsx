'use client';

import { useState } from 'react';

const navItems = [
  { href: '#about', label: 'About' },
  { href: '#governance', label: 'Governance' },
  { href: '#trustees', label: 'Trustees' },
  { href: '#executives', label: 'Leadership' },
  { href: '#services', label: 'Programmes' },
  { href: '#events', label: 'Events' },
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
          className="menu-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={() => setOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
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
