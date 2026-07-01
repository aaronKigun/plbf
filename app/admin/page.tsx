"use client";

import { useEffect, useState } from 'react';
import { supabase, uploadImage } from '@/lib/supabase';
import type { Trustee, Leader, EventItem, NewsItem, Programme } from '@/types/content';

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
    const [{ data: trusteesData }, { data: leadersData }, { data: eventsData }, { data: newsData }, { data: programmesData }] = await Promise.all([
      supabase.from('trustees').select('*').order('display_order', { ascending: true }),
      supabase.from('leaders').select('*').order('display_order', { ascending: true }),
      supabase.from('events').select('*').order('date', { ascending: false }),
      supabase.from('news').select('*').order('date', { ascending: false }),
      supabase.from('programmes').select('*')
    ]);

    setTrustees((trusteesData as Trustee[]) || []);
    setLeaders((leadersData as Leader[]) || []);
    setEvents((eventsData as EventItem[]) || []);
    setNews((newsData as NewsItem[]) || []);
    setProgrammes((programmesData as Programme[]) || []);
    setLoading(false);
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, setter: (value: any) => void) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file, 'uploads');
    if (url) {
      setter((prev: any) => ({ ...prev, image: url }));
    }
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Admin Dashboard</h1>
      <p>Manage trustees, leadership, events, news, and programmes.</p>
      {loading ? <p>Loading...</p> : null}

      <section style={{ marginTop: '2rem' }}>
        <h2>Trustees</h2>
        <input value={trusteeForm.name} onChange={(e) => setTrusteeForm({ ...trusteeForm, name: e.target.value })} placeholder="Name" />
        <input value={trusteeForm.position} onChange={(e) => setTrusteeForm({ ...trusteeForm, position: e.target.value })} placeholder="Position" />
        <textarea value={trusteeForm.bio} onChange={(e) => setTrusteeForm({ ...trusteeForm, bio: e.target.value })} placeholder="Bio" />
        <input type="file" onChange={(e) => handleFileUpload(e, (value) => setTrusteeForm((prev) => ({ ...prev, ...value })))} />
        <button onClick={handleTrusteeSave}>Add Trustee</button>
        <ul>{trustees.map((item) => <li key={item.name}>{item.name} — {item.position}</li>)}</ul>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Leadership</h2>
        <input value={leaderForm.name} onChange={(e) => setLeaderForm({ ...leaderForm, name: e.target.value })} placeholder="Name" />
        <input value={leaderForm.position} onChange={(e) => setLeaderForm({ ...leaderForm, position: e.target.value })} placeholder="Position" />
        <input type="file" onChange={(e) => handleFileUpload(e, (value) => setLeaderForm((prev) => ({ ...prev, ...value })))} />
        <button onClick={handleLeaderSave}>Add Leader</button>
        <ul>{leaders.map((item) => <li key={item.name}>{item.name} — {item.position}</li>)}</ul>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Events</h2>
        <input value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} placeholder="Title" />
        <input value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} placeholder="Date" />
        <input value={eventForm.category} onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })} placeholder="Category" />
        <input value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} placeholder="Location" />
        <textarea value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} placeholder="Description" />
        <input type="file" onChange={(e) => handleFileUpload(e, (value) => setEventForm((prev) => ({ ...prev, ...value })))} />
        <button onClick={handleEventSave}>Add Event</button>
        <ul>{events.map((item) => <li key={item.title}>{item.title} — {item.date}</li>)}</ul>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>News</h2>
        <input value={newsForm.title} onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })} placeholder="Title" />
        <input value={newsForm.date} onChange={(e) => setNewsForm({ ...newsForm, date: e.target.value })} placeholder="Date" />
        <input value={newsForm.category} onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })} placeholder="Category" />
        <textarea value={newsForm.excerpt} onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })} placeholder="Excerpt" />
        <textarea value={newsForm.content} onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })} placeholder="Content" />
        <input type="file" onChange={(e) => handleFileUpload(e, (value) => setNewsForm((prev) => ({ ...prev, ...value })))} />
        <button onClick={handleNewsSave}>Add News</button>
        <ul>{news.map((item) => <li key={item.title}>{item.title} — {item.category}</li>)}</ul>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Programmes</h2>
        <input value={programmeForm.title} onChange={(e) => setProgrammeForm({ ...programmeForm, title: e.target.value })} placeholder="Title" />
        <input value={programmeForm.icon} onChange={(e) => setProgrammeForm({ ...programmeForm, icon: e.target.value })} placeholder="Icon" />
        <textarea value={programmeForm.description} onChange={(e) => setProgrammeForm({ ...programmeForm, description: e.target.value })} placeholder="Description" />
        <button onClick={handleProgrammeSave}>Add Programme</button>
        <ul>{programmes.map((item) => <li key={item.title}>{item.title}</li>)}</ul>
      </section>
    </main>
  );
}
