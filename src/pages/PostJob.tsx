
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Briefcase, Check, ArrowRight } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  title: z.string().min(5, 'Job title must be at least 5 characters'),
  job_type: z.string().min(1, 'Please select a job type'),
  location: z.string().min(3, 'Location must be at least 3 characters'),
  salary_min: z.string().refine(val => !isNaN(Number(val)), {
    message: 'Minimum salary must be a number',
  }),
  salary_max: z.string().refine(val => !isNaN(Number(val)), {
    message: 'Maximum salary must be a number',
  }),
  skills: z.string().min(3, 'Please enter at least one skill'),
  description: z.string().min(30, 'Job description must be at least 30 characters'),
  requirements: z.string().min(10, 'Please specify job requirements'),
});

type FormValues = z.infer<typeof formSchema>;

const PostJob = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      job_type: '',
      location: '',
      salary_min: '',
      salary_max: '',
      skills: '',
      description: '',
      requirements: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to post a job",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Convert string skills to array
      const skillsArray = values.skills.split(',').map(skill => skill.trim());
      
      // Convert string requirements to array
      const requirementsArray = values.requirements.split(',').map(req => req.trim());
      
      // Insert job into the database
      const { data, error } = await supabase
        .from('jobs')
        .insert({
          title: values.title,
          job_type: values.job_type,
          location: values.location,
          salary_min: parseInt(values.salary_min),
          salary_max: parseInt(values.salary_max),
          skills: skillsArray,
          description: values.description,
          requirements: requirementsArray,
          employer_id: user.id,
          status: 'open',
        })
        .select();

      if (error) throw error;

      toast({
        title: "Job posted successfully!",
        description: "Your job has been posted and is now visible to job seekers.",
      });
      
      // Navigate to the posted job
      if (data && data[0]) {
        navigate(`/jobs/${data[0].id}`);
      } else {
        navigate('/jobs');
      }
    } catch (error) {
      console.error('Error posting job:', error);
      toast({
        title: "Failed to post job",
        description: "There was an error posting your job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="heading-lg mb-4">Post a New Job</h1>
            <p className="body-md text-muted-foreground max-w-3xl mx-auto">
              Create a job listing to find qualified workers for your needs.
            </p>
          </div>
          
          <Card className="p-6 shadow-sm">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Construction Helper" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="job_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select job type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Full-time">Full-time</SelectItem>
                            <SelectItem value="Part-time">Part-time</SelectItem>
                            <SelectItem value="Contract">Contract</SelectItem>
                            <SelectItem value="Temporary">Temporary</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Mumbai or Remote" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="salary_min"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Min Salary (₹)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="10000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="salary_max"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Salary (₹)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="20000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Required Skills</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Carpentry, Electrical, Plumbing (comma separated)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Provide a detailed description of the job" 
                          className="min-h-32" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="requirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Requirements</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="List specific requirements (e.g. Experience level, tools needed, etc.)" 
                          className="min-h-20" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="pt-4 flex justify-end">
                  <Button type="submit" disabled={isSubmitting} className="min-w-32">
                    {isSubmitting ? 'Posting...' : 'Post Job'}
                    {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </form>
            </Form>
          </Card>
          
          <div className="mt-8 bg-secondary/30 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Why post a job on Empower?</h3>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Access to a verified pool of skilled workers</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Secure payment processing with escrow protection</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Rating system to ensure quality work</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Support throughout the hiring process</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PostJob;
