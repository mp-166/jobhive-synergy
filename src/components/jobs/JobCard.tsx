
import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '@/components/common/Badge';
import Card from '@/components/common/Card';
import { MapPin, Clock, DollarSign } from 'lucide-react';

export interface JobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  duration: string;
  type: string;
  postedAt: string;
  logo?: string;
}

const JobCard = ({ 
  id, 
  title, 
  company, 
  location, 
  salary, 
  duration, 
  type, 
  postedAt,
  logo 
}: JobCardProps) => {
  // Calculate time ago from postedAt
  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const postedDate = new Date(dateString);
    const diffInMilliseconds = now.getTime() - postedDate.getTime();
    const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      const diffInDays = diffInHours / 24;
      if (diffInDays < 30) {
        return `${Math.floor(diffInDays)}d ago`;
      } else {
        return `${Math.floor(diffInDays / 30)}mo ago`;
      }
    }
  };

  // Type variant
  const getTypeVariant = (jobType: string) => {
    switch (jobType.toLowerCase()) {
      case 'full-time':
        return 'primary';
      case 'part-time':
        return 'secondary';
      case 'contract':
        return 'warning';
      case 'freelance':
        return 'success';
      default:
        return 'default';
    }
  };

  const timeAgo = getTimeAgo(postedAt);
  const typeVariant = getTypeVariant(type) as any;

  return (
    <Card variant="bordered" hoverEffect className="overflow-hidden">
      <Link to={`/jobs/${id}`} className="block h-full">
        <div className="flex flex-col h-full">
          <div className="flex items-start mb-4">
            <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center overflow-hidden flex-shrink-0">
              {logo ? (
                <img src={logo} alt={company} className="h-full w-full object-cover" />
              ) : (
                <img 
                  src="/lovable-uploads/00885a0e-6e53-452c-8173-4bd7c3ef1822.png" 
                  alt="Empower Logo" 
                  className="h-8 w-auto" 
                />
              )}
            </div>
            <div className="ml-3 flex-1">
              <h3 className="font-semibold text-lg truncate hover:text-primary transition-colors">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground">{company}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-y-2 mb-4">
            <Badge variant={typeVariant} size="sm" className="mr-2">
              {type}
            </Badge>
            <div className="flex items-center text-sm text-muted-foreground mr-4">
              <MapPin size={14} className="mr-1" />
              <span>{location}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 mt-auto pt-4 border-t text-sm text-muted-foreground">
            <div className="flex items-center">
              <DollarSign size={14} className="mr-1" />
              <span>{salary}</span>
            </div>
            <div className="flex items-center">
              <Clock size={14} className="mr-1" />
              <span>{duration}</span>
            </div>
            <div className="ml-auto text-xs">
              {timeAgo}
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default JobCard;
