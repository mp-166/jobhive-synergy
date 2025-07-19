import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MatchingRequest {
  action: 'find_matches' | 'auto_apply' | 'get_recommendations';
  jobId?: string;
  workerId?: string;
  filters?: {
    location?: string;
    maxDistance?: number; // in kilometers
    categories?: string[];
    minSalary?: number;
    maxSalary?: number;
    urgencyLevel?: string;
    skills?: string[];
  };
}

interface JobMatch {
  job: any;
  matchScore: number;
  matchReasons: string[];
  distance?: number;
}

interface WorkerMatch {
  worker: any;
  matchScore: number;
  matchReasons: string[];
  distance?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      throw new Error('Invalid authentication');
    }

    const { action, jobId, workerId, filters }: MatchingRequest = await req.json();

    // Calculate distance between two coordinates (Haversine formula)
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
      const R = 6371; // Earth's radius in kilometers
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    // Extract coordinates from location string (simplified)
    const getCoordinates = async (location: string): Promise<{ lat: number; lon: number } | null> => {
      // In a real implementation, you would use a geocoding service
      // For now, we'll use a simple mapping for major Indian cities
      const cityCoordinates: { [key: string]: { lat: number; lon: number } } = {
        'mumbai': { lat: 19.0760, lon: 72.8777 },
        'delhi': { lat: 28.7041, lon: 77.1025 },
        'bangalore': { lat: 12.9716, lon: 77.5946 },
        'hyderabad': { lat: 17.3850, lon: 78.4867 },
        'chennai': { lat: 13.0827, lon: 80.2707 },
        'kolkata': { lat: 22.5726, lon: 88.3639 },
        'pune': { lat: 18.5204, lon: 73.8567 },
        'ahmedabad': { lat: 23.0225, lon: 72.5714 },
        'jaipur': { lat: 26.9124, lon: 75.7873 },
        'lucknow': { lat: 26.8467, lon: 80.9462 }
      };

      const city = location.toLowerCase().split(',')[0].trim();
      return cityCoordinates[city] || null;
    };

    // Calculate job match score for a worker
    const calculateJobMatchScore = (job: any, worker: any, workerSkills: any[]): { score: number; reasons: string[] } => {
      let score = 0;
      const reasons: string[] = [];

      // Skills matching (40% weight)
      const jobSkills = job.skills || [];
      const workerSkillNames = workerSkills.map(ws => ws.skills_catalog.name.toLowerCase());
      const jobSkillsLower = jobSkills.map((s: string) => s.toLowerCase());
      
      const matchingSkills = jobSkillsLower.filter((skill: string) => 
        workerSkillNames.some(ws => ws.includes(skill) || skill.includes(ws))
      );
      
      if (matchingSkills.length > 0) {
        const skillMatchPercentage = matchingSkills.length / jobSkillsLower.length;
        score += skillMatchPercentage * 40;
        reasons.push(`${matchingSkills.length}/${jobSkillsLower.length} skills match`);
      }

      // Location proximity (25% weight)
      if (job.location && worker.location) {
        // Simplified location matching - exact match gets full points
        if (job.location.toLowerCase().includes(worker.location.toLowerCase()) ||
            worker.location.toLowerCase().includes(job.location.toLowerCase())) {
          score += 25;
          reasons.push('Location match');
        } else {
          // Partial location match (same state/region)
          const jobParts = job.location.toLowerCase().split(',');
          const workerParts = worker.location.toLowerCase().split(',');
          if (jobParts.some((part: string) => workerParts.some(wp => wp.trim() === part.trim()))) {
            score += 15;
            reasons.push('Regional location match');
          }
        }
      }

      // Salary expectations (20% weight)
      if (job.salary_min && job.salary_max) {
        const averageSalary = (job.salary_min + job.salary_max) / 2;
        // Assume worker is interested if salary is reasonable
        if (averageSalary >= 500) { // Minimum reasonable salary
          score += 20;
          reasons.push('Salary range acceptable');
        }
      }

      // Worker rating and experience (10% weight)
      if (worker.rating && worker.rating >= 4.0) {
        score += 5;
        reasons.push('High-rated worker');
      }
      if (worker.total_jobs_completed && worker.total_jobs_completed >= 5) {
        score += 5;
        reasons.push('Experienced worker');
      }

      // Urgency bonus (5% weight)
      if (job.urgency_level === 'urgent' || job.urgency_level === 'high') {
        score += 5;
        reasons.push('Urgent job');
      }

      return { score: Math.min(score, 100), reasons };
    };

    // Calculate worker match score for a job
    const calculateWorkerMatchScore = (worker: any, job: any, workerSkills: any[]): { score: number; reasons: string[] } => {
      let score = 0;
      const reasons: string[] = [];

      // Skills matching (40% weight)
      const jobSkills = job.skills || [];
      const workerSkillNames = workerSkills.map(ws => ws.skills_catalog.name.toLowerCase());
      const jobSkillsLower = jobSkills.map((s: string) => s.toLowerCase());
      
      const matchingSkills = jobSkillsLower.filter((skill: string) => 
        workerSkillNames.some(ws => ws.includes(skill) || skill.includes(ws))
      );
      
      if (matchingSkills.length > 0) {
        const skillMatchPercentage = matchingSkills.length / jobSkillsLower.length;
        score += skillMatchPercentage * 40;
        reasons.push(`${matchingSkills.length}/${jobSkillsLower.length} required skills available`);
      }

      // Worker rating and reliability (30% weight)
      if (worker.rating) {
        score += (worker.rating / 5) * 25;
        reasons.push(`${worker.rating}/5 worker rating`);
      }
      if (worker.verified) {
        score += 5;
        reasons.push('Verified worker');
      }

      // Experience level (20% weight)
      if (worker.total_jobs_completed) {
        const experienceScore = Math.min(worker.total_jobs_completed / 10, 1) * 20;
        score += experienceScore;
        reasons.push(`${worker.total_jobs_completed} jobs completed`);
      }

      // Location proximity (10% weight)
      if (job.location && worker.location) {
        if (job.location.toLowerCase().includes(worker.location.toLowerCase()) ||
            worker.location.toLowerCase().includes(job.location.toLowerCase())) {
          score += 10;
          reasons.push('Local worker');
        }
      }

      return { score: Math.min(score, 100), reasons };
    };

    switch (action) {
      case 'find_matches': {
        // Find job matches for a worker
        if (!workerId && !user.id) {
          throw new Error('Worker ID required');
        }

        const targetWorkerId = workerId || user.id;

        // Get worker profile and skills
        const { data: worker, error: workerError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', targetWorkerId)
          .single();

        if (workerError || !worker) {
          throw new Error('Worker not found');
        }

        const { data: workerSkills, error: skillsError } = await supabase
          .from('user_skills')
          .select(`
            *,
            skills_catalog (
              id,
              name,
              category
            )
          `)
          .eq('user_id', targetWorkerId);

        if (skillsError) {
          throw new Error('Failed to fetch worker skills');
        }

        // Build job query
        let jobQuery = supabase
          .from('jobs')
          .select('*')
          .eq('status', 'open')
          .neq('employer_id', targetWorkerId);

        // Apply filters
        if (filters?.categories?.length) {
          jobQuery = jobQuery.in('category', filters.categories);
        }
        if (filters?.minSalary) {
          jobQuery = jobQuery.gte('salary_min', filters.minSalary);
        }
        if (filters?.maxSalary) {
          jobQuery = jobQuery.lte('salary_max', filters.maxSalary);
        }
        if (filters?.urgencyLevel) {
          jobQuery = jobQuery.eq('urgency_level', filters.urgencyLevel);
        }

        const { data: jobs, error: jobsError } = await jobQuery.order('created_at', { ascending: false });

        if (jobsError) {
          throw new Error('Failed to fetch jobs');
        }

        // Calculate match scores
        const jobMatches: JobMatch[] = jobs.map(job => {
          const { score, reasons } = calculateJobMatchScore(job, worker, workerSkills);
          return {
            job,
            matchScore: score,
            matchReasons: reasons
          };
        }).filter(match => match.matchScore > 30) // Only show matches with >30% score
          .sort((a, b) => b.matchScore - a.matchScore)
          .slice(0, 20); // Limit to top 20 matches

        return new Response(
          JSON.stringify({
            success: true,
            matches: jobMatches,
            totalMatches: jobMatches.length
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'auto_apply': {
        // Automatically apply to matching jobs
        if (!jobId) {
          throw new Error('Job ID required for auto-apply');
        }

        // Get job details
        const { data: job, error: jobError } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', jobId)
          .single();

        if (jobError || !job) {
          throw new Error('Job not found');
        }

        if (!job.auto_match) {
          throw new Error('This job does not allow auto-matching');
        }

        // Get job required skills
        const jobSkills = job.skills || [];

        // Find matching workers
        let workerQuery = supabase
          .from('profiles')
          .select(`
            *,
            user_skills (
              *,
              skills_catalog (
                id,
                name,
                category
              )
            )
          `)
          .eq('user_type', 'worker')
          .eq('is_active', true)
          .neq('id', job.employer_id);

        const { data: workers, error: workersError } = await workerQuery;

        if (workersError) {
          throw new Error('Failed to fetch workers');
        }

        // Calculate match scores for workers
        const workerMatches: WorkerMatch[] = workers
          .map(worker => {
            const { score, reasons } = calculateWorkerMatchScore(worker, job, worker.user_skills);
            return {
              worker,
              matchScore: score,
              matchReasons: reasons
            };
          })
          .filter(match => match.matchScore > 50) // Only auto-apply for high matches
          .sort((a, b) => b.matchScore - a.matchScore)
          .slice(0, Math.min(job.workers_needed * 3, 10)); // Apply up to 3x needed workers, max 10

        // Create applications for top matches
        const applications = [];
        for (const match of workerMatches) {
          // Check if already applied
          const { data: existingApp } = await supabase
            .from('job_applications')
            .select('id')
            .eq('job_id', jobId)
            .eq('applicant_id', match.worker.id)
            .single();

          if (!existingApp) {
            const { data: application, error: appError } = await supabase
              .from('job_applications')
              .insert({
                job_id: jobId,
                applicant_id: match.worker.id,
                status: 'applied',
                auto_matched: true,
                cover_letter: `Auto-matched based on: ${match.matchReasons.join(', ')}`
              })
              .select()
              .single();

            if (!appError) {
              applications.push({
                application,
                matchScore: match.matchScore,
                worker: match.worker
              });

              // Send notification to worker
              await supabase
                .from('notifications')
                .insert({
                  user_id: match.worker.id,
                  title: 'New Job Match Found!',
                  message: `We found a job that matches your skills: ${job.title}`,
                  type: 'job_match',
                  action_url: `/jobs/${jobId}`
                });
            }
          }
        }

        return new Response(
          JSON.stringify({
            success: true,
            applicationsCreated: applications.length,
            applications: applications
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get_recommendations': {
        // Get personalized job recommendations for worker
        const workerId = user.id;

        // Get worker's application history to understand preferences
        const { data: applications } = await supabase
          .from('job_applications')
          .select(`
            jobs (
              category,
              subcategory,
              location,
              salary_min,
              salary_max,
              skills
            )
          `)
          .eq('applicant_id', workerId)
          .limit(20);

        // Analyze preferences from application history
        const categoryPreferences: { [key: string]: number } = {};
        const locationPreferences: { [key: string]: number } = {};
        let avgSalaryPreference = 0;

        if (applications && applications.length > 0) {
          applications.forEach(app => {
            if (app.jobs) {
              const job = app.jobs as any;
              categoryPreferences[job.category] = (categoryPreferences[job.category] || 0) + 1;
              locationPreferences[job.location] = (locationPreferences[job.location] || 0) + 1;
              if (job.salary_min && job.salary_max) {
                avgSalaryPreference += (job.salary_min + job.salary_max) / 2;
              }
            }
          });
          avgSalaryPreference = avgSalaryPreference / applications.length;
        }

        // Get recommended jobs based on preferences
        let recommendationsQuery = supabase
          .from('jobs')
          .select('*')
          .eq('status', 'open')
          .neq('employer_id', workerId);

        // Prioritize preferred categories
        const topCategories = Object.entries(categoryPreferences)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 3)
          .map(([category]) => category);

        if (topCategories.length > 0) {
          recommendationsQuery = recommendationsQuery.in('category', topCategories);
        }

        const { data: recommendations, error: recError } = await recommendationsQuery
          .order('created_at', { ascending: false })
          .limit(15);

        if (recError) {
          throw new Error('Failed to fetch recommendations');
        }

        return new Response(
          JSON.stringify({
            success: true,
            recommendations: recommendations || [],
            preferences: {
              categories: categoryPreferences,
              locations: locationPreferences,
              avgSalaryPreference: Math.round(avgSalaryPreference)
            }
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Job matching error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});