
import React, { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import HowItWorks from '@/components/home/HowItWorks';
import Testimonials from '@/components/home/Testimonials';
import Button from '@/components/common/Button';

const Index = () => {
  // Add intersection observer for animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const animateElements = document.querySelectorAll('.animate-in-view');
    animateElements.forEach((el) => observer.observe(el));

    return () => {
      animateElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        
        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/90 to-primary text-white">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="heading-lg mb-6">Ready to Get Started?</h2>
            <p className="body-md mb-8 max-w-2xl mx-auto opacity-90">
              Join thousands of job seekers and employers already using Empower to connect and create opportunity.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 w-full sm:w-auto"
              >
                Find Jobs
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 w-full sm:w-auto"
              >
                Post a Job
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
