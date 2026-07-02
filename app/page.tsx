'use client';

import { useEffect, useState } from 'react';
import HeroSection from '@/components/HeroSection';
import Navbar from '@/components/Navbar';
import SectionGrid from '@/components/SectionGrid';
import SectionHeading from '@/components/SectionHeading';
import LeadershipSection from '@/components/LeadershipSection';
import GallerySection from '@/components/GallerySection';
import VideosSection from '@/components/VideosSection';
import MembershipSection from '@/components/MembershipSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { resolveHeading } from '@/lib/sectionHeadings';
import type { Trustee, Leader, EventItem, NewsItem, GalleryItem, VideoItem, SectionHeading as SectionHeadingType } from '@/types/content';

export default function HomePage() {
  const [trustees, setTrustees] = useState<Trustee[]>([]);
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [sectionHeadings, setSectionHeadings] = useState<SectionHeadingType[]>([]);

  useEffect(() => {
    const loadContent = async () => {
      const [
        { data: trusteesData },
        { data: leadersData },
        { data: eventsData },
        { data: newsData },
        { data: galleryData },
        { data: videosData },
        { data: headingsData }
      ] = await Promise.all([
        supabase.from('trustees').select('*').order('display_order', { ascending: true }).limit(6),
        supabase.from('leaders').select('*').order('display_order', { ascending: true }).limit(6),
        supabase.from('events').select('*').order('date', { ascending: false }).limit(6),
        supabase.from('news').select('*').order('date', { ascending: false }).limit(6),
        supabase.from('gallery_items').select('*').order('display_order', { ascending: true }).limit(12),
        supabase.from('videos').select('*').order('display_order', { ascending: true }).limit(6),
        supabase.from('section_headings').select('*')
      ]);

      setTrustees((trusteesData as Trustee[]) || []);
      setLeaders((leadersData as Leader[]) || []);
      setEvents((eventsData as EventItem[]) || []);
      setNews((newsData as NewsItem[]) || []);
      setGallery((galleryData as GalleryItem[]) || []);
      setVideos((videosData as VideoItem[]) || []);
      setSectionHeadings((headingsData as SectionHeadingType[]) || []);
    };

    loadContent();
  }, []);

  const heading = (key: string) => resolveHeading(key, sectionHeadings);

  const fallbackTrustees = [
    { name: 'Chief A. B. D. Jang', position: 'Chairman', image: '/images/Logo.jpg', bio: 'Guiding the forum with strategic leadership and legal insight.' },
    { name: 'Barr. M. C. Pam', position: 'Vice Chairman', image: '/images/Logo.jpg', bio: 'Supporting members and strengthening institutional growth.' },
    { name: 'Barr. I. S. Dalyop', position: 'Secretary', image: '/images/Logo.jpg', bio: 'Coordinating policy, engagement, and administration.' }
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
    { title: 'Annual General Meeting', date: '12 Aug 2026 - Jos', image: '/images/gavel.jpg', description: 'Conference' },
    { title: 'Free Legal Clinic', date: '20 Sep 2026 - Bassa', image: '/images/gavel.jpg', description: 'Outreach' },
    { title: 'Leadership Roundtable', date: '03 Oct 2026 - Abuja', image: '/images/gavel.jpg', description: 'Forum' }
  ];

  const fallbackNews = [
    { title: 'PLBF Launches New Membership Drive', category: 'Membership', image: '/images/gavel.jpg', excerpt: 'The forum is welcoming new members to strengthen legal advocacy.' },
    { title: 'Youth Legal Awareness Programme Announced', category: 'Outreach', image: '/images/gavel.jpg', excerpt: 'A new programme focused on civic education and legal access.' },
    { title: 'Panel Discussion on Access to Justice', category: 'Event', image: '/images/gavel.jpg', excerpt: 'A forthcoming conversation on building fairer legal systems.' }
  ];

  const governanceItems = [
    { title: 'Constitution', description: "The forum's constitution provides governance principles, membership rules, and operational structure." },
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
          <SectionHeading
            eyebrow={heading('about').eyebrow}
            title={heading('about').title}
            intro={heading('about').intro}
          />
        </section>

        <section id="governance">
          <SectionGrid
            title={heading('governance').title}
            eyebrow={heading('governance').eyebrow}
            intro={heading('governance').intro}
            items={governanceItems}
          />
        </section>

        <LeadershipSection leaders={displayLeaders} heading={heading('leadership')} />

        <section id="services">
          <SectionGrid
            title={heading('programmes').title}
            eyebrow={heading('programmes').eyebrow}
            intro={heading('programmes').intro}
            items={fallbackProgrammes}
          />
        </section>

        <section className="quote-section" aria-label="Guiding principle">
          <div className="quote-inner">
            <span className="quote-mark" aria-hidden="true">"</span>
            <blockquote>
              Where there is no rule of law, there is no freedom. Where there is no justice, there can be no peace.
            </blockquote>
            <div className="quote-rule" />
            <p>Our Guiding Principle</p>
          </div>
        </section>

        <section id="events">
          <SectionGrid
            title={heading('events').title}
            eyebrow={heading('events').eyebrow}
            intro={heading('events').intro}
            items={displayEvents.map((item) => ({
              title: item.title,
              subtitle: item.date,
              image: item.image || '/images/gavel.jpg',
              description: item.description || 'Upcoming event'
            }))}
            tone="white"
            variant="media"
          />
        </section>

        <section id="trustees">
          <SectionGrid
            title={heading('trustees').title}
            eyebrow={heading('trustees').eyebrow}
            intro={heading('trustees').intro}
            items={displayTrustees.map((item) => ({
              title: item.name,
              subtitle: item.position,
              image: item.image || '/images/Logo.jpg',
              description: item.bio || 'Community leadership and legal service.'
            }))}
            variant="profile"
          />
        </section>

        <section id="news-updates">
          <SectionGrid
            title={heading('news').title}
            eyebrow={heading('news').eyebrow}
            intro={heading('news').intro}
            items={displayNews.map((item) => {
              const entry = item as NewsItem & { category?: string; excerpt?: string; content?: string };
              return {
                title: entry.title,
                subtitle: entry.category || 'Update',
                image: entry.image || '/images/gavel.jpg',
                description: entry.excerpt || entry.content || 'Latest updates from PLBF.'
              };
            })}
            variant="media"
          />
        </section>

        <GallerySection items={gallery} heading={heading('gallery')} />
        <VideosSection items={videos} heading={heading('videos')} />

        <MembershipSection heading={heading('membership')} />
        <ContactSection heading={heading('contact')} />
      </main>
      <Footer />
    </>
  );
}
