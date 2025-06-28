import { Header } from '@/components/header';
import { HeroSection } from '@/components/hero-section';
import { ContactForm } from '@/components/contact-form';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <ContactForm />
    </main>
  );
}