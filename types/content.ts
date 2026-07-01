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
