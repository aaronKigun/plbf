import type { SectionHeading } from '@/types/content';

export const DEFAULT_SECTION_HEADINGS: Record<string, SectionHeading> = {
  about: {
    key: 'about',
    eyebrow: 'About Us',
    title: 'Upholding the Integrity of the Legal Profession',
    intro: 'PLBF is a non-partisan association of legal practitioners indigenous to Plateau State, working to promote professional excellence, legal education, and welfare of members.'
  },
  governance: {
    key: 'governance',
    eyebrow: 'Foundation',
    title: 'Governance',
    intro: "The policies, standards, and working structures that guide the Forum's service to members and the public."
  },
  trustees: {
    key: 'trustees',
    eyebrow: 'Pillar of Guidance',
    title: 'Board of Trustees',
    intro: 'Distinguished senior members who provide strategic direction, wisdom, and steadfast support to the Forum.'
  },
  programmes: {
    key: 'programmes',
    eyebrow: 'What We Do',
    title: 'Our Mandate & Programmes',
    intro: 'Through structured programmes and sustained advocacy, we work to elevate legal practice and make justice more accessible.'
  },
  events: {
    key: 'events',
    eyebrow: 'Upcoming & Recent',
    title: 'Events',
    intro: 'Forums, clinics, meetings, and professional gatherings that keep the PLBF community connected.'
  },
  leadership: {
    key: 'leadership',
    eyebrow: 'Leadership',
    title: 'Executive',
    title_highlight: 'Committee'
  },
  news: {
    key: 'news',
    eyebrow: 'Latest',
    title: 'News & Updates',
    intro: 'Announcements, reports, and updates from the Plateau Lawyers Bar Forum.'
  },
  gallery: {
    key: 'gallery',
    eyebrow: 'Moments',
    title: 'Gallery',
    intro: 'Highlights from PLBF events, outreach programmes, and community engagements.'
  },
  videos: {
    key: 'videos',
    eyebrow: 'Media',
    title: 'Videos',
    intro: 'Recorded sessions, interviews, and event coverage from the Plateau Lawyers Bar Forum.'
  },
  membership: {
    key: 'membership',
    eyebrow: 'Join Us',
    title: 'Membership',
    title_highlight: '& Dues',
    intro: 'Join the Plateau Lawyers Bar Forum and pay your dues securely. Successful payments are saved in the membership database as paid.'
  },
  contact: {
    key: 'contact',
    eyebrow: 'Get in Touch',
    title: 'Contact',
    title_highlight: 'Us',
    intro: 'Reach out to PLBF for partnerships, membership, or general enquiries. We welcome your questions and collaborations.'
  }
};

export function resolveHeading(key: string, headings: SectionHeading[]): SectionHeading {
  const found = headings.find((item) => item.key === key);
  return found || DEFAULT_SECTION_HEADINGS[key];
}
