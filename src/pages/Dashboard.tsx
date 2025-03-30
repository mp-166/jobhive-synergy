
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Briefcase, Clock, IndianRupee, Star, MapPin, CheckCircle, Calendar, BarChart2, Bell, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface JobHistoryItem {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  date: string;
  status: string;
  rating?: number;
}

interface ApplicationItem {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  salary: string;
  appliedDate: string;
  status: string;
}

interface PostedJobItem {
  id: string;
  title: string;
  location: string;
  applications: number;
  postedDate: string;
  salary: string;
  status: string;
}

const Dashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [jobHistory, setJobHistory] = useState<JobHistoryItem[]>([]);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [postedJobs, setPostedJobs] = useState<PostedJobItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Require authentication to access dashboard
  useRequireAuth();
  
  useEffect(() => {
    if (user) {
      // In a real implementation, these would be fetched from Supabase
      fetchUserData();
    }
  }, [user]);
  
  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      // Sample data for now - in a real app, we would fetch from Supabase
      if (profile?.user_type === 'job_seeker') {
        setJobHistory([
          {
            id: '1',
            title: 'Delivery Driver',
            company: 'QuickMart',
            location: 'Gachibowli, Hyderabad',
            salary: '₹12,000',
            date: 'July 15 - July 25, 2023',
            status: 'Completed',
            rating: 5,
          },
          {
            id: '2',
            title: 'Warehouse Associate',
            company: 'Global Logistics',
            location: 'Hitech City, Hyderabad',
            salary: '₹10,000',
            date: 'June 5 - June 15, 2023',
            status: 'Completed',
            rating: 4.5,
          }
        ]);
        
        setApplications([
          {
            id: 'a1',
            jobId: '1',
            jobTitle: 'Construction Helper',
            company: 'BuildRight Construction',
            location: 'Madhapur, Hyderabad',
            salary: '₹15,000 - ₹20,000',
            appliedDate: '2023-09-10T14:30:00',
            status: 'Under Review',
          },
          {
            id: 'a2',
            jobId: '2',
            jobTitle: 'Data Entry Specialist',
            company: 'TechSolutions',
            location: 'Hitech City, Hyderabad',
            salary: '₹20,000 - ₹25,000',
            appliedDate: '2023-09-05T09:15:00',
            status: 'Shortlisted',
          }
        ]);
      } else if (profile?.user_type === 'employer') {
        setPostedJobs([
          {
            id: 'j1',
            title: 'Delivery Driver',
            location: 'Gachibowli, Hyderabad',
            applications: 12,
            postedDate: '2023-08-20T10:30:00',
            salary: '₹15,000 - ₹18,000',
            status: 'Active',
          },
          {
            id: 'j2',
            title: 'Warehouse Associate',
            location: 'Secunderabad, Hyderabad',
            applications: 8,
            postedDate: '2023-08-15T14:45:00',
            salary: '₹12,000 - ₹15,000',
            status: 'Active',
          },
          {
            id: 'j3',
            title: 'Content Writer',
            location: 'Remote - Hyderabad',
            applications: 5,
            postedDate: '2023-08-10T09:15:00',
            salary: '₹20,000 - ₹25,000',
            status: 'Closed',
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Calculate days ago from date string
  const getDaysAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMilliseconds = now.getTime() - date.getTime();
    const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);
    
    if (diffInDays < 1) {
      return 'Today';
    } else if (diffInDays < 2) {
      return 'Yesterday';
    } else {
      return `${Math.floor(diffInDays)} days ago`;
    }
  };
  
  if (!user) {
    return null; // Will be redirected by useRequireAuth
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {profile?.first_name || user.email}! Here's an overview of your activity.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <Card variant="bordered" className="overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="Profile" className="h-full w-full rounded-full object-cover" />
                      ) : (
                        <span className="text-xl font-semibold">{profile?.first_name?.charAt(0) || user.email?.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{profile?.first_name} {profile?.last_name}</h3>
                      <p className="text-sm text-muted-foreground">{profile?.user_type === 'employer' ? 'Employer' : 'Job Seeker'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex justify-between text-sm py-2">
                      <span className="text-muted-foreground">Account Type</span>
                      <span className="font-medium">{profile?.user_type === 'employer' ? 'Employer' : 'Job Seeker'}</span>
                    </div>
                    <div className="flex justify-between text-sm py-2">
                      <span className="text-muted-foreground">Location</span>
                      <span className="font-medium">{profile?.location || 'Hyderabad'}</span>
                    </div>
                    <div className="flex justify-between text-sm py-2">
                      <span className="text-muted-foreground">Member Since</span>
                      <span className="font-medium">Aug 2023</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    Edit Profile
                  </Button>
                </div>
              </Card>
              
              {profile?.user_type === 'job_seeker' && (
                <Card variant="bordered">
                  <div className="p-6">
                    <h3 className="font-semibold mb-4">Account Status</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CheckCircle size={16} className="text-green-500 mr-2" />
                          <span className="text-sm">Profile Complete</span>
                        </div>
                        <Badge variant="success" size="sm">Verified</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CheckCircle size={16} className="text-green-500 mr-2" />
                          <span className="text-sm">ID Verification</span>
                        </div>
                        <Badge variant="success" size="sm">Verified</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CheckCircle size={16} className="text-amber-500 mr-2" />
                          <span className="text-sm">Bank Account</span>
                        </div>
                        <Badge variant="warning" size="sm">Pending</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CheckCircle size={16} className="text-green-500 mr-2" />
                          <span className="text-sm">Mobile Number</span>
                        </div>
                        <Badge variant="success" size="sm">Verified</Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
              
              {profile?.user_type === 'employer' && (
                <Card variant="bordered">
                  <div className="p-6">
                    <h3 className="font-semibold mb-4">Company Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm py-2">
                        <span className="text-muted-foreground">Company Name</span>
                        <span className="font-medium">Acme Inc.</span>
                      </div>
                      <div className="flex justify-between text-sm py-2">
                        <span className="text-muted-foreground">Industry</span>
                        <span className="font-medium">Technology</span>
                      </div>
                      <div className="flex justify-between text-sm py-2">
                        <span className="text-muted-foreground">Size</span>
                        <span className="font-medium">10-50 employees</span>
                      </div>
                      <div className="flex justify-between text-sm py-2">
                        <span className="text-muted-foreground">GST Number</span>
                        <span className="font-medium">29AADCB2230M1ZT</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      Update Company Info
                    </Button>
                  </div>
                </Card>
              )}
              
              <Card variant="bordered">
                <div className="p-6">
                  <h3 className="font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    {profile?.user_type === 'job_seeker' ? (
                      <>
                        <Button variant="primary" size="sm" className="w-full justify-start" onClick={() => navigate('/jobs')}>
                          <Briefcase size={16} className="mr-2" />
                          Find New Jobs
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <FileText size={16} className="mr-2" />
                          Update Resume
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Bell size={16} className="mr-2" />
                          Set Job Alerts
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="primary" size="sm" className="w-full justify-start" onClick={() => navigate('/post-job')}>
                          <Briefcase size={16} className="mr-2" />
                          Post New Job
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <BarChart2 size={16} className="mr-2" />
                          View Analytics
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <FileText size={16} className="mr-2" />
                          Manage Payments
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  {profile?.user_type === 'job_seeker' ? (
                    <>
                      <TabsTrigger value="applications">Applications</TabsTrigger>
                      <TabsTrigger value="job-history">Job History</TabsTrigger>
                    </>
                  ) : (
                    <>
                      <TabsTrigger value="posted-jobs">Posted Jobs</TabsTrigger>
                      <TabsTrigger value="applicants">Applicants</TabsTrigger>
                    </>
                  )}
                </TabsList>
                
                {/* Overview Tab */}
                <TabsContent value="overview" className="mt-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {profile?.user_type === 'job_seeker' ? (
                      <>
                        <Card variant="bordered" className="p-6">
                          <div className="flex items-start">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4">
                              <Briefcase size={20} />
                            </div>
                            <div>
                              <p className="text-muted-foreground text-sm">Total Applications</p>
                              <h3 className="text-2xl font-bold mt-1">{applications.length}</h3>
                            </div>
                          </div>
                        </Card>
                        <Card variant="bordered" className="p-6">
                          <div className="flex items-start">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-4">
                              <CheckCircle size={20} />
                            </div>
                            <div>
                              <p className="text-muted-foreground text-sm">Completed Jobs</p>
                              <h3 className="text-2xl font-bold mt-1">{jobHistory.length}</h3>
                            </div>
                          </div>
                        </Card>
                        <Card variant="bordered" className="p-6">
                          <div className="flex items-start">
                            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-4">
                              <Star size={20} />
                            </div>
                            <div>
                              <p className="text-muted-foreground text-sm">Avg. Rating</p>
                              <h3 className="text-2xl font-bold mt-1">4.8</h3>
                            </div>
                          </div>
                        </Card>
                      </>
                    ) : (
                      <>
                        <Card variant="bordered" className="p-6">
                          <div className="flex items-start">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4">
                              <Briefcase size={20} />
                            </div>
                            <div>
                              <p className="text-muted-foreground text-sm">Active Jobs</p>
                              <h3 className="text-2xl font-bold mt-1">{postedJobs.filter(job => job.status === 'Active').length}</h3>
                            </div>
                          </div>
                        </Card>
                        <Card variant="bordered" className="p-6">
                          <div className="flex items-start">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                              <FileText size={20} />
                            </div>
                            <div>
                              <p className="text-muted-foreground text-sm">Total Applications</p>
                              <h3 className="text-2xl font-bold mt-1">25</h3>
                            </div>
                          </div>
                        </Card>
                        <Card variant="bordered" className="p-6">
                          <div className="flex items-start">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-4">
                              <CheckCircle size={20} />
                            </div>
                            <div>
                              <p className="text-muted-foreground text-sm">Hired Workers</p>
                              <h3 className="text-2xl font-bold mt-1">8</h3>
                            </div>
                          </div>
                        </Card>
                      </>
                    )}
                  </div>
                  
                  {/* Recent Activity */}
                  <Card variant="bordered" className="mb-6">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                      
                      {profile?.user_type === 'job_seeker' ? (
                        <div className="space-y-6">
                          <div className="flex items-start">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 mt-1">
                              <Briefcase size={18} />
                            </div>
                            <div className="ml-4">
                              <p className="font-medium">Applied for Data Entry Specialist at TechSolutions</p>
                              <p className="text-sm text-muted-foreground mt-1">5 days ago</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0 mt-1">
                              <CheckCircle size={18} />
                            </div>
                            <div className="ml-4">
                              <p className="font-medium">Completed Warehouse Associate job at Global Logistics</p>
                              <p className="text-sm text-muted-foreground mt-1">2 weeks ago</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0 mt-1">
                              <Star size={18} />
                            </div>
                            <div className="ml-4">
                              <p className="font-medium">Received a 5-star rating from QuickMart</p>
                              <p className="text-sm text-muted-foreground mt-1">1 month ago</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="flex items-start">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 mt-1">
                              <Briefcase size={18} />
                            </div>
                            <div className="ml-4">
                              <p className="font-medium">Posted a new job: Delivery Driver</p>
                              <p className="text-sm text-muted-foreground mt-1">3 days ago</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0 mt-1">
                              <FileText size={18} />
                            </div>
                            <div className="ml-4">
                              <p className="font-medium">New application received for Warehouse Associate</p>
                              <p className="text-sm text-muted-foreground mt-1">1 week ago</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0 mt-1">
                              <CheckCircle size={18} />
                            </div>
                            <div className="ml-4">
                              <p className="font-medium">Hired Arjun Kumar for Content Writer position</p>
                              <p className="text-sm text-muted-foreground mt-1">2 weeks ago</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                  
                  {/* Recommended Jobs or Workers */}
                  <Card variant="bordered">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-4">
                        {profile?.user_type === 'job_seeker' ? 'Recommended Jobs' : 'Recommended Workers'}
                      </h3>
                      
                      {profile?.user_type === 'job_seeker' ? (
                        <div className="space-y-4">
                          <div className="border rounded-lg p-4 hover:border-primary transition-colors">
                            <h4 className="font-medium">Construction Helper</h4>
                            <p className="text-sm text-muted-foreground">BuildRight Construction • Madhapur, Hyderabad</p>
                            <div className="flex flex-wrap gap-y-2 gap-x-4 mt-2 text-sm">
                              <div className="flex items-center text-muted-foreground">
                                <IndianRupee size={14} className="mr-1" />
                                <span>₹15,000 - ₹20,000</span>
                              </div>
                              <div className="flex items-center text-muted-foreground">
                                <Clock size={14} className="mr-1" />
                                <span>Full-time</span>
                              </div>
                            </div>
                            <Button variant="primary" size="sm" className="mt-3">
                              Apply Now
                            </Button>
                          </div>
                          
                          <div className="border rounded-lg p-4 hover:border-primary transition-colors">
                            <h4 className="font-medium">Customer Service Representative</h4>
                            <p className="text-sm text-muted-foreground">ServiceFirst • Ameerpet, Hyderabad</p>
                            <div className="flex flex-wrap gap-y-2 gap-x-4 mt-2 text-sm">
                              <div className="flex items-center text-muted-foreground">
                                <IndianRupee size={14} className="mr-1" />
                                <span>₹18,000 - ₹22,000</span>
                              </div>
                              <div className="flex items-center text-muted-foreground">
                                <Clock size={14} className="mr-1" />
                                <span>Part-time</span>
                              </div>
                            </div>
                            <Button variant="primary" size="sm" className="mt-3">
                              Apply Now
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="border rounded-lg p-4 hover:border-primary transition-colors">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center mr-3">
                                <span className="font-medium">RK</span>
                              </div>
                              <div>
                                <h4 className="font-medium">Rahul Kumar</h4>
                                <p className="text-sm text-muted-foreground">Delivery Driver • 4.9 ★</p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-y-2 gap-x-4 mt-3 text-sm">
                              <div className="flex items-center text-muted-foreground">
                                <MapPin size={14} className="mr-1" />
                                <span>Gachibowli, Hyderabad</span>
                              </div>
                              <div className="flex items-center text-muted-foreground">
                                <Clock size={14} className="mr-1" />
                                <span>Available Immediately</span>
                              </div>
                            </div>
                            <Button variant="primary" size="sm" className="mt-3">
                              View Profile
                            </Button>
                          </div>
                          
                          <div className="border rounded-lg p-4 hover:border-primary transition-colors">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center mr-3">
                                <span className="font-medium">SP</span>
                              </div>
                              <div>
                                <h4 className="font-medium">Sneha Patel</h4>
                                <p className="text-sm text-muted-foreground">Customer Service • 4.7 ★</p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-y-2 gap-x-4 mt-3 text-sm">
                              <div className="flex items-center text-muted-foreground">
                                <MapPin size={14} className="mr-1" />
                                <span>Hitech City, Hyderabad</span>
                              </div>
                              <div className="flex items-center text-muted-foreground">
                                <Clock size={14} className="mr-1" />
                                <span>Available in 1 week</span>
                              </div>
                            </div>
                            <Button variant="primary" size="sm" className="mt-3">
                              View Profile
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                </TabsContent>
                
                {/* Job Applications Tab */}
                {profile?.user_type === 'job_seeker' && (
                  <TabsContent value="applications" className="mt-6">
                    <Card variant="bordered">
                      <div className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Your Applications</h3>
                        
                        {applications.length > 0 ? (
                          <div className="space-y-6">
                            {applications.map((application) => (
                              <div key={application.id} className="border-b pb-6 last:border-0 last:pb-0">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                  <div>
                                    <h4 className="font-medium text-lg">{application.jobTitle}</h4>
                                    <p className="text-muted-foreground">{application.company}</p>
                                    
                                    <div className="flex flex-wrap gap-y-2 gap-x-4 mt-2">
                                      <div className="flex items-center text-sm text-muted-foreground">
                                        <MapPin size={14} className="mr-1" />
                                        <span>{application.location}</span>
                                      </div>
                                      <div className="flex items-center text-sm text-muted-foreground">
                                        <IndianRupee size={14} className="mr-1" />
                                        <span>{application.salary}</span>
                                      </div>
                                      <div className="flex items-center text-sm text-muted-foreground">
                                        <Calendar size={14} className="mr-1" />
                                        <span>Applied {getDaysAgo(application.appliedDate)}</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-3 md:mt-0">
                                    <Badge 
                                      variant={
                                        application.status === 'Under Review' ? 'warning' : 
                                        application.status === 'Shortlisted' ? 'success' :
                                        application.status === 'Rejected' ? 'danger' : 'default'
                                      }
                                    >
                                      {application.status}
                                    </Badge>
                                  </div>
                                </div>
                                
                                <div className="flex space-x-3 mt-4">
                                  <Button variant="outline" size="sm">
                                    View Details
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    Withdraw
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-10">
                            <p className="text-muted-foreground mb-4">You haven't applied to any jobs yet</p>
                            <Button variant="primary" onClick={() => navigate('/jobs')}>
                              Browse Jobs
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  </TabsContent>
                )}
                
                {/* Job History Tab */}
                {profile?.user_type === 'job_seeker' && (
                  <TabsContent value="job-history" className="mt-6">
                    <Card variant="bordered">
                      <div className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Job History</h3>
                        
                        {jobHistory.length > 0 ? (
                          <div className="space-y-6">
                            {jobHistory.map((job) => (
                              <div key={job.id} className="border-b pb-6 last:border-0 last:pb-0">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                  <div>
                                    <h4 className="font-medium text-lg">{job.title}</h4>
                                    <p className="text-muted-foreground">{job.company}</p>
                                    
                                    <div className="flex flex-wrap gap-y-2 gap-x-4 mt-2">
                                      <div className="flex items-center text-sm text-muted-foreground">
                                        <MapPin size={14} className="mr-1" />
                                        <span>{job.location}</span>
                                      </div>
                                      <div className="flex items-center text-sm text-muted-foreground">
                                        <IndianRupee size={14} className="mr-1" />
                                        <span>{job.salary}</span>
                                      </div>
                                      <div className="flex items-center text-sm text-muted-foreground">
                                        <Calendar size={14} className="mr-1" />
                                        <span>{job.date}</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-3 md:mt-0 flex items-center">
                                    <Badge variant="success" className="mr-3">
                                      {job.status}
                                    </Badge>
                                    {job.rating && (
                                      <div className="flex items-center text-amber-500">
                                        <Star size={16} className="fill-current mr-1" />
                                        <span>{job.rating}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="flex space-x-3 mt-4">
                                  <Button variant="outline" size="sm">
                                    View Details
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    Download Certificate
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-10">
                            <p className="text-muted-foreground mb-4">You haven't completed any jobs yet</p>
                            <Button variant="primary" onClick={() => navigate('/jobs')}>
                              Find Jobs
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  </TabsContent>
                )}
                
                {/* Posted Jobs Tab */}
                {profile?.user_type === 'employer' && (
                  <TabsContent value="posted-jobs" className="mt-6">
                    <Card variant="bordered">
                      <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold">Your Posted Jobs</h3>
                          <Button variant="primary" size="sm" onClick={() => navigate('/post-job')}>
                            Post New Job
                          </Button>
                        </div>
                        
                        {postedJobs.length > 0 ? (
                          <div className="space-y-6">
                            {postedJobs.map((job) => (
                              <div key={job.id} className="border-b pb-6 last:border-0 last:pb-0">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                  <div>
                                    <h4 className="font-medium text-lg">{job.title}</h4>
                                    <div className="flex flex-wrap gap-y-2 gap-x-4 mt-2">
                                      <div className="flex items-center text-sm text-muted-foreground">
                                        <MapPin size={14} className="mr-1" />
                                        <span>{job.location}</span>
                                      </div>
                                      <div className="flex items-center text-sm text-muted-foreground">
                                        <IndianRupee size={14} className="mr-1" />
                                        <span>{job.salary}</span>
                                      </div>
                                      <div className="flex items-center text-sm text-muted-foreground">
                                        <FileText size={14} className="mr-1" />
                                        <span>{job.applications} Applications</span>
                                      </div>
                                      <div className="flex items-center text-sm text-muted-foreground">
                                        <Calendar size={14} className="mr-1" />
                                        <span>Posted {getDaysAgo(job.postedDate)}</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-3 md:mt-0">
                                    <Badge 
                                      variant={job.status === 'Active' ? 'success' : 'secondary'}
                                    >
                                      {job.status}
                                    </Badge>
                                  </div>
                                </div>
                                
                                <div className="flex space-x-3 mt-4">
                                  <Button variant="outline" size="sm">
                                    View Details
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    {job.status === 'Active' ? 'Close Job' : 'Reopen Job'}
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-10">
                            <p className="text-muted-foreground mb-4">You haven't posted any jobs yet</p>
                            <Button variant="primary" onClick={() => navigate('/post-job')}>
                              Post a Job
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  </TabsContent>
                )}
                
                {/* Applicants Tab */}
                {profile?.user_type === 'employer' && (
                  <TabsContent value="applicants" className="mt-6">
                    <Card variant="bordered">
                      <div className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Recent Applicants</h3>
                        
                        <div className="space-y-6">
                          <div className="border-b pb-6">
                            <div className="flex items-start">
                              <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mr-4 flex-shrink-0">
                                <span className="font-semibold">RP</span>
                              </div>
                              <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:justify-between">
                                  <div>
                                    <h4 className="font-medium">Rajesh Patel</h4>
                                    <p className="text-sm text-muted-foreground">Applied for Delivery Driver</p>
                                  </div>
                                  <div className="mt-2 md:mt-0">
                                    <Badge variant="secondary">New</Badge>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-y-2 gap-x-4 mt-2 text-sm">
                                  <div className="flex items-center text-muted-foreground">
                                    <MapPin size={14} className="mr-1" />
                                    <span>Madhapur, Hyderabad</span>
                                  </div>
                                  <div className="flex items-center text-muted-foreground">
                                    <Star size={14} className="fill-current text-amber-500 mr-1" />
                                    <span>4.8 (15 jobs)</span>
                                  </div>
                                  <div className="flex items-center text-muted-foreground">
                                    <Calendar size={14} className="mr-1" />
                                    <span>Applied Today</span>
                                  </div>
                                </div>
                                <div className="flex space-x-3 mt-3">
                                  <Button variant="primary" size="sm">
                                    View Profile
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    Contact
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border-b pb-6">
                            <div className="flex items-start">
                              <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mr-4 flex-shrink-0">
                                <span className="font-semibold">AK</span>
                              </div>
                              <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:justify-between">
                                  <div>
                                    <h4 className="font-medium">Ananya Kumar</h4>
                                    <p className="text-sm text-muted-foreground">Applied for Warehouse Associate</p>
                                  </div>
                                  <div className="mt-2 md:mt-0">
                                    <Badge variant="secondary">New</Badge>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-y-2 gap-x-4 mt-2 text-sm">
                                  <div className="flex items-center text-muted-foreground">
                                    <MapPin size={14} className="mr-1" />
                                    <span>Gachibowli, Hyderabad</span>
                                  </div>
                                  <div className="flex items-center text-muted-foreground">
                                    <Star size={14} className="fill-current text-amber-500 mr-1" />
                                    <span>4.6 (8 jobs)</span>
                                  </div>
                                  <div className="flex items-center text-muted-foreground">
                                    <Calendar size={14} className="mr-1" />
                                    <span>Applied Yesterday</span>
                                  </div>
                                </div>
                                <div className="flex space-x-3 mt-3">
                                  <Button variant="primary" size="sm">
                                    View Profile
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    Contact
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex items-start">
                              <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mr-4 flex-shrink-0">
                                <span className="font-semibold">VS</span>
                              </div>
                              <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:justify-between">
                                  <div>
                                    <h4 className="font-medium">Vijay Singh</h4>
                                    <p className="text-sm text-muted-foreground">Applied for Warehouse Associate</p>
                                  </div>
                                  <div className="mt-2 md:mt-0">
                                    <Badge variant="warning">Shortlisted</Badge>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-y-2 gap-x-4 mt-2 text-sm">
                                  <div className="flex items-center text-muted-foreground">
                                    <MapPin size={14} className="mr-1" />
                                    <span>Secunderabad, Hyderabad</span>
                                  </div>
                                  <div className="flex items-center text-muted-foreground">
                                    <Star size={14} className="fill-current text-amber-500 mr-1" />
                                    <span>4.9 (20 jobs)</span>
                                  </div>
                                  <div className="flex items-center text-muted-foreground">
                                    <Calendar size={14} className="mr-1" />
                                    <span>Applied 3 days ago</span>
                                  </div>
                                </div>
                                <div className="flex space-x-3 mt-3">
                                  <Button variant="primary" size="sm">
                                    View Profile
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    Contact
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </TabsContent>
                )}
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
