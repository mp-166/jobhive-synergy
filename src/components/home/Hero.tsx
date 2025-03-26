
import React, { useEffect, useRef } from 'react';
import Button from '@/components/common/Button';
import { ArrowRight, Search, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const countersRef = useRef<HTMLDivElement>(null);

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

    const heroElement = heroRef.current;
    const countersElement = countersRef.current;

    if (heroElement) {
      const animateElements = heroElement.querySelectorAll('.animate-in-view');
      animateElements.forEach((el) => observer.observe(el));
    }

    if (countersElement) {
      observer.observe(countersElement);
    }

    return () => {
      if (heroElement) {
        const animateElements = heroElement.querySelectorAll('.animate-in-view');
        animateElements.forEach((el) => observer.unobserve(el));
      }
      if (countersElement) {
        observer.unobserve(countersElement);
      }
    };
  }, []);

  // Add delay to animations
  const delays = ['delay-[0ms]', 'delay-[100ms]', 'delay-[200ms]', 'delay-[300ms]', 'delay-[400ms]'];

  return (
    <div className="bg-gradient-to-b from-white to-secondary/20 pt-28 pb-16" ref={heroRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="animate-in-view delay-[0ms]">
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
              Connecting Talent with Opportunity
            </span>
          </div>
          
          <h1 className="animate-in-view delay-[100ms] heading-xl mb-6">
            Find Your Next <span className="text-primary">Opportunity</span> Today
          </h1>
          
          <p className="animate-in-view delay-[200ms] body-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Empower connects job seekers with immediate work opportunities and helps employers find reliable talent on demand.
          </p>
          
          <div className="animate-in-view delay-[300ms] flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Button size="lg" leftIcon={<Search size={18} />} className="w-full sm:w-auto">
              Find Jobs
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              leftIcon={<Briefcase size={18} />}
              className="w-full sm:w-auto"
            >
              Post a Job
            </Button>
          </div>
        </div>

        <div className="glass-card animate-in-view delay-[400ms] mx-auto max-w-4xl rounded-xl overflow-hidden p-8 md:p-10">
          <div className="animate-slide-up">
            <form className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="keywords" className="sr-only">Keywords or job title</label>
                <div className="relative">
                  <input
                    type="text"
                    id="keywords"
                    placeholder="Keywords or job title"
                    className="w-full h-12 pl-10 pr-4 rounded-lg border border-input bg-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <Search className="absolute left-3 top-3.5 text-muted-foreground" size={20} />
                </div>
              </div>
              
              <div className="flex-1">
                <label htmlFor="location" className="sr-only">Location</label>
                <div className="relative">
                  <input
                    type="text"
                    id="location"
                    placeholder="Location"
                    className="w-full h-12 pl-10 pr-4 rounded-lg border border-input bg-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <div className="absolute left-3 top-3.5 text-muted-foreground">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 22C16 18 20 14.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 14.4183 8 18 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              <Button type="submit" size="lg" className="h-12 px-8 md:px-6">
                Search
              </Button>
            </form>
          </div>
        </div>

        {/* Statistics */}
        <div 
          ref={countersRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto mt-16 animate-in-view"
        >
          {[
            { count: '10K+', label: 'Active Jobs' },
            { count: '5K+', label: 'Companies' },
            { count: '20K+', label: 'Job Seekers' },
            { count: '15K+', label: 'Jobs Filled' },
          ].map((stat, index) => (
            <div key={stat.label} className={`text-center ${delays[index]}`}>
              <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">{stat.count}</div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
