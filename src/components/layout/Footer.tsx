
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const sections = [
    {
      title: 'For Job Seekers',
      links: [
        { name: 'Browse Jobs', path: '/jobs' },
        { name: 'How It Works', path: '/how-it-works' },
        { name: 'Success Stories', path: '/success-stories' },
        { name: 'Resources', path: '/resources' },
      ],
    },
    {
      title: 'For Employers',
      links: [
        { name: 'Post a Job', path: '/post-job' },
        { name: 'Find Workers', path: '/find-workers' },
        { name: 'Pricing', path: '/pricing' },
        { name: 'Enterprise Solutions', path: '/enterprise' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', path: '/about' },
        { name: 'Careers', path: '/careers' },
        { name: 'Press', path: '/press' },
        { name: 'Contact', path: '/contact' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Terms of Service', path: '/terms' },
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Cookies', path: '/cookies' },
        { name: 'Security', path: '/security' },
      ],
    },
  ];

  return (
    <footer className="bg-secondary/50 border-t">
      <div className="max-w-7xl mx-auto pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path}
                      className="text-muted-foreground text-sm hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-primary text-white font-bold rounded-lg w-8 h-8 flex items-center justify-center">E</div>
              <span className="ml-2 font-medium">Empower</span>
            </div>
            
            <p className="text-muted-foreground text-sm">
              © {currentYear} Empower. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
