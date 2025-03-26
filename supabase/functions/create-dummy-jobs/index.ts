
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Sample jobs data
const sampleJobs = [
  {
    title: "Software Developer",
    company: "TechSolutions",
    location: "Bangalore",
    salary: "₹40,000 - ₹60,000",
    duration: "Full-time",
    type: "Full-time",
    description: "We are looking for a skilled software developer to join our team. Experience with React, Node.js, and TypeScript required. Remote work available 2 days per week."
  },
  {
    title: "Delivery Driver",
    company: "SpeedMart",
    location: "Mumbai",
    salary: "₹15,000 - ₹20,000",
    duration: "Part-time",
    type: "Part-time",
    description: "Deliver packages within the city. Must have valid driver's license and own vehicle. Flexible hours available."
  },
  {
    title: "Construction Helper",
    company: "BuildRight",
    location: "Delhi",
    salary: "₹12,000 - ₹18,000",
    duration: "3 months",
    type: "Contract",
    description: "No prior experience required. On-the-job training provided. Help with basic construction tasks under supervision."
  },
  {
    title: "Remote Customer Support",
    company: "GlobalConnect",
    location: "Remote",
    salary: "₹25,000 - ₹35,000",
    duration: "Full-time",
    type: "Full-time",
    description: "Provide customer support via chat and email. Must be fluent in English and Hindi. Full remote position with flexible hours."
  },
  {
    title: "Web Designer",
    company: "CreativeMinds",
    location: "Hyderabad",
    salary: "₹30,000 - ₹45,000",
    duration: "Full-time",
    type: "Full-time",
    description: "Create beautiful, responsive websites for our clients. Experience with Figma, HTML, CSS required. Portfolio review part of interview process."
  },
  {
    title: "Part-time Data Entry",
    company: "DataPro",
    location: "Bangalore",
    salary: "₹8,000 - ₹12,000",
    duration: "Part-time",
    type: "Part-time",
    description: "Enter and validate data in our system. Flexible hours, can work from home. Basic computer skills required."
  },
  {
    title: "Restaurant Server",
    company: "Spice Garden",
    location: "Chennai",
    salary: "₹10,000 plus tips",
    duration: "Part-time",
    type: "Part-time",
    description: "Take orders, serve food, and ensure customer satisfaction. Evening and weekend shifts available. Previous experience preferred but not required."
  },
  {
    title: "Mobile App Developer",
    company: "AppWorks",
    location: "Remote",
    salary: "₹50,000 - ₹70,000",
    duration: "Full-time",
    type: "Full-time",
    description: "Develop mobile applications for iOS and Android. Experience with React Native or Flutter required. Fully remote position with occasional team meetings."
  },
  {
    title: "Warehouse Associate",
    company: "LogiTech",
    location: "Pune",
    salary: "₹15,000 - ₹18,000",
    duration: "Full-time",
    type: "Full-time",
    description: "Handle incoming and outgoing inventory. Physical job requiring lifting up to 20kg. No prior experience needed, training provided."
  },
  {
    title: "Sales Associate",
    company: "RetailPlus",
    location: "Mumbai",
    salary: "₹12,000 + commission",
    duration: "Full-time",
    type: "Full-time",
    description: "Assist customers and process sales in our retail store. Previous retail experience preferred. Opportunity for bonuses based on sales performance."
  },
  {
    title: "Content Writer",
    company: "WordCraft",
    location: "Remote",
    salary: "₹20,000 - ₹30,000",
    duration: "Contract",
    type: "Contract",
    description: "Create engaging content for websites, blogs, and social media. Strong English writing skills required. Can work remotely with flexible schedule."
  },
  {
    title: "Graphic Designer",
    company: "VisualArts",
    location: "Bangalore",
    salary: "₹25,000 - ₹40,000",
    duration: "Full-time",
    type: "Full-time",
    description: "Create visual concepts for marketing materials, websites, and social media. Proficiency in Adobe Creative Suite required. Portfolio review part of interview process."
  },
  {
    title: "Security Guard",
    company: "SecureForce",
    location: "Delhi",
    salary: "₹12,000 - ₹15,000",
    duration: "Full-time",
    type: "Full-time",
    description: "Monitor premises and ensure safety of property and personnel. Rotating shifts including nights and weekends. No prior experience required, training provided."
  },
  {
    title: "Administrative Assistant",
    company: "BizSupport",
    location: "Chennai",
    salary: "₹18,000 - ₹22,000",
    duration: "Full-time",
    type: "Full-time",
    description: "Provide administrative support including scheduling, document preparation, and general office management. Good organizational skills and proficiency in MS Office required."
  },
  {
    title: "Social Media Manager",
    company: "DigitalPulse",
    location: "Remote",
    salary: "₹25,000 - ₹35,000",
    duration: "Part-time",
    type: "Part-time",
    description: "Manage social media accounts for multiple clients. Create and schedule content, engage with followers, and analyze performance. Experience with major social platforms required."
  }
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    // Initialize Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Check if jobs table exists, if not create it
    const { error: tableCheckError } = await supabase.from('jobs').select('id').limit(1);
    
    if (tableCheckError && tableCheckError.code === '42P01') { // Table doesn't exist
      // Create the jobs table
      await supabase.rpc('create_jobs_table');
    }
    
    // Insert sample jobs
    const { data, error } = await supabase.from('jobs').insert(sampleJobs).select();
    
    if (error) {
      throw new Error(`Error inserting jobs: ${error.message}`);
    }
    
    return new Response(
      JSON.stringify({ success: true, message: `${data.length} sample jobs created successfully` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in create-dummy-jobs function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
