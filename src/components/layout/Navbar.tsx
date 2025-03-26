import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Menu, X, Search as SearchIcon } from 'lucide-react';
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
          {/* Logo and main nav links */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center space-x-2">
                <Briefcase className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">JobHive</span>
              </Link>
            </div>
            <div className="hidden md:block ml-10 flex space-x-4">
              <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                Home
              </Link>
              <Link to="/jobs" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                Find Jobs
              </Link>
              <Link to="/ai-job-search" className="px-3 py-2 rounded-md text-sm font-medium text-primary hover:bg-primary/10">
                <span className="flex items-center">
                  <SearchIcon className="mr-1 h-4 w-4" />
                  AI Search
                </span>
              </Link>
            </div>
          </div>

          {/* Rest of navbar */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/profile" className="hidden md:block px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                  Profile
                </Link>
                <Button variant="outline" size="sm" onClick={signOut} className="hidden md:block">
                  Sign Out
                </Button>
                <div className="md:hidden">
                  <Button variant="ghost" size="icon" onClick={toggleMenu}>
                    {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </Button>
                </div>
              </>
            ) : (
              <Link to="/auth" className="hidden md:block px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                Sign In
              </Link>
            )}
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
            <Link to="/ai-job-search" className="block px-3 py-2 rounded-md text-sm font-medium text-primary hover:bg-primary/10">
              <span className="flex items-center">
                <SearchIcon className="mr-1 h-4 w-4" />
                AI Search
              </span>
            </Link>
            {user && (
              <>
                <Link to="/profile" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                  Profile
                </Link>
                <Button variant="outline" size="sm" onClick={signOut} className="w-full mt-2">
                  Sign Out
                </Button>
              </>
            )}
            {!user && (
              <Link to="/auth" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
