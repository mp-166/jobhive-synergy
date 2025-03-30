
import React, { useState } from 'react';
import JobCard, { JobCardProps } from './JobCard';
import Button from '@/components/common/Button';
import { Search, MapPin, Filter, X } from 'lucide-react';

// Sample data for jobs in Hyderabad
const sampleJobs: JobCardProps[] = [
  {
    id: '1',
    title: 'Construction Helper',
    company: 'BuildRight Construction',
    location: 'Gachibowli, Hyderabad',
    salary: '₹10,000 - ₹15,000',
    duration: '2 weeks',
    type: 'Full-time',
    postedAt: '2023-08-15T10:30:00',
  },
  {
    id: '2',
    title: 'Delivery Driver',
    company: 'SpeedMart',
    location: 'Madhapur, Hyderabad',
    salary: '₹500 per day',
    duration: 'Ongoing',
    type: 'Part-time',
    postedAt: '2023-08-14T14:45:00',
  },
  {
    id: '3',
    title: 'Data Entry Specialist',
    company: 'TechSolutions',
    location: 'Hitech City, Hyderabad',
    salary: '₹20,000 - ₹25,000',
    duration: '1 month',
    type: 'Contract',
    postedAt: '2023-08-13T09:15:00',
  },
  {
    id: '4',
    title: 'Event Staff',
    company: 'EventPro',
    location: 'Banjara Hills, Hyderabad',
    salary: '₹1,200 per day',
    duration: '3 days',
    type: 'Temporary',
    postedAt: '2023-08-12T16:20:00',
  },
  {
    id: '5',
    title: 'Warehouse Associate',
    company: 'LogiTech Warehousing',
    location: 'Secunderabad, Hyderabad',
    salary: '₹12,000 - ₹18,000',
    duration: 'Ongoing',
    type: 'Full-time',
    postedAt: '2023-08-11T11:10:00',
  },
  {
    id: '6',
    title: 'Customer Service Representative',
    company: 'ServiceFirst',
    location: 'Ameerpet, Hyderabad',
    salary: '₹15,000 - ₹20,000',
    duration: '6 months',
    type: 'Contract',
    postedAt: '2023-08-10T13:25:00',
  },
];

// Hyderabad areas for filter options
const hyderabadAreas = [
  'All Hyderabad',
  'Gachibowli',
  'Madhapur',
  'Hitech City',
  'Banjara Hills',
  'Jubilee Hills',
  'Secunderabad',
  'Ameerpet',
  'Kukatpally',
  'Begumpet',
  'Hitec City',
  'LB Nagar',
  'Uppal',
  'Miyapur',
  'Kondapur',
];

const JobList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [filters, setFilters] = useState({
    fullTime: false,
    partTime: false,
    contract: false,
    temporary: false,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedArea, setSelectedArea] = useState('All Hyderabad');
  
  // Filter jobs based on search query, location, and job type
  const filteredJobs = sampleJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         job.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesLocation = true;
    if (selectedArea !== 'All Hyderabad') {
      matchesLocation = job.location.includes(selectedArea);
    } else if (locationQuery) {
      matchesLocation = job.location.toLowerCase().includes(locationQuery.toLowerCase());
    }
    
    let matchesType = true;
    if (filters.fullTime && job.type.toLowerCase() !== 'full-time') matchesType = false;
    if (filters.partTime && job.type.toLowerCase() !== 'part-time') matchesType = false;
    if (filters.contract && job.type.toLowerCase() !== 'contract') matchesType = false;
    if (filters.temporary && job.type.toLowerCase() !== 'temporary') matchesType = false;
    
    // If no filters are selected, show all jobs
    const anyFilterSelected = Object.values(filters).some(value => value);
    if (!anyFilterSelected) matchesType = true;
    
    return matchesSearch && matchesLocation && matchesType;
  });
  
  const handleFilterChange = (filter: keyof typeof filters) => {
    setFilters(prev => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };
  
  const clearAllFilters = () => {
    setSearchQuery('');
    setLocationQuery('');
    setSelectedArea('All Hyderabad');
    setFilters({
      fullTime: false,
      partTime: false,
      contract: false,
      temporary: false,
    });
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedArea(e.target.value);
    if (e.target.value !== 'All Hyderabad') {
      setLocationQuery('');
    }
  };

  return (
    <div>
      {/* Search and Filter Section */}
      <div className="mb-8 glass rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Keyword search */}
          <div>
            <label htmlFor="search" className="sr-only">Search jobs</label>
            <div className="relative">
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Job title or company"
                className="w-full h-12 pl-10 pr-4 rounded-lg border border-input bg-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Search className="absolute left-3 top-3.5 text-muted-foreground" size={20} />
            </div>
          </div>
          
          {/* Location selection */}
          <div>
            <label htmlFor="area" className="sr-only">Area in Hyderabad</label>
            <div className="relative">
              <select
                id="area"
                value={selectedArea}
                onChange={handleAreaChange}
                className="w-full h-12 pl-10 pr-4 rounded-lg border border-input bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
              >
                {hyderabadAreas.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
              <MapPin className="absolute left-3 top-3.5 text-muted-foreground" size={20} />
            </div>
          </div>
          
          {/* Custom location search - only visible when All Hyderabad is selected */}
          {selectedArea === 'All Hyderabad' && (
            <div className="md:hidden">
              <label htmlFor="location" className="sr-only">Custom location</label>
              <div className="relative">
                <input
                  id="location"
                  type="text"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="Specific area in Hyderabad"
                  className="w-full h-12 pl-10 pr-4 rounded-lg border border-input bg-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <MapPin className="absolute left-3 top-3.5 text-muted-foreground" size={20} />
              </div>
            </div>
          )}
          
          {/* Filter button */}
          <div className="flex space-x-2">
            <Button
              leftIcon={<Filter size={18} />}
              variant={showFilters ? "primary" : "outline"}
              className="h-12 w-full md:w-auto flex-grow"
              onClick={() => setShowFilters(!showFilters)}
            >
              Filter
            </Button>
            
            {(searchQuery || locationQuery || selectedArea !== 'All Hyderabad' || Object.values(filters).some(v => v)) && (
              <Button
                leftIcon={<X size={18} />}
                variant="ghost"
                className="h-12"
                onClick={clearAllFilters}
              >
                Clear
              </Button>
            )}
          </div>
        </div>
        
        {/* Expanded filters */}
        {showFilters && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t">
            <div className="flex items-center">
              <input
                id="filter-full-time"
                type="checkbox"
                checked={filters.fullTime}
                onChange={() => handleFilterChange('fullTime')}
                className="h-4 w-4 text-primary rounded border-input focus:ring-primary"
              />
              <label htmlFor="filter-full-time" className="ml-2 text-sm">
                Full-time
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="filter-part-time"
                type="checkbox"
                checked={filters.partTime}
                onChange={() => handleFilterChange('partTime')}
                className="h-4 w-4 text-primary rounded border-input focus:ring-primary"
              />
              <label htmlFor="filter-part-time" className="ml-2 text-sm">
                Part-time
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="filter-contract"
                type="checkbox"
                checked={filters.contract}
                onChange={() => handleFilterChange('contract')}
                className="h-4 w-4 text-primary rounded border-input focus:ring-primary"
              />
              <label htmlFor="filter-contract" className="ml-2 text-sm">
                Contract
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="filter-temporary"
                type="checkbox"
                checked={filters.temporary}
                onChange={() => handleFilterChange('temporary')}
                className="h-4 w-4 text-primary rounded border-input focus:ring-primary"
              />
              <label htmlFor="filter-temporary" className="ml-2 text-sm">
                Temporary
              </label>
            </div>
            
            {/* Custom location search when All Hyderabad is selected - for larger screens */}
            {selectedArea === 'All Hyderabad' && (
              <div className="hidden md:block col-span-4 mt-3">
                <label htmlFor="location-lg" className="block text-sm mb-1">Specific area in Hyderabad</label>
                <div className="relative">
                  <input
                    id="location-lg"
                    type="text"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    placeholder="Enter a specific location"
                    className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <MapPin className="absolute left-3 top-2.5 text-muted-foreground" size={18} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Results count */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
        </h2>
        <div className="text-sm text-muted-foreground">
          Sorted by: <span className="font-medium">Most recent</span>
        </div>
      </div>
      
      {/* Job cards */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map(job => (
            <JobCard key={job.id} {...job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-secondary/20 rounded-lg">
          <h3 className="text-lg font-medium mb-2">No jobs found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
      
      {/* Load more button */}
      {filteredJobs.length > 0 && (
        <div className="mt-10 text-center">
          <Button variant="outline" size="lg">
            Load More Jobs
          </Button>
        </div>
      )}
    </div>
  );
};

export default JobList;
