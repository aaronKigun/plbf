import HeroSection from '@/components/HeroSection';
import SectionGrid from '@/components/SectionGrid';

const trustees = [
  { title: 'Chief A. B. D. Jang', subtitle: 'Chairman', description: 'Guiding the forum with strategic leadership and legal insight.' },
  { title: 'Barr. M. C. Pam', subtitle: 'Vice Chairman', description: 'Supporting members and strengthening institutional growth.' },
  { title: 'Barr. I. S. Dalyop', subtitle: 'Secretary', description: 'Coordinating policy, engagement, and administration.' }
];

const programmes = [
  { title: 'Legal Aid Outreach', description: 'Community legal support and citizen empowerment.' },
  { title: 'Judicial Reform', description: 'Advocacy for transparency and accessible justice.' },
  { title: 'Professional Development', description: 'Continuing legal education and mentorship.' }
];

const events = [
  { title: 'Annual General Meeting', subtitle: '12 Aug 2026 • Jos', description: 'Conference' },
  { title: 'Free Legal Clinic', subtitle: '20 Sep 2026 • Bassa', description: 'Outreach' },
  { title: 'Leadership Roundtable', subtitle: '03 Oct 2026 • Abuja', description: 'Forum' }
];

const news = [
  { title: 'PLBF Launches New Membership Drive', subtitle: 'Membership', description: 'The forum is welcoming new members to strengthen legal advocacy.' },
  { title: 'Youth Legal Awareness Programme Announced', subtitle: 'Outreach', description: 'A new programme focused on civic education and legal access.' },
  { title: 'Panel Discussion on Access to Justice', subtitle: 'Event', description: 'A forthcoming conversation on building fairer legal systems.' }
];

export default function HomePage() {
  return (
    <main>
      <HeroSection
        title="Plateau Lawyers Bar Forum"
        subtitle="A united body of legal practitioners committed to rule of law, human rights, and the advancement of justice."
        description="PLBF is a non-partisan association of legal practitioners working to promote professional excellence, legal education, and public welfare."
      />

      <section id="about" className="section">
        <h2>About Us</h2>
        <p>
          PLBF is a non-partisan association of legal practitioners working to promote professional excellence, legal education, and public welfare.
        </p>
      </section>

      <SectionGrid title="Trustees" items={trustees} alt />
      <SectionGrid title="Programmes" items={programmes} />
      <SectionGrid title="Events" items={events} alt />
      <SectionGrid title="Latest News" items={news} />
    </main>
  );
}
