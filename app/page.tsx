'use client';

import { useEffect, useState } from 'react';
import HeroSection from '@/components/HeroSection';
import Navbar from '@/components/Navbar';
import SectionGrid from '@/components/SectionGrid';
import LeadershipSection from '@/components/LeadershipSection';
import MembershipSection from '@/components/MembershipSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import type { Trustee, Leader, EventItem, NewsItem, Programme } from '@/types/content';

export default function HomePage() {
  const [trustees, setTrustees] = useState<Trustee[]>([]);
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [programmes, setProgrammes] = useState<Programme[]>([]);

  useEffect(() => {
    const loadContent = async () => {
      const [{ data: trusteesData }, { data: leadersData }, { data: eventsData }, { data: newsData }, { data: programmesData }] = await Promise.all([
        supabase.from('trustees').select('*').order('display_order', { ascending: true }).limit(6),
        supabase.from('leaders').select('*').order('display_order', { ascending: true }).limit(6),
        supabase.from('events').select('*').order('date', { ascending: false }).limit(6),
        supabase.from('news').select('*').order('date', { ascending: false }).limit(6),
        supabase.from('programmes').select('*').limit(6)
      ]);

      setTrustees((trusteesData as Trustee[]) || []);
      setLeaders((leadersData as Leader[]) || []);
      setEvents((eventsData as EventItem[]) || []);
      setNews((newsData as NewsItem[]) || []);
      setProgrammes((programmesData as Programme[]) || []);
    };

    loadContent();
  }, []);

  const fallbackTrustees = [
    { name: 'Chief A. B. D. Jang', position: 'Chairman', bio: 'Guiding the forum with strategic leadership and legal insight.' },
    { name: 'Barr. M. C. Pam', position: 'Vice Chairman', bio: 'Supporting members and strengthening institutional growth.' },
    { name: 'Barr. I. S. Dalyop', position: 'Secretary', bio: 'Coordinating policy, engagement, and administration.' }
  ];

  const fallbackLeaders = [
    { name: 'Barr. Chambers C. Dabwan', position: 'Chairman', image: '/images/chairman.png' },
    { name: 'Barr. M. C. Pam', position: 'Vice Chairman', image: '/images/Logo.jpg' },
    { name: 'Barr. I. S. Dalyop', position: 'Secretary', image: '/images/Logo.jpg' }
  ];

  const fallbackProgrammes = [
    { title: 'Legal Aid Outreach', description: 'Community legal support and citizen empowerment.' },
    { title: 'Judicial Reform', description: 'Advocacy for transparency and accessible justice.' },
    { title: 'Professional Development', description: 'Continuing legal education and mentorship.' }
  ];

  const fallbackEvents = [
    { title: 'Annual General Meeting', date: '12 Aug 2026 • Jos', description: 'Conference' },
    { title: 'Free Legal Clinic', date: '20 Sep 2026 • Bassa', description: 'Outreach' },
    { title: 'Leadership Roundtable', date: '03 Oct 2026 • Abuja', description: 'Forum' }
  ];

  const fallbackNews = [
    { title: 'PLBF Launches New Membership Drive', category: 'Membership', excerpt: 'The forum is welcoming new members to strengthen legal advocacy.' },
    { title: 'Youth Legal Awareness Programme Announced', category: 'Outreach', excerpt: 'A new programme focused on civic education and legal access.' },
    { title: 'Panel Discussion on Access to Justice', category: 'Event', excerpt: 'A forthcoming conversation on building fairer legal systems.' }
  ];

  const governanceItems = [
    { title: 'Constitution', description: 'The forum’s constitution provides governance principles, membership rules, and operational structure.' },
    { title: 'Code of Conduct', description: 'Professional standards, ethical duties, and disciplinary procedures for members.' },
    { title: 'Membership Criteria', description: 'Eligibility requirements, admission process, and membership benefits for legal practitioners.' },
    { title: 'Continuing Legal Education', description: 'Professional development, training programmes, and mentorship for bar members.' },
    { title: 'Committees & Working Groups', description: 'Governance, finance, events, and public outreach bodies that steer forum activity.' },
    { title: 'Annual Report', description: 'Yearly performance, impact summaries, and strategic priorities for the forum.' }
  ];

  const displayTrustees = trustees.length ? trustees : fallbackTrustees;
  const displayLeaders = leaders.length ? leaders : fallbackLeaders;
  const displayEvents = events.length ? events : fallbackEvents;
  const displayNews = news.length ? news : fallbackNews;
  const displayProgrammes = programmes.length ? programmes : fallbackProgrammes;

  return (
    <>
      <Navbar />
      <main>
        <HeroSection
          title="Plateau Lawyers Bar Forum"
          subtitle="A united body of legal practitioners committed to rule of law, human rights, and the advancement of justice."
          description="PLBF is a non-partisan association of legal practitioners working to promote professional excellence, legal education, and public welfare."
        />

        <section id="about" className="section">
          <div className="section-heading">
            <span className="section-eyebrow">About Us</span>
            <h2>Upholding the Integrity of the Legal Profession</h2>
          </div>
          <p>
            PLBF is a non-partisan association of legal practitioners working to promote professional excellence, legal education, and public welfare.
          </p>
          <div className="quote-banner">
            <p>
              “We stand for justice, discipline, and service to the people of Plateau State and beyond.”
            </p>
          </div>
        </section>

        <section id="governance">
          <SectionGrid
            title="Governance"
            eyebrow="Foundation"
            intro="The policies, standards, and working structures that guide the Forum's service to members and the public."
            items={governanceItems}
          />
        </section>
        <section id="trustees">
          <SectionGrid
            title="Board of Trustees"
            eyebrow="Pillar of Guidance"
            intro="Distinguished senior members who provide strategic direction, wisdom, and steadfast support to the Forum."
            items={displayTrustees.map((item) => ({ title: item.name, subtitle: item.position, description: item.bio || 'Community leadership and legal service.' }))}
            tone="dark"
          />
        </section>
        <section id="services">
          <SectionGrid
            title="Our Mandate & Programmes"
            eyebrow="What We Do"
            intro="Through structured programmes and sustained advocacy, we work to elevate legal practice and make justice more accessible."
            items={displayProgrammes.map((item) => ({ title: item.title, description: item.description }))}
          />
        </section>
        <section id="events">
          <SectionGrid
            title="Events"
            eyebrow="Upcoming & Recent"
            intro="Forums, clinics, meetings, and professional gatherings that keep the PLBF community connected."
            items={displayEvents.map((item) => ({ title: item.title, subtitle: item.date, description: item.description || 'Upcoming event' }))}
            tone="white"
          />
        </section>
        <LeadershipSection leaders={displayLeaders} />
        <section id="news-updates">
          <SectionGrid
            title="News & Updates"
            eyebrow="Latest"
            intro="Announcements, reports, and updates from the Plateau Lawyers Bar Forum."
            items={displayNews.map((item) => {
              const entry = item as NewsItem & { category?: string; excerpt?: string; content?: string };
              return {
                title: entry.title,
                subtitle: entry.category || 'Update',
                description: entry.excerpt || entry.content || 'Latest updates from PLBF.'
              };
            })}
          />
        </section>
        <MembershipSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
