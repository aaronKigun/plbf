"use client";

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, uploadImage } from '@/lib/supabase';
import type { Trustee, Leader, EventItem, NewsItem, GalleryItem, VideoItem, Member, ContactMessage } from '@/types/content';

type FileSetter = (value: (prev: any) => any) => void;

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginMessage, setLoginMessage] = useState('');

  const [trustees, setTrustees] = useState<Trustee[]>([]);
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  const [isNoticeError, setIsNoticeError] = useState(false);

  const showNotice = (message: string, isError: boolean = false) => {
    setNotice(message);
    setIsNoticeError(isError);
  };

  const [trusteeForm, setTrusteeForm] = useState({ name: '', position: '', bio: '', image: '' });
  const [leaderForm, setLeaderForm] = useState({ name: '', position: '', image: '' });
  const [eventForm, setEventForm] = useState({ title: '', date: '', category: '', location: '', description: '', image: '' });
  const [newsForm, setNewsForm] = useState({ title: '', date: '', category: '', excerpt: '', content: '', image: '' });
  const [galleryForm, setGalleryForm] = useState({ title: '', image: '', caption: '' });
  const [videoForm, setVideoForm] = useState({ title: '', url: '', description: '' });
  const [settingsForm, setSettingsForm] = useState({ email: '', password: '', adminName: '', adminEmail: '', adminPassword: '' });

  const [editingTrusteeId, setEditingTrusteeId] = useState<number | null>(null);
  const [editingLeaderId, setEditingLeaderId] = useState<number | null>(null);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [editingNewsId, setEditingNewsId] = useState<number | null>(null);
  const [editingGalleryId, setEditingGalleryId] = useState<number | null>(null);
  const [editingVideoId, setEditingVideoId] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    const [trusteesResult, leadersResult, eventsResult, newsResult, galleryResult, videosResult, membersResult, messagesResult] = await Promise.all([
      supabase.from('trustees').select('*').order('display_order', { ascending: true }),
      supabase.from('leaders').select('*').order('display_order', { ascending: true }),
      supabase.from('events').select('*').order('date', { ascending: false }),
      supabase.from('news').select('*').order('date', { ascending: false }),
      supabase.from('gallery_items').select('*').order('display_order', { ascending: true }),
      supabase.from('videos').select('*').order('display_order', { ascending: true }),
      supabase.from('members').select('*').order('created_at', { ascending: false }),
      supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
    ]);

    setTrustees((trusteesResult.data as Trustee[]) || []);
    setLeaders((leadersResult.data as Leader[]) || []);
    setEvents((eventsResult.data as EventItem[]) || []);
    setNews((newsResult.data as NewsItem[]) || []);
    setGallery((galleryResult.data as GalleryItem[]) || []);
    setVideos((videosResult.data as VideoItem[]) || []);
    setMembers((membersResult.data as Member[]) || []);
    setMessages((messagesResult.data as ContactMessage[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        setSession(data.session);
        setSettingsForm((current) => ({ ...current, email: data.session?.user.email || '' }));
        if (data.session) loadData();
      } catch (error) {
        console.error('Supabase auth initialization failed:', error);
      } finally {
        setAuthLoading(false);
      }
    };

    initAuth();

    const { data: subscriptionData } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setSettingsForm((current) => ({ ...current, email: nextSession?.user.email || current.email }));
      if (nextSession) loadData();
    });

    return () => subscriptionData.subscription.unsubscribe();
  }, []);

  const signIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginMessage('');
    const { data, error } = await supabase.auth.signInWithPassword(loginForm);
    if (error) {
      setLoginMessage(error.message);
      return;
    }
    setSession(data.session);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  const handleTrusteeSave = async () => {
    showNotice('');
    const { error } = editingTrusteeId
      ? await supabase.from('trustees').update({ ...trusteeForm }).eq('id', editingTrusteeId)
      : await supabase.from('trustees').insert([{ ...trusteeForm, display_order: trustees.length + 1 }]);
    if (error) {
      showNotice(error.message, true);
    } else {
      showNotice(editingTrusteeId ? 'Trustee updated successfully.' : 'Trustee added successfully.');
      setTrusteeForm({ name: '', position: '', bio: '', image: '' });
      setEditingTrusteeId(null);
      loadData();
    }
  };

  const handleLeaderSave = async () => {
    showNotice('');
    const { error } = editingLeaderId
      ? await supabase.from('leaders').update({ ...leaderForm }).eq('id', editingLeaderId)
      : await supabase.from('leaders').insert([{ ...leaderForm, display_order: leaders.length + 1 }]);
    if (error) {
      showNotice(error.message, true);
    } else {
      showNotice(editingLeaderId ? 'Leader updated successfully.' : 'Leader added successfully.');
      setLeaderForm({ name: '', position: '', image: '' });
      setEditingLeaderId(null);
      loadData();
    }
  };

  const handleEventSave = async () => {
    showNotice('');
    const { error } = editingEventId
      ? await supabase.from('events').update({ ...eventForm }).eq('id', editingEventId)
      : await supabase.from('events').insert([{ ...eventForm }]);
    if (error) {
      showNotice(error.message, true);
    } else {
      showNotice(editingEventId ? 'Event updated successfully.' : 'Event added successfully.');
      setEventForm({ title: '', date: '', category: '', location: '', description: '', image: '' });
      setEditingEventId(null);
      loadData();
    }
  };

  const handleNewsSave = async () => {
    showNotice('');
    const { error } = editingNewsId
      ? await supabase.from('news').update({ ...newsForm }).eq('id', editingNewsId)
      : await supabase.from('news').insert([{ ...newsForm }]);
    if (error) {
      showNotice(error.message, true);
    } else {
      showNotice(editingNewsId ? 'News item updated successfully.' : 'News item added successfully.');
      setNewsForm({ title: '', date: '', category: '', excerpt: '', content: '', image: '' });
      setEditingNewsId(null);
      loadData();
    }
  };

  const handleGallerySave = async () => {
    showNotice('');
    if (!galleryForm.image) {
      showNotice('Please upload an image before saving.', true);
      return;
    }
    const { error } = editingGalleryId
      ? await supabase.from('gallery_items').update({ ...galleryForm }).eq('id', editingGalleryId)
      : await supabase.from('gallery_items').insert([{ ...galleryForm, display_order: gallery.length + 1 }]);
    if (error) {
      showNotice(error.message, true);
    } else {
      showNotice(editingGalleryId ? 'Gallery item updated successfully.' : 'Gallery item added successfully.');
      setGalleryForm({ title: '', image: '', caption: '' });
      setEditingGalleryId(null);
      loadData();
    }
  };

  const handleVideoSave = async () => {
    showNotice('');
    const { error } = editingVideoId
      ? await supabase.from('videos').update({ ...videoForm }).eq('id', editingVideoId)
      : await supabase.from('videos').insert([{ ...videoForm, display_order: videos.length + 1 }]);
    if (error) {
      showNotice(error.message, true);
    } else {
      showNotice(editingVideoId ? 'Video updated successfully.' : 'Video added successfully.');
      setVideoForm({ title: '', url: '', description: '' });
      setEditingVideoId(null);
      loadData();
    }
  };

  const deleteRecord = async (table: string, id: number, label: string, onDone: () => void) => {
    if (!window.confirm(`Delete this ${label}?`)) return;
    showNotice('');
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) {
      showNotice(error.message, true);
    } else {
      showNotice(`${label} deleted successfully.`);
      onDone();
      loadData();
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, setter: FileSetter) => {
    const file = event.target.files?.[0];
    if (!file) return;
    showNotice('Uploading image...');
    try {
      const url = await uploadImage(file, 'uploads');
      if (!url) {
        showNotice('Image upload failed. Please try again.', true);
        return;
      }
      setter((prev: any) => ({ ...prev, image: url }));
      showNotice('Image uploaded. Click the Add/Update button to save your changes.');
    } catch (error: any) {
      showNotice(`Image upload failed: ${error?.message || 'ensure the "images" storage bucket exists and is public.'}`, true);
      event.target.value = '';
    }
  };

  const updateAdminEmail = async () => {
    showNotice('');
    const { error } = await supabase.auth.updateUser({ email: settingsForm.email });
    if (error) {
      showNotice(error.message, true);
    } else {
      showNotice('Email update requested. Check the new email inbox if confirmation is required.');
    }
  };

  const updateAdminPassword = async () => {
    showNotice('');
    const { error } = await supabase.auth.updateUser({ password: settingsForm.password });
    if (error) {
      showNotice(error.message, true);
    } else {
      showNotice('Password updated successfully.');
      setSettingsForm((current) => ({ ...current, password: '' }));
    }
  };

  const addAdmin = async () => {
    showNotice('');
    const currentSession = session;
    const { error } = await supabase.auth.signUp({
      email: settingsForm.adminEmail,
      password: settingsForm.adminPassword,
      options: { data: { name: settingsForm.adminName, role: 'admin' } }
    });

    if (currentSession?.access_token && currentSession.refresh_token) {
      await supabase.auth.setSession({
        access_token: currentSession.access_token,
        refresh_token: currentSession.refresh_token
      });
    }

    if (error) {
      showNotice(error.message, true);
    } else {
      showNotice('Admin account created. Confirmation may be required depending on Supabase settings.');
      setSettingsForm((current) => ({ ...current, adminName: '', adminEmail: '', adminPassword: '' }));
    }
  };

  const stats = [
    { label: 'Events', value: events.length, icon: 'E' },
    { label: 'Leaders', value: leaders.length, icon: 'L' },
    { label: 'Gallery', value: gallery.length, icon: 'G' },
    { label: 'Videos', value: videos.length, icon: 'V' },
    { label: 'Trustees', value: trustees.length, icon: 'T' },
    { label: 'News', value: news.length, icon: 'N' },
    { label: 'Members Paid', value: members.filter((member) => member.payment_status === 'paid' || member.status === 'paid').length, icon: 'M' },
    { label: 'Messages', value: messages.length, icon: '@' }
  ];

  if (authLoading) {
    return <main className="login-screen"><p className="loading-note">Loading admin...</p></main>;
  }

  if (!session) {
    return (
      <main className="login-screen">
        <section className="login-box">
          <img src="/images/Logo.jpg" alt="PLBF logo" className="login-logo" />
          <h1>Admin Panel</h1>
          <p className="subtitle">Plateau Lawyers Bar Forum</p>
          <form onSubmit={signIn}>
            <input value={loginForm.email} onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })} type="email" placeholder="Admin email" required />
            <input value={loginForm.password} onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })} type="password" placeholder="Password" required />
            <button type="submit">Sign In</button>
          </form>
          {loginMessage ? <p className="form-status error">{loginMessage}</p> : null}
        </section>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <a className="admin-logo" href="/">
          <img src="/images/Logo.jpg" alt="PLBF logo" />
          <span>Plateau Lawyers<br /><strong>Bar Forum</strong></span>
        </a>

        <nav className="admin-nav" aria-label="Admin sections">
          <a className="active" href="#admin-dashboard">Dashboard</a>
          <a href="#admin-trustees">Trustees</a>
          <a href="#admin-leaders">Leadership</a>
          <a href="#admin-events">Events</a>
          <a href="#admin-news">News</a>
          <a href="#admin-gallery">Gallery</a>
          <a href="#admin-videos">Videos</a>
          <a href="#admin-members">Members</a>
          <a href="#admin-messages">Messages</a>
          <a href="#admin-settings">Settings</a>
        </nav>

        <div className="admin-sidebar-footer">
          <a className="admin-view-site" href="/">View Website</a>
          <button className="admin-signout" type="button" onClick={signOut}>Sign Out</button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <span className="admin-page-title">Dashboard</span>
          <div className="admin-user">
            <span>{session.user.email}</span>
            <span className="admin-avatar">{getInitials(session.user.email || 'AD')}</span>
          </div>
        </header>

        <div className="admin-content">
          <section id="admin-dashboard" className="admin-hero">
            <h1>Admin Dashboard</h1>
            <p>Manage website content, members, messages, payments, and admin access.</p>
          </section>

          {loading ? <p className="loading-note">Loading content...</p> : null}
          {notice ? <p className={`form-status${isNoticeError ? ' error' : ''}`}>{notice}</p> : null}

          <section className="stats-grid" aria-label="Content summary">
            {stats.map((stat) => (
              <article className="stat-card" key={stat.label}>
                <div className="stat-icon" aria-hidden="true">{stat.icon}</div>
                <div><div className="stat-number">{stat.value}</div><div className="stat-label">{stat.label}</div></div>
              </article>
            ))}
          </section>

          <div className="admin-grid">
            <section id="admin-trustees" className="admin-panel">
              <PanelTitle title="Board of Trustees" viewHref="/#trustees" />
              <div className="panel-body">
                <div className="admin-form">
                  <Field label="Name" id="trustee-name"><input id="trustee-name" value={trusteeForm.name} onChange={(e) => setTrusteeForm({ ...trusteeForm, name: e.target.value })} placeholder="Full name" /></Field>
                  <Field label="Position" id="trustee-position"><input id="trustee-position" value={trusteeForm.position} onChange={(e) => setTrusteeForm({ ...trusteeForm, position: e.target.value })} placeholder="Position" /></Field>
                  <Field label="Short Bio" id="trustee-bio" full><textarea id="trustee-bio" value={trusteeForm.bio} onChange={(e) => setTrusteeForm({ ...trusteeForm, bio: e.target.value })} placeholder="Brief description" /></Field>
                  <Field label="Photo" id="trustee-file" full><input id="trustee-file" type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setTrusteeForm)} /></Field>
                  <div className="form-actions">
                    {editingTrusteeId ? <button className="btn btn-outline" type="button" onClick={() => { setTrusteeForm({ name: '', position: '', bio: '', image: '' }); setEditingTrusteeId(null); }}>Cancel</button> : null}
                    <button className="btn btn-gold" type="button" onClick={handleTrusteeSave}>{editingTrusteeId ? 'Update Trustee' : 'Add Trustee'}</button>
                  </div>
                </div>
              </div>
              <AdminTable
                headings={['Image', 'Name', 'Position']}
                emptyText="No trustees added yet."
                rows={trustees.map((item) => [<AdminImage key={`${item.name}-image`} image={item.image} name={item.name} />, item.name, item.position])}
                actions={(rowIndex) => (
                  <RowActions
                    onEdit={() => { const item = trustees[rowIndex]; setEditingTrusteeId(item.id!); setTrusteeForm({ name: item.name, position: item.position, bio: item.bio || '', image: item.image || '' }); }}
                    onDelete={() => deleteRecord('trustees', trustees[rowIndex].id!, 'trustee', () => { setEditingTrusteeId(null); setTrusteeForm({ name: '', position: '', bio: '', image: '' }); })}
                  />
                )}
              />
            </section>

            <section id="admin-leaders" className="admin-panel">
              <PanelTitle title="Leadership" viewHref="/#executives" />
              <div className="panel-body">
                <div className="admin-form">
                  <Field label="Name" id="leader-name"><input id="leader-name" value={leaderForm.name} onChange={(e) => setLeaderForm({ ...leaderForm, name: e.target.value })} placeholder="Full name" /></Field>
                  <Field label="Position" id="leader-position"><input id="leader-position" value={leaderForm.position} onChange={(e) => setLeaderForm({ ...leaderForm, position: e.target.value })} placeholder="Position" /></Field>
                  <Field label="Photo" id="leader-file" full><input id="leader-file" type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setLeaderForm)} /></Field>
                  <div className="form-actions">
                    {editingLeaderId ? <button className="btn btn-outline" type="button" onClick={() => { setLeaderForm({ name: '', position: '', image: '' }); setEditingLeaderId(null); }}>Cancel</button> : null}
                    <button className="btn btn-gold" type="button" onClick={handleLeaderSave}>{editingLeaderId ? 'Update Leader' : 'Add Leader'}</button>
                  </div>
                </div>
              </div>
              <AdminTable
                headings={['Image', 'Name', 'Position']}
                emptyText="No leaders added yet."
                rows={leaders.map((item) => [<AdminImage key={`${item.name}-image`} image={item.image} name={item.name} />, item.name, item.position])}
                actions={(rowIndex) => (
                  <RowActions
                    onEdit={() => { const item = leaders[rowIndex]; setEditingLeaderId(item.id!); setLeaderForm({ name: item.name, position: item.position, image: item.image || '' }); }}
                    onDelete={() => deleteRecord('leaders', leaders[rowIndex].id!, 'leader', () => { setEditingLeaderId(null); setLeaderForm({ name: '', position: '', image: '' }); })}
                  />
                )}
              />
            </section>

            <section id="admin-events" className="admin-panel wide">
              <PanelTitle title="Events" viewHref="/#events" />
              <div className="panel-body">
                <div className="admin-form">
                  <Field label="Title" id="event-title"><input id="event-title" value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} placeholder="Event title" /></Field>
                  <Field label="Date" id="event-date"><input id="event-date" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} placeholder="Date" /></Field>
                  <Field label="Category" id="event-category"><input id="event-category" value={eventForm.category} onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })} placeholder="Category" /></Field>
                  <Field label="Location" id="event-location"><input id="event-location" value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} placeholder="Location" /></Field>
                  <Field label="Description" id="event-description" full><textarea id="event-description" value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} placeholder="Brief description" /></Field>
                  <Field label="Image" id="event-file" full><input id="event-file" type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setEventForm)} /></Field>
                  <div className="form-actions">
                    {editingEventId ? <button className="btn btn-outline" type="button" onClick={() => { setEventForm({ title: '', date: '', category: '', location: '', description: '', image: '' }); setEditingEventId(null); }}>Cancel</button> : null}
                    <button className="btn btn-gold" type="button" onClick={handleEventSave}>{editingEventId ? 'Update Event' : 'Add Event'}</button>
                  </div>
                </div>
              </div>
              <AdminTable
                headings={['Image', 'Title', 'Date', 'Location', 'Category']}
                emptyText="No events added yet."
                rows={events.map((item) => [<AdminImage key={`${item.title}-image`} image={item.image} name={item.title} />, item.title, item.date, item.location, item.category])}
                badgeColumn={4}
                actions={(rowIndex) => (
                  <RowActions
                    onEdit={() => { const item = events[rowIndex]; setEditingEventId(item.id!); setEventForm({ title: item.title, date: item.date, category: item.category, location: item.location, description: item.description, image: item.image || '' }); }}
                    onDelete={() => deleteRecord('events', events[rowIndex].id!, 'event', () => { setEditingEventId(null); setEventForm({ title: '', date: '', category: '', location: '', description: '', image: '' }); })}
                  />
                )}
              />
            </section>

            <section id="admin-news" className="admin-panel wide">
              <PanelTitle title="News" viewHref="/#news-updates" />
              <div className="panel-body">
                <div className="admin-form">
                  <Field label="Title" id="news-title"><input id="news-title" value={newsForm.title} onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })} placeholder="News title" /></Field>
                  <Field label="Date" id="news-date"><input id="news-date" value={newsForm.date} onChange={(e) => setNewsForm({ ...newsForm, date: e.target.value })} placeholder="Date" /></Field>
                  <Field label="Category" id="news-category" full><input id="news-category" value={newsForm.category} onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })} placeholder="Category" /></Field>
                  <Field label="Excerpt" id="news-excerpt" full><textarea id="news-excerpt" value={newsForm.excerpt} onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })} placeholder="Short summary" /></Field>
                  <Field label="Content" id="news-content" full><textarea id="news-content" value={newsForm.content} onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })} placeholder="Full article" /></Field>
                  <Field label="Image" id="news-file" full><input id="news-file" type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setNewsForm)} /></Field>
                  <div className="form-actions">
                    {editingNewsId ? <button className="btn btn-outline" type="button" onClick={() => { setNewsForm({ title: '', date: '', category: '', excerpt: '', content: '', image: '' }); setEditingNewsId(null); }}>Cancel</button> : null}
                    <button className="btn btn-gold" type="button" onClick={handleNewsSave}>{editingNewsId ? 'Update News' : 'Add News'}</button>
                  </div>
                </div>
              </div>
              <AdminTable
                headings={['Image', 'Title', 'Date', 'Category']}
                emptyText="No news added yet."
                rows={news.map((item) => [<AdminImage key={`${item.title}-image`} image={item.image} name={item.title} />, item.title, item.date, item.category])}
                badgeColumn={3}
                actions={(rowIndex) => (
                  <RowActions
                    onEdit={() => { const item = news[rowIndex]; setEditingNewsId(item.id!); setNewsForm({ title: item.title, date: item.date, category: item.category, excerpt: item.excerpt, content: item.content || '', image: item.image || '' }); }}
                    onDelete={() => deleteRecord('news', news[rowIndex].id!, 'news item', () => { setEditingNewsId(null); setNewsForm({ title: '', date: '', category: '', excerpt: '', content: '', image: '' }); })}
                  />
                )}
              />
            </section>

            <section id="admin-gallery" className="admin-panel wide">
              <PanelTitle title="Gallery" viewHref="/#gallery" />
              <div className="panel-body">
                <div className="admin-form">
                  <Field label="Title" id="gallery-title"><input id="gallery-title" value={galleryForm.title} onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })} placeholder="Image title" /></Field>
                  <Field label="Caption" id="gallery-caption"><input id="gallery-caption" value={galleryForm.caption} onChange={(e) => setGalleryForm({ ...galleryForm, caption: e.target.value })} placeholder="Optional caption" /></Field>
                  <Field label="Image" id="gallery-file" full><input id="gallery-file" type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setGalleryForm)} /></Field>
                  <div className="form-actions">
                    {editingGalleryId ? <button className="btn btn-outline" type="button" onClick={() => { setGalleryForm({ title: '', image: '', caption: '' }); setEditingGalleryId(null); }}>Cancel</button> : null}
                    <button className="btn btn-gold" type="button" onClick={handleGallerySave}>{editingGalleryId ? 'Update Image' : 'Add Image'}</button>
                  </div>
                </div>
              </div>
              <AdminTable
                headings={['Image', 'Title', 'Caption']}
                emptyText="No gallery images added yet."
                rows={gallery.map((item) => [<AdminImage key={`${item.title}-image`} image={item.image} name={item.title || 'Gallery image'} />, item.title || 'Untitled', item.caption || 'No caption'])}
                actions={(rowIndex) => (
                  <RowActions
                    onEdit={() => { const item = gallery[rowIndex]; setEditingGalleryId(item.id!); setGalleryForm({ title: item.title || '', image: item.image, caption: item.caption || '' }); }}
                    onDelete={() => deleteRecord('gallery_items', gallery[rowIndex].id!, 'gallery image', () => { setEditingGalleryId(null); setGalleryForm({ title: '', image: '', caption: '' }); })}
                  />
                )}
              />
            </section>

            <section id="admin-videos" className="admin-panel wide">
              <PanelTitle title="Videos" viewHref="/#videos" />
              <div className="panel-body">
                <div className="admin-form">
                  <Field label="Title" id="video-title"><input id="video-title" value={videoForm.title} onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })} placeholder="Video title" /></Field>
                  <Field label="YouTube URL" id="video-url" full><input id="video-url" value={videoForm.url} onChange={(e) => setVideoForm({ ...videoForm, url: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." /></Field>
                  <Field label="Description" id="video-description" full><textarea id="video-description" value={videoForm.description} onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })} placeholder="Short description" /></Field>
                  <div className="form-actions">
                    {editingVideoId ? <button className="btn btn-outline" type="button" onClick={() => { setVideoForm({ title: '', url: '', description: '' }); setEditingVideoId(null); }}>Cancel</button> : null}
                    <button className="btn btn-gold" type="button" onClick={handleVideoSave}>{editingVideoId ? 'Update Video' : 'Add Video'}</button>
                  </div>
                </div>
              </div>
              <AdminTable
                headings={['Title', 'URL', 'Description']}
                emptyText="No videos added yet."
                rows={videos.map((item) => [item.title, item.url, item.description || 'No description'])}
                actions={(rowIndex) => (
                  <RowActions
                    onEdit={() => { const item = videos[rowIndex]; setEditingVideoId(item.id!); setVideoForm({ title: item.title, url: item.url, description: item.description || '' }); }}
                    onDelete={() => deleteRecord('videos', videos[rowIndex].id!, 'video', () => { setEditingVideoId(null); setVideoForm({ title: '', url: '', description: '' }); })}
                  />
                )}
              />
            </section>

            <section id="admin-members" className="admin-panel wide">
              <PanelTitle title="Members & Dues" />
              <AdminTable headings={['Name', 'Email', 'Phone', 'Practice Area', 'Amount', 'Status', 'Reference']} emptyText="No paid members yet." rows={members.map((member) => [member.full_name, member.email, member.phone, member.practice_area || 'Not set', `NGN ${member.dues_amount || 0}`, member.payment_status || member.status || 'pending', member.payment_reference || 'Not set'])} badgeColumn={5} />
            </section>

            <section id="admin-messages" className="admin-panel wide">
              <PanelTitle title="Contact Messages" />
              <AdminTable headings={['Name', 'Email', 'Subject', 'Message']} emptyText="No contact messages yet." rows={messages.map((message) => [message.name, message.email, message.subject, message.message])} />
            </section>

            <section id="admin-settings" className="admin-panel wide">
              <PanelTitle title="Settings" />
              <div className="panel-body">
                <div className="admin-form">
                  <Field label="Admin Email" id="settings-email"><input id="settings-email" value={settingsForm.email} onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })} type="email" /></Field>
                  <div className="form-actions"><button className="btn btn-gold" type="button" onClick={updateAdminEmail}>Change Email</button></div>
                  <Field label="New Password" id="settings-password"><input id="settings-password" value={settingsForm.password} onChange={(e) => setSettingsForm({ ...settingsForm, password: e.target.value })} type="password" /></Field>
                  <div className="form-actions"><button className="btn btn-gold" type="button" onClick={updateAdminPassword}>Change Password</button></div>
                  <Field label="New Admin Name" id="new-admin-name"><input id="new-admin-name" value={settingsForm.adminName} onChange={(e) => setSettingsForm({ ...settingsForm, adminName: e.target.value })} /></Field>
                  <Field label="New Admin Email" id="new-admin-email"><input id="new-admin-email" value={settingsForm.adminEmail} onChange={(e) => setSettingsForm({ ...settingsForm, adminEmail: e.target.value })} type="email" /></Field>
                  <Field label="New Admin Password" id="new-admin-password"><input id="new-admin-password" value={settingsForm.adminPassword} onChange={(e) => setSettingsForm({ ...settingsForm, adminPassword: e.target.value })} type="password" /></Field>
                  <div className="form-actions"><button className="btn btn-gold" type="button" onClick={addAdmin}>Add Admin</button></div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

function PanelTitle({ title, viewHref }: { title: string; viewHref?: string }) {
  return (
    <div className="panel-header">
      <h2>{title}</h2>
      {viewHref ? <a className="panel-view-site" href={viewHref} target="_blank" rel="noopener noreferrer">View on site</a> : null}
    </div>
  );
}

function Field({ label, id, full = false, children }: { label: string; id: string; full?: boolean; children: ReactNode }) {
  return <div className={`form-group${full ? ' full' : ''}`}><label htmlFor={id}>{label}</label>{children}</div>;
}

function AdminImage({ image, name }: { image?: string; name: string }) {
  return <img className="admin-table-image" src={image || '/images/Logo.jpg'} alt={name} />;
}

function AdminTable({ headings, rows, emptyText, badgeColumn, actions }: { headings: string[]; rows: ReactNode[][]; emptyText: string; badgeColumn?: number; actions?: (rowIndex: number) => ReactNode }) {
  if (!rows.length) return <div className="empty-state">{emptyText}</div>;

  return (
    <div className="table-wrapper">
      <table className="admin-table">
        <thead><tr>{headings.map((heading) => <th key={heading}>{heading}</th>)}{actions ? <th>Actions</th> : null}</tr></thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={`${rowIndex}-${cellIndex}`}>
                  {badgeColumn === cellIndex ? <span className="table-badge">{cell || 'Pending'}</span> : cell || 'Not set'}
                </td>
              ))}
              {actions ? <td className="table-actions">{actions(rowIndex)}</td> : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="row-actions">
      <button className="btn-text" type="button" onClick={onEdit}>Edit</button>
      <button className="btn-text danger" type="button" onClick={onDelete}>Delete</button>
    </div>
  );
}

function getInitials(value: string) {
  return value.slice(0, 2).toUpperCase();
}
