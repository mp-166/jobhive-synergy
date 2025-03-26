
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Briefcase, Star, MapPin, Clock, CheckCircle, Settings, Edit, Plus, Upload } from 'lucide-react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  
  // Sample user data
  const userData = {
    name: 'Arjun Kumar',
    title: 'Experienced Driver & General Labor',
    location: 'Hyderabad, Telangana',
    joinedDate: 'August 2023',
    completedJobs: 12,
    rating: 4.8,
    bio: 'I am an experienced driver with 5+ years of experience. I also take general labor jobs and pride myself on being reliable and punctual.',
    skills: ['Driving', 'Loading/Unloading', 'Construction Helper', 'Warehouse Work', 'Delivery'],
    availability: 'Weekdays, Weekends',
    preferredJobs: ['Driver', 'Delivery', 'General Labor'],
    education: [
      {
        institution: 'Hyderabad Public School',
        degree: 'High School Diploma',
        year: '2015',
      },
    ],
    experience: [
      {
        company: 'City Logistics',
        position: 'Delivery Driver',
        duration: 'Jan 2018 - Mar 2023',
        description: 'Handled deliveries across the city, maintained delivery records, and ensured timely delivery of packages.',
      },
      {
        company: 'BuildRight Construction',
        position: 'Construction Helper',
        duration: 'Jun 2017 - Dec 2017',
        description: 'Assisted in construction projects, loaded and unloaded materials, and supported skilled workers on site.',
      },
    ],
    documents: [
      { name: 'Driver\'s License', verified: true },
      { name: 'Identity Card', verified: true },
      { name: 'Address Proof', verified: false },
    ],
    jobHistory: [
      {
        title: 'Delivery Driver',
        company: 'QuickMart',
        date: 'July 15 - July 25, 2023',
        status: 'Completed',
        amount: '₹12,000',
        rating: 5,
      },
      {
        title: 'Warehouse Associate',
        company: 'Global Logistics',
        date: 'June 5 - June 15, 2023',
        status: 'Completed',
        amount: '₹10,000',
        rating: 4.5,
      },
      {
        title: 'Event Helper',
        company: 'EventPro',
        date: 'May 20 - May 22, 2023',
        status: 'Completed',
        amount: '₹3,000',
        rating: 5,
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-sm border mb-8 overflow-hidden">
            <div className="h-36 bg-gradient-to-r from-primary/80 to-primary"></div>
            
            <div className="px-6 sm:px-8 relative">
              <div className="flex flex-col md:flex-row md:items-end mb-6">
                <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md absolute -top-12 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full rounded-full bg-secondary flex items-center justify-center text-3xl font-bold">
                    {userData.name.charAt(0)}
                  </div>
                </div>
                
                <div className="md:ml-28 pt-16 md:pt-4 pb-4 flex-grow">
                  <h1 className="text-2xl font-bold mb-1">{userData.name}</h1>
                  <p className="text-muted-foreground mb-2">{userData.title}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-1 text-muted-foreground" />
                      <span>{userData.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={16} className="mr-1 text-muted-foreground" />
                      <span>Joined {userData.joinedDate}</span>
                    </div>
                    <div className="flex items-center">
                      <Briefcase size={16} className="mr-1 text-muted-foreground" />
                      <span>{userData.completedJobs} jobs completed</span>
                    </div>
                    <div className="flex items-center text-amber-500">
                      <Star size={16} className="mr-1" />
                      <span>{userData.rating}/5</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 flex space-x-3">
                  <Button variant="outline" leftIcon={<Edit size={16} />} size="sm">
                    Edit Profile
                  </Button>
                  <Button variant="ghost" leftIcon={<Settings size={16} />} size="sm">
                    Settings
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Profile Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="space-y-6">
              <Card variant="bordered">
                <h2 className="text-lg font-semibold mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {userData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                  <Button variant="ghost" size="sm" className="h-7 flex items-center">
                    <Plus size={14} className="mr-1" /> Add
                  </Button>
                </div>
              </Card>
              
              <Card variant="bordered">
                <h2 className="text-lg font-semibold mb-4">Availability</h2>
                <p className="mb-2">{userData.availability}</p>
                <Button variant="outline" size="sm">
                  Update Availability
                </Button>
              </Card>
              
              <Card variant="bordered">
                <h2 className="text-lg font-semibold mb-4">Preferred Jobs</h2>
                <div className="space-y-2">
                  {userData.preferredJobs.map((job, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle size={16} className="mr-2 text-primary" />
                      <span>{job}</span>
                    </div>
                  ))}
                </div>
              </Card>
              
              <Card variant="bordered">
                <h2 className="text-lg font-semibold mb-4">Verified Documents</h2>
                <div className="space-y-3">
                  {userData.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        {doc.verified ? (
                          <CheckCircle size={16} className="mr-2 text-green-500" />
                        ) : (
                          <Clock size={16} className="mr-2 text-amber-500" />
                        )}
                        <span>{doc.name}</span>
                      </div>
                      <Badge variant={doc.verified ? "success" : "warning"}>
                        {doc.verified ? "Verified" : "Pending"}
                      </Badge>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full mt-2" leftIcon={<Upload size={14} />}>
                    Upload Document
                  </Button>
                </div>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="jobHistory">Job History</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" className="space-y-6">
                  <Card variant="bordered">
                    <h2 className="text-lg font-semibold mb-4">About Me</h2>
                    <p className="text-muted-foreground">{userData.bio}</p>
                  </Card>
                  
                  <Card variant="bordered">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold">Work Experience</h2>
                      <Button variant="ghost" size="sm" leftIcon={<Plus size={14} />}>
                        Add
                      </Button>
                    </div>
                    
                    <div className="space-y-6">
                      {userData.experience.map((exp, index) => (
                        <div key={index} className={index !== 0 ? "pt-6 border-t" : ""}>
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                            <h3 className="font-medium">{exp.position}</h3>
                            <span className="text-sm text-muted-foreground">{exp.duration}</span>
                          </div>
                          <p className="text-sm mb-1">{exp.company}</p>
                          <p className="text-sm text-muted-foreground">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                  
                  <Card variant="bordered">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold">Education</h2>
                      <Button variant="ghost" size="sm" leftIcon={<Plus size={14} />}>
                        Add
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {userData.education.map((edu, index) => (
                        <div key={index}>
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                            <h3 className="font-medium">{edu.degree}</h3>
                            <span className="text-sm text-muted-foreground">{edu.year}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{edu.institution}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                </TabsContent>
                
                <TabsContent value="jobHistory">
                  <Card variant="bordered">
                    <h2 className="text-lg font-semibold mb-6">Job History</h2>
                    
                    <div className="space-y-6">
                      {userData.jobHistory.map((job, index) => (
                        <div key={index} className={index !== 0 ? "pt-6 border-t" : ""}>
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                            <h3 className="font-medium">{job.title}</h3>
                            <Badge variant="success">{job.status}</Badge>
                          </div>
                          <p className="text-sm mb-1">{job.company}</p>
                          <div className="flex flex-col sm:flex-row justify-between mt-2">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock size={14} className="mr-1" />
                              <span>{job.date}</span>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end mt-2 sm:mt-0 sm:space-x-4">
                              <div className="flex items-center text-amber-500">
                                <Star size={14} className="mr-1" />
                                <span>{job.rating}/5</span>
                              </div>
                              <div className="font-medium">{job.amount}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </TabsContent>
                
                <TabsContent value="reviews">
                  <Card variant="bordered">
                    <h2 className="text-lg font-semibold mb-4">Reviews</h2>
                    <div className="flex items-center mb-6">
                      <div className="flex items-center text-amber-500 mr-4">
                        <Star className="fill-current mr-1" size={20} />
                        <span className="text-2xl font-bold">{userData.rating}</span>
                        <span className="text-sm ml-1">/ 5</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Based on feedback from {userData.completedJobs} completed jobs
                      </div>
                    </div>
                    
                    <div className="text-center py-10">
                      <p className="text-muted-foreground mb-4">Reviews will appear here after clients rate your work</p>
                      <Button variant="outline">Browse Jobs</Button>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
