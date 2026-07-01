"use client";

import { useEffect, useState } from 'react';
import { supabase, uploadImage } from '@/lib/supabase';
import type { Trustee, Leader, EventItem, NewsItem, Programme } from '@/types/content';

type FileSetter = (value: (prev: any) => any) => void;

export default function AdminPage() {
  const [trustees, setTrustees] = useState<Trustee[]>([]);
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);

  const [trusteeForm, setTrusteeForm] = useState({ name: '', position: '', bio: '', image: '' });
  const [leaderForm, setLeaderForm] = useState({ name: '', position: '', image: '' });
  const [eventForm, setEventForm] = useState({ title: '', date: '', category: '', location: '', description: '', image: '' });
  const [newsForm, setNewsForm] = useState({ title: '', date: '', category: '', excerpt: '', content: '', image: '' });
  const [programmeForm, setProgrammeForm] = useState({ title: '', icon: 'mdi:gavel', description: '' });

  const loadData = async () => {
    setLoading(true);
    try {
      const [{ data: trusteesData, error: trusteesError }, { data: leadersData, error: leadersError }, { data: eventsData, error: eventsError }, { data: newsData, error: newsError }, { data: programmesData, error: programmesError }] = await Promise.all([
        supabase.from('trustees').select('*').order('display_order', { ascending: true }),
        supabase.from('leaders').select('*').order('display_order', { ascending: true }),
        supabase.from('events').select('*').order('date', { ascending: false }),
        supabase.from('news').select('*').order('date', { ascending: false }),
        supabase.from('programmes').select('*')
      ]);

      if (trusteesError || leadersError || eventsError || newsError || programmesError) {
        throw new Error('Unable to load data from Supabase');
      }

      setTrustees((trusteesData as Trustee[]) || []);
      setLeaders((leadersData as Leader[]) || []);
      setEvents((eventsData as EventItem[]) || []);
      setNews((newsData as NewsItem[]) || []);
      setProgrammes((programmesData as Programme[]) || []);
    } catch {
      setTrustees([]);
      setLeaders([]);
      setEvents([]);
      setNews([]);
      setProgrammes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTrusteeSave = async () => {
    const { error } = await supabase.from('trustees').insert([{ ...trusteeForm, display_order: trustees.length + 1 }]);
    if (!error) {
      setTrusteeForm({ name: '', position: '', bio: '', image: '' });
      loadData();
    }
  };

  const handleLeaderSave = async () => {
    const { error } = await supabase.from('leaders').insert([{ ...leaderForm, display_order: leaders.length + 1 }]);
    if (!error) {
      setLeaderForm({ name: '', position: '', image: '' });
      loadData();
    }
  };

  const handleEventSave = async () => {
    const { error } = await supabase.from('events').insert([{ ...eventForm }]);
    if (!error) {
      setEventForm({ title: '', date: '', category: '', location: '', description: '', image: '' });
      loadData();
    }
  };

  const handleNewsSave = async () => {
    const { error } = await supabase.from('news').insert([{ ...newsForm }]);
    if (!error) {
      setNewsForm({ title: '', date: '', category: '', excerpt: '', content: '', image: '' });
      loadData();
    }
  };

  const handleProgrammeSave = async () => {
    const { error } = await supabase.from('programmes').insert([{ ...programmeForm }]);
    if (!error) {
      setProgrammeForm({ title: '', icon: 'mdi:gavel', description: '' });
      loadData();
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, setter: FileSetter) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file, 'uploads');
    if (url) {
      setter((prev: any) => ({ ...prev, image: url }));
    }
  };

  const stats = [
    { label: 'Events', value: events.length, icon: 'E' },
    { label: 'Leaders', value: leaders.length, icon: 'L' },
    { label: 'Programmes', value: programmes.length, icon: 'P' },
    { label: 'Trustees', value: trustees.length, icon: 'T' },
    { label: 'News', value: news.length, icon: 'N' }
  ];

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <a className="admin-logo" href="/">
          <img src="/images/Logo.jpg" alt="PLBF logo" />
          <span>
            Plateau Lawyers
            <br />
            <strong>Bar Forum</strong>
          </span>
        </a>

        <nav className="admin-nav" aria-label="Admin sections">
          <a className="active" href="#admin-dashboard">Dashboard</a>
          <a href="#admin-trustees">Trustees</a>
          <a href="#admin-leaders">Leadership</a>
          <a href="#admin-events">Events</a>
          <a href="#admin-news">News</a>
          <a href="#admin-programmes">Programmes</a>
        </nav>

        <div className="admin-sidebar-footer">
          <a className="admin-view-site" href="/">View Website</a>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <span className="admin-page-title">Dashboard</span>
          <div className="admin-user">
            <span>Administrator</span>
            <span className="admin-avatar">AD</span>
          </div>
        </header>

        <div className="admin-content">
          <section id="admin-dashboard" className="admin-hero">
            <h1>Admin Dashboard</h1>
            <p>Manage trustees, leadership, events, news, and programmes for the Plateau Lawyers Bar Forum website.</p>
          </section>

          {loading ? <p className="loading-note">Loading content...</p> : null}

          <section className="stats-grid" aria-label="Content summary">
            {stats.map((stat) => (
              <article className="stat-card" key={stat.label}>
                <div className="stat-icon" aria-hidden="true">{stat.icon}</div>
                <div>
                  <div className="stat-number">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </article>
            ))}
          </section>

          <div className="admin-grid">
            <section id="admin-trustees" className="admin-panel">
              <div className="panel-header">
                <h2>Board of Trustees</h2>
              </div>
              <div className="panel-body">
                <div className="admin-form">
                  <div className="form-group">
                    <label htmlFor="trustee-name">Name</label>
                    <input id="trustee-name" value={trusteeForm.name} onChange={(e) => setTrusteeForm({ ...trusteeForm, name: e.target.value })} placeholder="Full name" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="trustee-position">Position</label>
                    <input id="trustee-position" value={trusteeForm.position} onChange={(e) => setTrusteeForm({ ...trusteeForm, position: e.target.value })} placeholder="Position" />
                  </div>
                  <div className="form-group full">
                    <label htmlFor="trustee-bio">Short Bio</label>
                    <textarea id="trustee-bio" value={trusteeForm.bio} onChange={(e) => setTrusteeForm({ ...trusteeForm, bio: e.target.value })} placeholder="Brief description" />
                  </div>
                  <div className="form-group full">
                    <label htmlFor="trustee-file">Photo</label>
                    <input id="trustee-file" type="file" onChange={(e) => handleFileUpload(e, setTrusteeForm)} />
                  </div>
                  <div className="form-actions">
                    <button className="btn btn-gold" type="button" onClick={handleTrusteeSave}>Add Trustee</button>
                  </div>
                </div>
              </div>
              <AdminTable
                headings={['Name', 'Position']}
                emptyText="No trustees added yet."
                rows={trustees.map((item) => [item.name, item.position])}
              />
            </section>

            <section id="admin-leaders" className="admin-panel">
              <div className="panel-header">
                <h2>Leadership</h2>
              </div>
              <div className="panel-body">
                <div className="admin-form">
                  <div className="form-group">
                    <label htmlFor="leader-name">Name</label>
                    <input id="leader-name" value={leaderForm.name} onChange={(e) => setLeaderForm({ ...leaderForm, name: e.target.value })} placeholder="Full name" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="leader-position">Position</label>
                    <input id="leader-position" value={leaderForm.position} onChange={(e) => setLeaderForm({ ...leaderForm, position: e.target.value })} placeholder="Position" />
                  </div>
                  <div className="form-group full">
                    <label htmlFor="leader-file">Photo</label>
                    <input id="leader-file" type="file" onChange={(e) => handleFileUpload(e, setLeaderForm)} />
                  </div>
                  <div className="form-actions">
                    <button className="btn btn-gold" type="button" onClick={handleLeaderSave}>Add Leader</button>
                  </div>
                </div>
              </div>
              <AdminTable
                headings={['Name', 'Position']}
                emptyText="No leaders added yet."
                rows={leaders.map((item) => [item.name, item.position])}
              />
            </section>

            <section id="admin-events" className="admin-panel wide">
              <div className="panel-header">
                <h2>Events</h2>
              </div>
              <div className="panel-body">
                <div className="admin-form">
                  <div className="form-group">
                    <label htmlFor="event-title">Title</label>
                    <input id="event-title" value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} placeholder="Event title" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="event-date">Date</label>
                    <input id="event-date" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} placeholder="Date" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="event-category">Category</label>
                    <input id="event-category" value={eventForm.category} onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })} placeholder="Category" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="event-location">Location</label>
                    <input id="event-location" value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} placeholder="Location" />
                  </div>
                  <div className="form-group full">
                    <label htmlFor="event-description">Description</label>
                    <textarea id="event-description" value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} placeholder="Brief description" />
                  </div>
                  <div className="form-group full">
                    <label htmlFor="event-file">Image</label>
                    <input id="event-file" type="file" onChange={(e) => handleFileUpload(e, setEventForm)} />
                  </div>
                  <div className="form-actions">
                    <button className="btn btn-gold" type="button" onClick={handleEventSave}>Add Event</button>
                  </div>
                </div>
              </div>
              <AdminTable
                headings={['Title', 'Date', 'Location', 'Category']}
                emptyText="No events added yet."
                rows={events.map((item) => [item.title, item.date, item.location, item.category])}
                badgeColumn={3}
              />
            </section>

            <section id="admin-news" className="admin-panel wide">
              <div className="panel-header">
                <h2>News</h2>
              </div>
              <div className="panel-body">
                <div className="admin-form">
                  <div className="form-group">
                    <label htmlFor="news-title">Title</label>
                    <input id="news-title" value={newsForm.title} onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })} placeholder="News title" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="news-date">Date</label>
                    <input id="news-date" value={newsForm.date} onChange={(e) => setNewsForm({ ...newsForm, date: e.target.value })} placeholder="Date" />
                  </div>
                  <div className="form-group full">
                    <label htmlFor="news-category">Category</label>
                    <input id="news-category" value={newsForm.category} onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })} placeholder="Category" />
                  </div>
                  <div className="form-group full">
                    <label htmlFor="news-excerpt">Excerpt</label>
                    <textarea id="news-excerpt" value={newsForm.excerpt} onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })} placeholder="Short summary" />
                  </div>
                  <div className="form-group full">
                    <label htmlFor="news-content">Content</label>
                    <textarea id="news-content" value={newsForm.content} onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })} placeholder="Full article" />
                  </div>
                  <div className="form-group full">
                    <label htmlFor="news-file">Image</label>
                    <input id="news-file" type="file" onChange={(e) => handleFileUpload(e, setNewsForm)} />
                  </div>
                  <div className="form-actions">
                    <button className="btn btn-gold" type="button" onClick={handleNewsSave}>Add News</button>
                  </div>
                </div>
              </div>
              <AdminTable
                headings={['Title', 'Date', 'Category']}
                emptyText="No news added yet."
                rows={news.map((item) => [item.title, item.date, item.category])}
                badgeColumn={2}
              />
            </section>

            <section id="admin-programmes" className="admin-panel wide">
              <div className="panel-header">
                <h2>Programmes</h2>
              </div>
              <div className="panel-body">
                <div className="admin-form">
                  <div className="form-group">
                    <label htmlFor="programme-title">Title</label>
                    <input id="programme-title" value={programmeForm.title} onChange={(e) => setProgrammeForm({ ...programmeForm, title: e.target.value })} placeholder="Programme title" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="programme-icon">Icon</label>
                    <input id="programme-icon" value={programmeForm.icon} onChange={(e) => setProgrammeForm({ ...programmeForm, icon: e.target.value })} placeholder="Icon name" />
                  </div>
                  <div className="form-group full">
                    <label htmlFor="programme-description">Description</label>
                    <textarea id="programme-description" value={programmeForm.description} onChange={(e) => setProgrammeForm({ ...programmeForm, description: e.target.value })} placeholder="Programme description" />
                  </div>
                  <div className="form-actions">
                    <button className="btn btn-gold" type="button" onClick={handleProgrammeSave}>Add Programme</button>
                  </div>
                </div>
              </div>
              <AdminTable
                headings={['Title', 'Description']}
                emptyText="No programmes added yet."
                rows={programmes.map((item) => [item.title, item.description])}
              />
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

function AdminTable({ headings, rows, emptyText, badgeColumn }: { headings: string[]; rows: string[][]; emptyText: string; badgeColumn?: number }) {
  if (!rows.length) {
    return <div className="empty-state">{emptyText}</div>;
  }

  return (
    <div className="table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            {headings.map((heading) => (
              <th key={heading}>{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`${row[0]}-${rowIndex}`}>
              {row.map((cell, cellIndex) => (
                <td key={`${cell}-${cellIndex}`}>
                  {badgeColumn === cellIndex ? <span className="table-badge">{cell || 'Update'}</span> : cell || 'Not set'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
