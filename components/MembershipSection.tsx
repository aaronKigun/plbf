'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import SectionHeading from '@/components/SectionHeading';
import type { SectionHeading as SectionHeadingType } from '@/types/content';
import Reveal from '@/components/Reveal';

const paystackPublicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '';

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

export default function MembershipSection({ heading }: { heading: SectionHeadingType }) {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    call_to_bar_year: '',
    practice_area: '',
    dues_amount: '10000'
  });
  const [status, setStatus] = useState('');
  const [paying, setPaying] = useState(false);

  const saveMember = async (paymentReference: string) => {
    const duesAmount = Number(form.dues_amount);
    const { error } = await supabase.from('members').insert([{
      full_name: form.full_name,
      email: form.email,
      phone: form.phone,
      call_to_bar_year: form.call_to_bar_year,
      practice_area: form.practice_area,
      dues_amount: duesAmount,
      payment_reference: paymentReference,
      payment_status: 'paid',
      status: 'paid',
      paid_at: new Date().toISOString()
    }]);

    if (error) throw error;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('');

    if (!paystackPublicKey) {
      setStatus('Paystack is not configured yet.');
      return;
    }

    const duesAmount = Number(form.dues_amount);
    if (!duesAmount || duesAmount < 1) {
      setStatus('Enter a valid dues amount.');
      return;
    }

    setPaying(true);
    try {
      await loadScript('https://js.paystack.co/v1/inline.js', 'paystack-inline');
      const handler = window.PaystackPop?.setup({
        key: paystackPublicKey,
        email: form.email,
        amount: duesAmount * 100,
        currency: 'NGN',
        ref: `PLBF-${Date.now()}`,
        metadata: {
          custom_fields: [
            { display_name: 'Full Name', variable_name: 'full_name', value: form.full_name },
            { display_name: 'Phone', variable_name: 'phone', value: form.phone }
          ]
        },
        callback: async (response) => {
          try {
            await saveMember(response.reference);
            setForm({ full_name: '', email: '', phone: '', call_to_bar_year: '', practice_area: '', dues_amount: '10000' });
            setStatus('Payment successful. Your membership has been registered as paid.');
          } catch {
            setStatus('Payment succeeded, but saving your membership failed. Please contact the secretariat with your reference.');
          } finally {
            setPaying(false);
          }
        },
        onClose: () => {
          setStatus('Payment was not completed.');
          setPaying(false);
        }
      });

      handler?.openIframe();
    } catch {
      setStatus('Unable to start payment right now.');
      setPaying(false);
    }
  };

  return (
    <section id="membership" className="site-section membership-section">
      <div className="site-container">
        <Reveal>
          <SectionHeading
            eyebrow={heading.eyebrow}
            title={heading.title}
            titleHighlight={heading.title_highlight}
            intro={heading.intro}
          />
        </Reveal>

        <Reveal className="glass-card form-card membership-form">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div>
                <label htmlFor="member-name">Full Name</label>
                <input
                  id="member-name"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <label htmlFor="member-email">Email Address</label>
                <input
                  id="member-email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  type="email"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            <label htmlFor="member-phone">Phone Number</label>
            <input
              id="member-phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Enter your phone number"
              required
            />
            <div className="form-row">
              <div>
                <label htmlFor="member-call-year">Call to Bar Year</label>
                <input
                  id="member-call-year"
                  value={form.call_to_bar_year}
                  onChange={(e) => setForm({ ...form, call_to_bar_year: e.target.value })}
                  placeholder="e.g. 2018"
                />
              </div>
              <div>
                <label htmlFor="member-practice">Practice Area</label>
                <input
                  id="member-practice"
                  value={form.practice_area}
                  onChange={(e) => setForm({ ...form, practice_area: e.target.value })}
                  placeholder="e.g. Litigation"
                />
              </div>
            </div>
            <label htmlFor="member-dues">Dues Amount (NGN)</label>
            <input
              id="member-dues"
              value={form.dues_amount}
              onChange={(e) => setForm({ ...form, dues_amount: e.target.value })}
              inputMode="numeric"
              placeholder="10000"
              required
            />
            <button type="submit" className="mag-btn mag-btn-full" disabled={paying}>
              <span>{paying ? 'Processing...' : 'Pay Dues & Register'}</span>
            </button>
            {status ? <p className={`form-status${status.includes('Unable') || status.includes('not configured') || status.includes('not completed') || status.includes('valid') || status.includes('failed') ? ' error' : ''}`}>{status}</p> : null}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
