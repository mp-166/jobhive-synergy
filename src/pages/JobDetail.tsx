import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import PaymentManager from '@/components/payment/PaymentManager';
import { useAuth } from '@/contexts/AuthContext';
import { databaseAPI } from '@/lib/api';
import { MapPin, Clock, Calendar, DollarSign, Briefcase, User, CheckCircle, ChevronLeft } from 'lucide-react';

// Sample job data
const jobData = {
  id: '1',
  title: 'Construction Helper',
  company: 'BuildRight Construction',
  location: 'Hyderabad',
  salary: '₹10,000 - ₹15,000',
  duration: '2 weeks',
  type: 'Full-time',
  postedAt: '2023-08-15T10:30:00',
  logo: '',
  description: `
    <p>We are looking for Construction Helpers to join our team for a 2-week project in Hyderabad. The ideal candidate will assist skilled workers on the construction site and help with various manual tasks.</p>
    
    <h3>Responsibilities:</h3>
    <ul>
      <li>Loading and unloading construction materials</li>
      <li>Assisting skilled workers with their tasks</li>
      <li>Cleaning and preparing construction sites</li>
      <li>Operating basic construction equipment</li>
      <li>Following safety guidelines and protocols</li>
    </ul>
    
    <h3>Requirements:</h3>
    <ul>
      <li>Previous experience in construction is a plus but not required</li>
      <li>Ability to perform physical labor for extended periods</li>
      <li>Basic understanding of construction safety procedures</li>
      <li>Reliable and punctual with good work ethic</li>
      <li>Ability to follow instructions and work as part of a team</li>
    </ul>
  `,
  requirements: [
    'Age 18+',
    'Ability to lift 20kg',
    'Basic understanding of construction tools',
    'Own transportation preferred',
  ],
  benefits: [
    'Daily wages with overtime pay',
    'On-site meals provided',
    'Safety equipment provided',
    'Potential for extended employment',
  ],
  skills: [
    'Construction',
    'Manual Labor',
    'Teamwork',
    'Safety Procedures',
  ],
  employerInfo: {
    name: 'BuildRight Construction',
    location: 'Hyderabad',
    founded: '2010',
    employees: '50-100',
    description: 'BuildRight Construction is a leading construction company in Hyderabad specializing in commercial and residential projects.',
    verified: true,
  },
};

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [job, setJob] = useState(jobData); // In a real app, you'd fetch the job by id
  const [jobWithDetails, setJobWithDetails] = useState<any>(null);

  useEffect(() => {
    if (id) {
      loadJobDetails();
    }
  }, [id]);

  const loadJobDetails = async () => {
    try {
      // In a real app, fetch job with payment details
      const jobDetails = await databaseAPI.getJobWithDetails(id!);
      setJobWithDetails(jobDetails);
    } catch (error) {
      // Fallback to sample data for demo
      setJobWithDetails({ ...jobData, escrow_payments: [] });
    }
  };

  const getUserRole = () => {
    if (!user) return null;
    if (job.employerId === user.id) return 'employer';
    return 'worker';
  };
  
  if (!job) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-28 pb-16">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h1 className="heading-lg mb-4">Job Not Found</h1>
            <p className="body-md text-muted-foreground mb-8">
              The job listing you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/jobs">
              <Button>Browse All Jobs</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link to="/jobs" className="inline-flex items-center text-sm text-primary hover:underline mb-6">
              <ChevronLeft size={16} className="mr-1" />
              Back to Jobs
            </Link>
            
            <div className="bg-white border rounded-xl p-6 md:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                {/* Company logo */}
                <div className="h-16 w-16 bg-secondary flex items-center justify-center rounded-lg overflow-hidden">
                  {job.logo ? (
                    <img src={job.logo} alt={job.company} className="h-full w-full object-cover" />
                  ) : (
                    <img 
                      src="/lovable-uploads/00885a0e-6e53-452c-8173-4bd7c3ef1822.png" 
                      alt="Empower Logo" 
                      className="h-12 w-auto"
                    />
                  )}
                </div>
                
                <div className="flex-grow">
                  {/* Job header */}
                  <div className="mb-4">
                    <Badge variant="primary" className="mb-2">
                      {job.type}
                    </Badge>
                    <h1 className="text-2xl md:text-3xl font-bold mb-1">{job.title}</h1>
                    <div className="flex items-center text-muted-foreground">
                      <span className="font-medium text-foreground">{job.company}</span>
                      {job.employerInfo.verified && (
                        <span className="ml-2 flex items-center text-primary text-sm">
                          <CheckCircle size={14} className="mr-1" />
                          Verified Employer
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Job meta info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-6 mb-6">
                    <div className="flex items-center text-sm">
                      <MapPin size={16} className="mr-2 text-muted-foreground" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <DollarSign size={16} className="mr-2 text-muted-foreground" />
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock size={16} className="mr-2 text-muted-foreground" />
                      <span>{job.duration}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar size={16} className="mr-2 text-muted-foreground" />
                      <span>Start ASAP</span>
                    </div>
                  </div>
                  
                  {/* Apply button */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button size="lg" className="w-full sm:w-auto">
                      Apply Now
                    </Button>
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Save Job
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              <Card variant="bordered" className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Job Description</h2>
                <div 
                  className="prose max-w-none" 
                  dangerouslySetInnerHTML={{ __html: job.description }} 
                />
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card variant="bordered">
                  <h2 className="text-xl font-semibold mb-4">Requirements</h2>
                  <ul className="space-y-2">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle size={16} className="mr-2 mt-1 text-primary flex-shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
                
                <Card variant="bordered">
                  <h2 className="text-xl font-semibold mb-4">Benefits</h2>
                  <ul className="space-y-2">
                    {job.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle size={16} className="mr-2 mt-1 text-primary flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
              
              <Card variant="bordered">
                <h2 className="text-xl font-semibold mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>
            </div>
            
            {/* Sidebar */}
            <div>
              <Card variant="bordered" className="mb-6">
                <h2 className="text-xl font-semibold mb-4">About the Employer</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Briefcase size={16} className="mr-2 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Company</p>
                      <p>{job.employerInfo.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin size={16} className="mr-2 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p>{job.employerInfo.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Calendar size={16} className="mr-2 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Founded</p>
                      <p>{job.employerInfo.founded}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <User size={16} className="mr-2 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Employees</p>
                      <p>{job.employerInfo.employees}</p>
                    </div>
                  </div>
                  <p className="text-sm pt-3 border-t">
                    {job.employerInfo.description}
                  </p>
                </div>
              </Card>
              
              {/* Enhanced Payment Management */}
              {user && getUserRole() && jobWithDetails && (
                <PaymentManager 
                  job={jobWithDetails} 
                  userRole={getUserRole()!}
                  onPaymentUpdate={loadJobDetails}
                />
              )}
            </div>
          </div>
          
          {/* Similar jobs would go here */}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default JobDetail;
