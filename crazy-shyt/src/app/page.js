
import Link from 'next/link';
import HeroSection from '@/components/HeroSection';
import ProjectFeatures from '@/components/ProjectFeatures';
import DemoSection from '@/components/DemoSection';
import TeamSection from '@/components/TeamSection';
import ContactSection from '@/components/ContactSection';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ProjectFeatures />
      <DemoSection />
      <TeamSection />
      <ContactSection />
    </main>
  );
}