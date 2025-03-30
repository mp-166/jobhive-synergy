
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Users, Target, Heart, Shield, MapPin, Award } from 'lucide-react';

const About = () => {
  const missionValues = [
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: 'Local Focus',
      description: 'We exclusively serve Hyderabad, understanding the unique needs and opportunities of our local job market.',
    },
    {
      icon: <Target className="h-10 w-10 text-primary" />,
      title: 'Meaningful Connections',
      description: 'We create meaningful connections between job seekers and employers based on skills, values, and potential.',
    },
    {
      icon: <Heart className="h-10 w-10 text-primary" />,
      title: 'Empowerment',
      description: 'We empower individuals to build fulfilling careers and help businesses find the talent they need to thrive.',
    },
    {
      icon: <Shield className="h-10 w-10 text-primary" />,
      title: 'Trust & Transparency',
      description: 'We maintain the highest standards of integrity, transparency, and data protection in all our operations.',
    },
  ];

  const teamMembers = [
    {
      name: 'Priya Sharma',
      role: 'Founder & CEO',
      bio: 'With 15+ years in HR and recruitment across Hyderabad\'s tech sector, Priya founded Empower to bridge the gap between local talent and opportunities.',
      image: '/placeholder.svg',
    },
    {
      name: 'Arjun Reddy',
      role: 'Head of Employer Relations',
      bio: 'Arjun works directly with Hyderabad businesses to understand their hiring needs and help them find the perfect candidates.',
      image: '/placeholder.svg',
    },
    {
      name: 'Lakshmi Devi',
      role: 'Career Development Lead',
      bio: 'Lakshmi oversees our resources section and organizes career development events throughout Hyderabad.',
      image: '/placeholder.svg',
    },
    {
      name: 'Raj Kumar',
      role: 'Technology Director',
      bio: 'Raj ensures our platform provides a seamless experience for job seekers and employers across Hyderabad.',
      image: '/placeholder.svg',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary/50 to-background py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="heading-xl mb-6">About Empower</h1>
          <p className="body-lg max-w-3xl mx-auto mb-8 text-muted-foreground">
            Connecting Hyderabad's talent with local opportunities since 2023.
            We're on a mission to transform how people find jobs and build careers in our city.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/jobs">Explore Jobs</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="heading-md mb-6">Our Story</h2>
            <p className="body-md mb-4">
              Empower was born out of a simple observation: despite Hyderabad's booming job market, many local talents struggled to find suitable opportunities, while businesses faced challenges in recruiting qualified candidates.
            </p>
            <p className="body-md mb-4">
              Founded in 2023, we started with a vision to create a platform specifically designed for Hyderabad's unique employment ecosystem. Unlike national or global job portals, we focus exclusively on connecting local talent with local opportunities.
            </p>
            <p className="body-md mb-4">
              Our platform is built from the ground up with an understanding of Hyderabad's diverse industries, from its renowned IT sector to emerging fields like pharmaceuticals, education, and hospitality.
            </p>
            <p className="body-md">
              Today, Empower serves thousands of job seekers and hundreds of employers across Hyderabad, facilitating meaningful career connections every day.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img 
              src="/placeholder.svg" 
              alt="Empower team in Hyderabad" 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* Mission and Values */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-md mb-4">Our Mission & Values</h2>
            <p className="body-md max-w-3xl mx-auto">
              We're guided by a simple mission: to empower Hyderabad's workforce and businesses to reach their full potential through meaningful employment connections.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {missionValues.map((value, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-md transition-shadow">
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Coverage */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="heading-md mb-4">Our Coverage in Hyderabad</h2>
          <p className="body-md max-w-3xl mx-auto">
            We connect talent and opportunities across all areas of Hyderabad, from Hitec City to Secunderabad and beyond.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Western Hyderabad</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>Hitec City</li>
              <li>Gachibowli</li>
              <li>Madhapur</li>
              <li>Kondapur</li>
              <li>Manikonda</li>
              <li>Nanakramguda</li>
            </ul>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Central Hyderabad</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>Banjara Hills</li>
              <li>Jubilee Hills</li>
              <li>Somajiguda</li>
              <li>Begumpet</li>
              <li>Ameerpet</li>
              <li>Punjagutta</li>
            </ul>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Eastern & Northern Areas</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>Secunderabad</li>
              <li>Uppal</li>
              <li>ECIL</li>
              <li>Kompally</li>
              <li>Medchal</li>
              <li>Shamirpet</li>
            </ul>
          </Card>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-md mb-4">Meet Our Team</h2>
            <p className="body-md max-w-3xl mx-auto">
              Our dedicated team combines expertise in recruitment, technology, and local market knowledge to serve Hyderabad's job market.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-primary mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Award className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="heading-md mb-4">Our Impact</h2>
          <p className="body-md max-w-3xl mx-auto">
            What we've achieved since our launch in Hyderabad.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold text-primary mb-2">5,000+</p>
            <p className="text-muted-foreground">Registered Job Seekers</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-primary mb-2">300+</p>
            <p className="text-muted-foreground">Local Employers</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-primary mb-2">1,200+</p>
            <p className="text-muted-foreground">Successful Placements</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-primary mb-2">98%</p>
            <p className="text-muted-foreground">Satisfaction Rate</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="heading-md mb-6">Join Hyderabad's Leading Local Job Platform</h2>
          <p className="body-md max-w-3xl mx-auto mb-8">
            Whether you're looking for your next career opportunity or seeking to hire top local talent, 
            Empower is here to connect you with possibilities across Hyderabad.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/auth?tab=sign-up">Sign Up Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent text-white hover:bg-white/10" asChild>
              <Link to="/contact">Contact Our Team</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
