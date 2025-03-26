
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '@/components/common/Button';
import { Menu, X, User } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Find Jobs', path: '/jobs' },
    { name: 'Post a Job', path: '/post-job' },
    { name: 'How It Works', path: '/how-it-works' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-sm backdrop-blur-lg py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2"
          >
            <div className="bg-primary text-white font-bold rounded-lg w-10 h-10 flex items-center justify-center">E</div>
            <span className="text-xl font-bold">Empower</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === link.path ? 'text-primary' : 'text-foreground'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="ghost" 
              leftIcon={<User size={16} />}
              className="text-sm"
            >
              Sign In
            </Button>
            <Button variant="primary" className="text-sm">
              Register
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMenu}
            className="md:hidden text-foreground"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={`md:hidden glass border-t mt-3 overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-6 space-y-5">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                to={link.path}
                className={`text-sm font-medium py-1 transition-colors hover:text-primary ${
                  location.pathname === link.path ? 'text-primary' : 'text-foreground'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="pt-4 border-t flex flex-col space-y-3">
            <Button 
              variant="ghost" 
              leftIcon={<User size={16} />}
              className="justify-start text-sm"
            >
              Sign In
            </Button>
            <Button variant="primary" className="text-sm">
              Register
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
