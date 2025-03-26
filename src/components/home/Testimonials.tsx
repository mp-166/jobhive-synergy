
import React, { useEffect, useRef, useState } from 'react';
import Card from '@/components/common/Card';

const Testimonials = () => {
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = testimonialsRef.current?.querySelectorAll('.animate-in-view');
    elements?.forEach((el) => observer.observe(el));

    return () => {
      elements?.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const testimonials = [
    {
      quote: "Empower helped me find consistent work when I needed it most. The secure payment system gives me peace of mind that I'll always get paid for my work.",
      name: "Rahul Sharma",
      role: "Freelance Designer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&h=256&q=80",
    },
    {
      quote: "As a small business owner, finding reliable workers used to be a challenge. Empower has streamlined our hiring process for temporary staff, saving us time and money.",
      name: "Priya Patel",
      role: "Small Business Owner",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&h=256&q=80",
    },
    {
      quote: "The voice search feature makes job hunting accessible, even for my father who isn't tech-savvy. This platform truly lives up to its name by empowering everyone.",
      name: "Arjun Reddy",
      role: "IT Professional",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&h=256&q=80",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="section-padding" ref={testimonialsRef}>
      <div className="text-center mb-16">
        <div className="animate-in-view">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
            Testimonials
          </span>
        </div>
        <h2 className="animate-in-view heading-lg mb-6">What Our Users Say</h2>
        <p className="animate-in-view body-md text-muted-foreground max-w-2xl mx-auto">
          Hear from job seekers and employers who have found success using the Empower platform.
        </p>
      </div>
      
      <div className="max-w-5xl mx-auto animate-in-view">
        <div className="relative overflow-hidden pb-12">
          <div 
            className="transition-transform duration-500 ease-in-out flex"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.name} className="w-full flex-shrink-0 px-4">
                <Card variant="elevated" className="h-full p-8 md:p-10">
                  <div className="flex flex-col h-full">
                    <svg className="h-8 w-8 text-primary/40 mb-6" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                      <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                    </svg>
                    <p className="text-lg md:text-xl font-medium mb-8 flex-grow">"{testimonial.quote}"</p>
                    <div className="flex items-center mt-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <h4 className="text-base font-semibold">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-center space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 w-2.5 rounded-full transition-all ${
                activeIndex === index ? 'bg-primary w-8' : 'bg-primary/30'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
