
import Link from 'next/link';
import MapComponent from '@/components/MapComponent';
import HeroSection from '@/components/HeroSection';
import ProjectFeatures from '@/components/ProjectFeatures';
import DemoSection from '@/components/DemoSection';
import TeamSection from '@/components/TeamSection';
import ContactSection from '@/components/ContactSection';
import Translator from '@/components/Translator';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ProjectFeatures />
      <DemoSection />
      <TeamSection />
      <ContactSection />
      <Translator />

      <MapComponent />


    </main>
  );
}
