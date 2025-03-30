
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, BookOpen, Presentation, Lightbulb, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Resources = () => {
  const resourceCategories = [
    {
      id: 'resume',
      title: 'Resume Building',
      icon: <FileText className="h-8 w-8 text-primary" />,
      resources: [
        {
          title: 'Resume Writing Guide',
          description: 'Learn how to write an effective resume that highlights your skills and experience.',
          link: '#resume-guide',
        },
        {
          title: 'Resume Templates',
          description: 'Download professional resume templates tailored for job seekers in Hyderabad.',
          link: '#resume-templates',
        },
        {
          title: 'ATS-friendly Resume Tips',
          description: 'Make your resume stand out to applicant tracking systems used by employers.',
          link: '#ats-tips',
        },
      ],
    },
    {
      id: 'interview',
      title: 'Interview Preparation',
      icon: <Presentation className="h-8 w-8 text-primary" />,
      resources: [
        {
          title: 'Common Interview Questions',
          description: 'Prepare for your interviews with these frequently asked questions in Hyderabad companies.',
          link: '#interview-questions',
        },
        {
          title: 'Interview Etiquette',
          description: 'Learn about proper interview behavior and cultural expectations in Indian workplaces.',
          link: '#interview-etiquette',
        },
        {
          title: 'Technical Interview Guide',
          description: 'Prepare for technical interviews in IT, software, and engineering fields.',
          link: '#technical-interviews',
        },
      ],
    },
    {
      id: 'skills',
      title: 'Skill Development',
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      resources: [
        {
          title: 'In-Demand Skills in Hyderabad',
          description: 'Discover the most sought-after skills by employers in Hyderabad across different industries.',
          link: '#hyderabad-skills',
        },
        {
          title: 'Free Learning Resources',
          description: 'Access free courses, workshops, and training materials to enhance your skills.',
          link: '#free-learning',
        },
        {
          title: 'Local Training Centers',
          description: 'Find training centers and educational institutions in Hyderabad for professional development.',
          link: '#training-centers',
        },
      ],
    },
    {
      id: 'career',
      title: 'Career Planning',
      icon: <Lightbulb className="h-8 w-8 text-primary" />,
      resources: [
        {
          title: 'Industry Insights',
          description: 'Get insights into growing industries and job sectors in Hyderabad and Telangana.',
          link: '#industry-insights',
        },
        {
          title: 'Career Path Guides',
          description: 'Explore different career paths and progression opportunities in your field.',
          link: '#career-paths',
        },
        {
          title: 'Salary Guides',
          description: 'Access salary benchmarks for different positions in Hyderabad to help with negotiations.',
          link: '#salary-guides',
        },
      ],
    },
  ];

  return (
    <Layout>
      <div className="section-padding">
        <div className="max-w-4xl mx-auto">
          <h1 className="heading-lg mb-8 text-center">Career Resources</h1>
          <p className="body-lg text-muted-foreground mb-12 text-center">
            Access our collection of resources to help you prepare for your job search, 
            enhance your skills, and advance your career in Hyderabad.
          </p>
          
          <Tabs defaultValue="resume" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full mb-8">
              {resourceCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="flex flex-col items-center py-3">
                  {category.icon}
                  <span className="mt-2">{category.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {resourceCategories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {category.resources.map((resource, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-xl">{resource.title}</CardTitle>
                        <CardDescription>{resource.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button variant="outline" className="w-full" asChild>
                          <Link to={resource.link}>
                            <Download className="mr-2 h-4 w-4" /> Access Resource
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-8 bg-muted p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Looking for more {category.title.toLowerCase()} resources?</h3>
                  <p className="mb-4">
                    We're constantly updating our resource library with new content to help job seekers in Hyderabad.
                    Check back regularly or subscribe to our newsletter for updates.
                  </p>
                  <Button>
                    <Link to="/contact">Request Specific Resources</Link>
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
          
          <div className="mt-16 p-8 border rounded-lg bg-primary/5">
            <h2 className="heading-sm mb-4">Local Career Events in Hyderabad</h2>
            <p className="mb-6">
              Stay updated with job fairs, networking events, and career workshops happening in Hyderabad.
              These events provide excellent opportunities to connect with potential employers and enhance your professional network.
            </p>
            <Button variant="secondary">View Upcoming Events</Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Resources;
