
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import JobCard from '@/components/jobs/JobCard';
import { supabase } from '@/integrations/supabase/client';
import { SearchIcon, Compass, Send, ArrowRightCircle } from 'lucide-react';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";

type JobSearchResult = {
  jobs: any[];
  explanation: string;
}

const AIJobSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const navigate = useNavigate();

  const {
    data: searchResults,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery<JobSearchResult>({
    queryKey: ['aiJobSearch', searchQuery],
    queryFn: async () => {
      try {
        // Skip fetching if no search query
        if (!searchQuery.trim()) {
          return { jobs: [], explanation: '' };
        }

        const { data, error } = await supabase.functions.invoke('job-search', {
          body: { query: searchQuery }
        });

        if (error) throw new Error(error.message);
        return data as JobSearchResult;
      } catch (err) {
        console.error('Error during job search:', err);
        throw err;
      }
    },
    enabled: false, // Don't run query automatically
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a search query");
      return;
    }

    // Add to search history if not already there
    if (!searchHistory.includes(searchQuery)) {
      setSearchHistory(prev => [searchQuery, ...prev].slice(0, 5));
    }

    // Trigger the search
    refetch();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleHistoryItemClick = (query: string) => {
    setSearchQuery(query);
    refetch();
  };

  const handleJobClick = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="heading-lg mb-4">AI-Powered Job Search</h1>
            <p className="body-md text-muted-foreground max-w-3xl mx-auto">
              Describe the job you want in natural language - our AI will find the most relevant matches
            </p>
          </div>
          
          <div className="mb-8 max-w-3xl mx-auto">
            <div className="relative mb-4 glass p-1 rounded-xl shadow-sm">
              <Command className="rounded-lg border-0 shadow-none bg-transparent">
                <div className="flex items-center border-b px-3">
                  <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  <CommandInput
                    placeholder="Try 'find remote developer jobs paying over ₹20,000' or 'part-time jobs in Bangalore'"
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                    onKeyDown={handleKeyDown}
                    className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                {searchHistory.length > 0 && (
                  <CommandList>
                    <CommandGroup heading="Recent Searches">
                      {searchHistory.map((query, index) => (
                        <CommandItem
                          key={index}
                          onSelect={() => handleHistoryItemClick(query)}
                          className="cursor-pointer flex items-center"
                        >
                          <Compass className="mr-2 h-4 w-4" />
                          <span>{query}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                )}
                <CommandEmpty>No recent searches</CommandEmpty>
              </Command>
              
              <Button 
                onClick={handleSearch}
                className="absolute right-3 top-3 h-8 w-8 p-0"
                disabled={isLoading}
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </div>
            
            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={handleSearch} 
                disabled={isLoading}
                className="mx-auto"
              >
                <SearchIcon className="mr-2 h-4 w-4" />
                {isLoading ? 'Searching...' : 'Search Jobs'}
              </Button>
            </div>
          </div>
          
          {/* AI Explanation */}
          {searchResults?.explanation && (
            <div className="mb-8 p-4 bg-muted/50 rounded-lg max-w-3xl mx-auto">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <ArrowRightCircle className="mr-2 h-4 w-4" />
                AI Assistant
              </h3>
              <p className="text-sm text-muted-foreground">
                {searchResults.explanation}
              </p>
            </div>
          )}
          
          {/* Results count */}
          {searchResults?.jobs?.length > 0 && (
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                {searchResults.jobs.length} {searchResults.jobs.length === 1 ? 'job' : 'jobs'} found
              </h2>
            </div>
          )}
          
          {/* Error message */}
          {isError && (
            <div className="text-center py-12 bg-destructive/10 rounded-lg">
              <h3 className="text-lg font-medium mb-2 text-destructive">Error</h3>
              <p className="text-muted-foreground">
                {error instanceof Error ? error.message : 'An error occurred while searching for jobs'}
              </p>
            </div>
          )}
          
          {/* Loading state */}
          {isLoading && (
            <div className="grid place-items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">Finding the best matches for you...</p>
            </div>
          )}
          
          {/* Job cards */}
          {!isLoading && searchResults?.jobs?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.jobs.map(job => (
                <div key={job.id} onClick={() => handleJobClick(job.id)} className="cursor-pointer">
                  <JobCard
                    id={job.id}
                    title={job.title}
                    company={job.company}
                    location={job.location}
                    salary={job.salary}
                    duration={job.duration}
                    type={job.type}
                    postedAt={job.created_at || new Date().toISOString()}
                    logo={job.company_logo}
                  />
                </div>
              ))}
            </div>
          ) : (!isLoading && searchQuery && (
            <div className="text-center py-12 bg-secondary/20 rounded-lg">
              <h3 className="text-lg font-medium mb-2">No jobs found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or phrasing your request differently
              </p>
            </div>
          ))}
          
          {/* Initial state - no search yet */}
          {!isLoading && !searchQuery && !searchResults?.jobs?.length && (
            <div className="text-center py-16">
              <div className="mb-4">
                <SearchIcon className="h-12 w-12 mx-auto text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-medium mb-2">Start your AI job search</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Describe what you're looking for in natural language.
                Our AI will understand and find the most relevant jobs.
              </p>
              <div className="max-w-md mx-auto space-y-2">
                <div className="p-2 bg-muted rounded-lg text-sm cursor-pointer hover:bg-muted/80 transition-colors" 
                     onClick={() => setSearchQuery("Part-time jobs in Bangalore with flexible hours")}>
                  "Part-time jobs in Bangalore with flexible hours"
                </div>
                <div className="p-2 bg-muted rounded-lg text-sm cursor-pointer hover:bg-muted/80 transition-colors"
                     onClick={() => setSearchQuery("Remote developer positions paying over ₹20,000")}>
                  "Remote developer positions paying over ₹20,000"
                </div>
                <div className="p-2 bg-muted rounded-lg text-sm cursor-pointer hover:bg-muted/80 transition-colors"
                     onClick={() => setSearchQuery("Jobs in construction that don't require prior experience")}>
                  "Jobs in construction that don't require prior experience"
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AIJobSearch;
