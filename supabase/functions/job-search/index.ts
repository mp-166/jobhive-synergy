
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request
    const { query } = await req.json();
    
    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query parameter is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // 1. First, fetch sample jobs to provide context
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('*')
      .limit(15);

    if (jobsError) {
      throw new Error(`Error fetching jobs: ${jobsError.message}`);
    }

    // 2. Create system prompt with job information
    const jobsContext = jobs.map(job => 
      `Job ID: ${job.id}, Title: ${job.title}, Company: ${job.company}, 
      Location: ${job.location}, Salary: ${job.salary}, Type: ${job.type}, 
      Duration: ${job.duration}, Description: ${job.description || "No description"}`
    ).join('\n\n');

    // 3. Use OpenAI to analyze the query and find relevant jobs
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: `You are a job search assistant. Based on the user's query, analyze the following job data and identify the most relevant jobs. Return a JSON array of job IDs in order of relevance. Job data:\n\n${jobsContext}`
          },
          { 
            role: 'user', 
            content: query
          }
        ],
        response_format: { type: "json_object" }
      }),
    });

    const aiResponse = await response.json();
    
    if (!aiResponse.choices || aiResponse.choices.length === 0) {
      throw new Error('Invalid response from OpenAI');
    }

    // Parse the AI response to get job IDs
    const aiContent = aiResponse.choices[0].message.content;
    const aiData = JSON.parse(aiContent);
    
    let relevantJobIds = [];
    if (aiData.relevant_jobs) {
      relevantJobIds = aiData.relevant_jobs;
    } else if (aiData.jobs) {
      relevantJobIds = aiData.jobs;
    }

    // If we got job IDs, fetch the full job data in the specified order
    let relevantJobs = [];
    if (relevantJobIds && relevantJobIds.length > 0) {
      // Fetch all the relevant jobs
      const { data: fetchedJobs, error: fetchError } = await supabase
        .from('jobs')
        .select('*')
        .in('id', relevantJobIds);
      
      if (fetchError) {
        throw new Error(`Error fetching relevant jobs: ${fetchError.message}`);
      }
      
      // Sort them in the order specified by the AI
      if (fetchedJobs) {
        relevantJobs = relevantJobIds.map(id => 
          fetchedJobs.find(job => job.id === id)
        ).filter(Boolean);
      }
    } else {
      // If no specific jobs were identified, return the initial sample
      relevantJobs = jobs;
    }

    // Return the results along with AI's explanation
    return new Response(
      JSON.stringify({
        jobs: relevantJobs,
        explanation: aiData.explanation || "Jobs matching your search criteria"
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in job-search function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
