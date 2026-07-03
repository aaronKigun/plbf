'use client';

import { useState, type FormEvent } from 'react';
import { supabase } from '@/lib/supabase';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('');

    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('newsletter_subscribers').insert([{ email: trimmed }]);

      if (error) {
        if (error.code === '23505') {
          setStatus('You are already subscribed to our newsletter.');
        } else {
          setStatus('Unable to subscribe right now. Please try again later.');
        }
        return;
      }

      setEmail('');
      setStatus('Subscribed! You will receive our latest news, events, and legal updates.');
    } catch {
      setStatus('Unable to subscribe right now. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <form className="newsletter-form" onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          aria-label="Email address"
          required
          disabled={submitting}
        />
        <button type="submit" aria-label="Subscribe" disabled={submitting}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </form>
      {status ? (
        <p className={`newsletter-status${status.includes('Unable') || status.includes('valid') ? ' error' : ''}`}>
          {status}
        </p>
      ) : null}
    </>
  );
}
