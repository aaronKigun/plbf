'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import SectionHeading from '@/components/SectionHeading';
import type { SectionHeading as SectionHeadingType } from '@/types/content';
import Reveal from '@/components/Reveal';

const emailJsPublicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';
const emailJsServiceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
const emailJsTemplateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';

function loadScript(src: string, id: string) {
  return new Promise<void>((resolve, reject) => {
    if (document.getElementById(id)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Unable to load ${src}`));
    document.body.appendChild(script);
  });
}

export default function ContactSection({ heading }: { heading: SectionHeadingType }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('');

    if (!emailJsPublicKey || !emailJsServiceId || !emailJsTemplateId) {
      setStatus('EmailJS is not configured yet.');
      return;
    }

    setSending(true);
    try {
      await loadScript('https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js', 'emailjs-sdk');
      window.emailjs?.init(emailJsPublicKey);
      await window.emailjs?.send(emailJsServiceId, emailJsTemplateId, {
        from_name: form.name,
        from_email: form.email,
        subject: form.subject,
        message: form.message
      });

      await supabase.from('contact_messages').insert([{ ...form }]);
      setForm({ name: '', email: '', subject: '', message: '' });
      setStatus('Message sent successfully.');
    } catch {
      setStatus('Unable to send message right now.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="site-section contact-section">
      <div className="orb orb-navy contact-orb" aria-hidden="true" />
      <div className="site-container contact-layout">
        <Reveal className="contact-copy">
          <SectionHeading
            eyebrow={heading.eyebrow}
            title={heading.title}
            titleHighlight={heading.title_highlight}
            intro={heading.intro}
            centered={false}
            sectionNum="10"
          />
        </Reveal>

        <Reveal className="glass-card form-card">
          <form onSubmit={handleSubmit}>
            <label htmlFor="contact-name">Name</label>
            <input
              id="contact-name"
              value={form.name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter your name"
              required
            />
            <label htmlFor="contact-email">Email Address</label>
            <input
              id="contact-email"
              value={form.email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, email: e.target.value })}
              type="email"
              placeholder="Enter your email"
              required
            />
            <label htmlFor="contact-subject">Subject</label>
            <input
              id="contact-subject"
              value={form.subject}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, subject: e.target.value })}
              placeholder="What would you like to discuss?"
              required
            />
            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              value={form.message}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, message: e.target.value })}
              placeholder="Write your message here"
              rows={5}
              required
            />
            <button type="submit" className="mag-btn mag-btn-full" disabled={sending}>
              <span>{sending ? 'Sending...' : 'Send Message'}</span>
            </button>
            {status ? <p className={`form-status${status.includes('Unable') || status.includes('not configured') ? ' error' : ''}`}>{status}</p> : null}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
