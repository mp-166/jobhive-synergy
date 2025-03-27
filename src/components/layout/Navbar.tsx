
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search as SearchIcon } from 'lucide-react';
import Button from '@/components/common/Button';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, signOut } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <nav className="fixed w-full z-10 bg-background/80 backdrop-blur-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/00885a0e-6e53-452c-8173-4bd7c3ef1822.png" 
                alt="Empower Logo" 
                className="h-8 w-auto" 
              />
              <span className="font-bold text-xl">Empower</span>
            </Link>
          </div>
          
          {/* Main Nav Links - All in one line */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground">
              Home
            </Link>
            <Link to="/jobs" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground">
              Find Jobs
            </Link>
            <Link to="/how-it-works" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground">
              How It Works
            </Link>
            {user ? (
              <>
                <Link to="/profile" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                  Profile
                </Link>
                <Button variant="outline" size="sm" onClick={signOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/post-job" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                  Post a Job
                </Link>
                <Link to="/auth" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <Link to="/" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground">
              Home
            </Link>
            <Link to="/jobs" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground">
              Find Jobs
            </Link>
            <Link to="/how-it-works" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground">
              How It Works
            </Link>
            <Link to="/ai-job-search" className="block px-3 py-2 rounded-md text-sm font-medium text-primary hover:bg-primary/10">
              <span className="flex items-center">
                <SearchIcon className="mr-1 h-4 w-4" />
                AI Search
              </span>
            </Link>
            {user ? (
              <>
                <Link to="/profile" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                  Profile
                </Link>
                <Button variant="outline" size="sm" onClick={signOut} className="w-full mt-2">
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/post-job" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                  Post a Job
                </Link>
                <Link to="/auth" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
