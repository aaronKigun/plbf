'use client';

import { useEffect, useState } from 'react';
import HeroSection from '@/components/HeroSection';
import Navbar from '@/components/Navbar';
import MarqueeSection from '@/components/MarqueeSection';
import SectionGrid from '@/components/SectionGrid';
import SectionHeading from '@/components/SectionHeading';
import LeadershipSection from '@/components/LeadershipSection';
import GallerySection from '@/components/GallerySection';
import VideosSection from '@/components/VideosSection';
import MembershipSection from '@/components/MembershipSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import CustomCursor from '@/components/CustomCursor';
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
        supabase.from('trustees').select('*').order('display_order', { ascending: true }),
        supabase.from('leaders').select('*').order('display_order', { ascending: true }),
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
    { name: 'Chief A. B. D. Jang', position: 'Chairman', image: '', bio: 'Guiding the forum with strategic leadership and legal insight.' },
    { name: 'Barr. M. C. Pam', position: 'Vice Chairman', image: '', bio: 'Supporting members and strengthening institutional growth.' },
    { name: 'Barr. I. S. Dalyop', position: 'Secretary', image: '', bio: 'Coordinating policy, engagement, and administration.' }
  ];

  const fallbackLeaders = [
    { name: 'Barr. Chambers C. Dabwan', position: 'Chairman', image: '' },
    { name: 'Barr. M. C. Pam', position: 'Vice Chairman', image: '' },
    { name: 'Barr. I. S. Dalyop', position: 'Secretary', image: '' }
  ];

  const fallbackProgrammes = [
    { title: 'Legal Aid/Defence of Human Rights', description: 'Giving the Citizens access to justice.' },
    { title: 'Judicial Reform', description: 'Ensuring that the Judiciary remains the last hope of the common man.' },
    { title: 'Professional Development', description: 'Continuing legal education and mentorship.' }
  ];

  const fallbackEvents = [
    { title: 'Annual General Meeting', date: '12 Aug 2026 - Jos', image: '', description: 'Conference' },
    { title: 'Free Legal Clinic', date: '20 Sep 2026 - Bassa', image: '', description: 'Outreach' },
    { title: 'Leadership Roundtable', date: '03 Oct 2026 - Abuja', image: '', description: 'Forum' }
  ];

  const fallbackNews = [
    { title: 'PLBF Launches New Membership Drive', category: 'Membership', image: '', excerpt: 'The forum is welcoming new members to strengthen legal advocacy.' },
    { title: 'Youth Legal Awareness Programme Announced', category: 'Outreach', image: '', excerpt: 'A new programme focused on civic education and legal access.' },
    { title: 'Panel Discussion on Access to Justice', category: 'Event', image: '', excerpt: 'A forthcoming conversation on building fairer legal systems.' }
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
    <div className="plbf-site">
      <CustomCursor />
      <div className="noise-overlay" aria-hidden="true" />
      <Navbar />
      <main>
        <HeroSection
          title="Plateau Lawyers Bar Forum"
          subtitle="A united body of legal practitioners committed to rule of law, human rights, and the advancement of justice."
          description="PLBF is a non-partisan association of legal practitioners working to promote professional excellence, legal education, and public welfare."
        />

        <MarqueeSection />

        <section id="about" className="site-section about-section">
          <div className="orb orb-navy about-orb" aria-hidden="true" />
          <div className="site-container about-layout">
            <Reveal className="about-copy">
              <SectionHeading
                eyebrow={heading('about').eyebrow}
                title={heading('about').title}
                intro={heading('about').intro}
                centered={false}
                sectionNum="01"
              />
              <div className="gold-line about-rule" aria-hidden="true" />
            </Reveal>
          </div>
        </section>

        <SectionGrid
          id="governance"
          title={heading('governance').title}
          eyebrow={heading('governance').eyebrow}
          intro={heading('governance').intro}
          items={governanceItems}
          variant="governance"
          sectionNum="02"
        />

        <LeadershipSection leaders={displayLeaders} heading={heading('leadership')} />

        <SectionGrid
          id="services"
          title={heading('programmes').title}
          eyebrow={heading('programmes').eyebrow}
          intro={heading('programmes').intro}
          items={fallbackProgrammes}
          variant="governance"
          sectionNum="04"
        />

        <section className="quote-section" aria-label="Guiding principle">
          <div className="gold-line" aria-hidden="true" />
          <div className="site-container quote-inner">
            <Reveal>
              <span className="quote-mark" aria-hidden="true">&ldquo;</span>
              <blockquote>
                Where there is no rule of law, there is no freedom. Where there is no justice, there can be no peace.
              </blockquote>
              <div className="gold-line quote-rule" aria-hidden="true" />
              <cite>Our Guiding Principle</cite>
            </Reveal>
          </div>
          <div className="gold-line" aria-hidden="true" />
        </section>

        <SectionGrid
          id="events"
          title={heading('events').title}
          eyebrow={heading('events').eyebrow}
          intro={heading('events').intro}
          items={displayEvents.map((item) => ({
            title: item.title,
            subtitle: item.date,
            image: item.image || undefined,
            description: item.description || 'Upcoming event'
          }))}
          variant="media"
          sectionNum="05"
        />

        <SectionGrid
          id="trustees"
          title={heading('trustees').title}
          titleHighlight={heading('trustees').title_highlight}
          eyebrow={heading('trustees').eyebrow}
          intro={heading('trustees').intro}
          items={displayTrustees.map((item) => ({
            title: item.name,
            subtitle: item.position,
            image: item.image || undefined,
            description: item.bio || ''
          }))}
          variant="profile"
          sectionNum="06"
        />

        <SectionGrid
          id="news-updates"
          title={heading('news').title}
          titleHighlight={heading('news').title_highlight}
          eyebrow={heading('news').eyebrow}
          intro={heading('news').intro}
          items={displayNews.map((item) => {
            const entry = item as NewsItem & { category?: string; excerpt?: string; content?: string };
            return {
              title: entry.title,
              subtitle: entry.category || 'Update',
              image: entry.image || undefined,
              description: entry.excerpt || entry.content || 'Latest updates from PLBF.'
            };
          })}
          variant="media"
          sectionNum="07"
        />

        <GallerySection items={gallery} heading={heading('gallery')} />
        <VideosSection items={videos} heading={heading('videos')} />
        <MembershipSection heading={heading('membership')} />
        <ContactSection heading={heading('contact')} />
      </main>
      <Footer />
    </div>
  );
}
