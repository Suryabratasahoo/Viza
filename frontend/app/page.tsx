'use client';

import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeaturesSection from '@/components/FeaturesSection';
import DevelopersSection from '@/components/DevelopersSection';
import DualCTA from '@/components/DualCTA';
import LatestBlogs from '@/components/LatestBlogs';
import DownloadCard from '@/components/DownloadCard';
import Footer from '@/components/Footer';
import ParticleBackground from '@/components/ParticleBackground';

export default function Home() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col font-sans text-grey-1200 bg-[#FFFFFF] antialiased select-none scroll-smooth">
      {/* Dynamic Canvas Background (Interactable particles) */}
      <ParticleBackground />

      {/* Floating Header Navigation */}
      <Header onScrollToSection={scrollToSection} />

      {/* Main Page Layout */}
      <main className="flex-grow flex flex-col pt-[52px]">
        {/* Hero Welcome Section */}
        <div id="hero">
          <Hero onScrollNext={() => scrollToSection('features')} />
        </div>

        {/* Feature Split Showcases */}
        <div id="features" className="scroll-mt-[52px]">
          <FeaturesSection onExploreProduct={() => scrollToSection('download')} />
        </div>

        {/* Developers Testimonials */}
        <div id="developers" className="scroll-mt-[52px]">
          <DevelopersSection />
        </div>

        {/* Dual Call-to-actions */}
        <div id="cta" className="scroll-mt-[52px]">
          <DualCTA />
        </div>

        {/* Latest Blogs Carousel */}
        <div id="blogs" className="scroll-mt-[52px]">
          <LatestBlogs />
        </div>

        {/* Windows Download section */}
        <div id="download" className="scroll-mt-[52px]">
          <DownloadCard />
        </div>
      </main>

      {/* Page Footer */}
      <Footer />
    </div>
  );
}
