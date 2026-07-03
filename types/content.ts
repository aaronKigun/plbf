export type Trustee = {
  id?: number;
  name: string;
  position: string;
  display_order?: number;
  image?: string;
  bio?: string;
};

export type Leader = {
  id?: number;
  name: string;
  position: string;
  display_order?: number;
  image?: string;
};

export type EventItem = {
  id?: number;
  title: string;
  date: string;
  category: string;
  location: string;
  description: string;
  image?: string;
};

export type NewsItem = {
  id?: number;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content?: string;
  image?: string;
};

export type Programme = {
  id?: number;
  title: string;
  icon?: string;
  description: string;
};

export type GalleryItem = {
  id?: number;
  title?: string;
  image: string;
  caption?: string;
  display_order?: number;
};

export type VideoItem = {
  id?: number;
  title: string;
  url: string;
  description?: string;
  display_order?: number;
};

export type SectionHeading = {
  key: string;
  eyebrow?: string;
  title: string;
  title_highlight?: string;
  intro?: string;
};

export type Member = {
  id?: number;
  full_name: string;
  email: string;
  phone: string;
  call_to_bar_year?: string;
  practice_area?: string;
  enrollment_number?: string;
  dues_amount?: number;
  payment_reference?: string;
  payment_status?: 'pending' | 'paid' | 'failed';
  status?: string;
  paid_at?: string;
  created_at?: string;
};

export type ContactMessage = {
  id?: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at?: string;
};

export type NewsletterSubscriber = {
  id?: number;
  email: string;
  created_at?: string;
};
