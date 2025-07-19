import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerificationRequest {
  action: 'submit_document' | 'verify_document' | 'verify_skill' | 'get_verification_status';
  documentType?: 'aadhar' | 'pan' | 'driving_license' | 'bank_statement' | 'address_proof' | 'skill_certificate';
  documentUrl?: string;
  userId?: string;
  verificationId?: string;
  skillId?: string;
  verificationStatus?: 'verified' | 'rejected';
  notes?: string;
}

interface VerificationResult {
  success: boolean;
  verificationId?: string;
  status?: string;
  message?: string;
  requiresAction?: boolean;
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

    const { 
      action, 
      documentType, 
      documentUrl, 
      userId, 
      verificationId,
      skillId,
      verificationStatus, 
      notes 
    }: VerificationRequest = await req.json();

    // Document validation rules
    const validateDocument = (type: string, url: string): { valid: boolean; message?: string } => {
      if (!url || url.trim() === '') {
        return { valid: false, message: 'Document URL is required' };
      }

      // Check file extension
      const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];
      const fileExtension = url.toLowerCase().substring(url.lastIndexOf('.'));
      
      if (!allowedExtensions.includes(fileExtension)) {
        return { 
          valid: false, 
          message: 'Only PDF, JPG, JPEG, and PNG files are allowed' 
        };
      }

      // Type-specific validations
      switch (type) {
        case 'aadhar':
          // Additional Aadhar-specific validations can be added here
          break;
        case 'pan':
          // Additional PAN-specific validations can be added here
          break;
        case 'driving_license':
          // Additional driving license-specific validations can be added here
          break;
      }

      return { valid: true };
    };

    // Auto-verification logic for certain document types
    const autoVerifyDocument = async (type: string, url: string, userId: string): Promise<{ autoVerified: boolean; confidence: number; notes?: string }> => {
      // In a real implementation, you would integrate with:
      // - OCR services to extract text from documents
      // - Government APIs to verify document authenticity
      // - AI/ML models to validate document format and content
      
      // For demonstration, we'll simulate auto-verification based on document type
      switch (type) {
        case 'aadhar':
          // Simulate Aadhar verification (would use UIDAI APIs in production)
          return {
            autoVerified: Math.random() > 0.3, // 70% success rate for demo
            confidence: 85,
            notes: 'Auto-verified using UIDAI API simulation'
          };
        
        case 'pan':
          // Simulate PAN verification (would use Income Tax APIs in production)
          return {
            autoVerified: Math.random() > 0.2, // 80% success rate for demo
            confidence: 90,
            notes: 'Auto-verified using Income Tax API simulation'
          };
        
        case 'driving_license':
          // Simulate driving license verification (would use transport department APIs)
          return {
            autoVerified: Math.random() > 0.4, // 60% success rate for demo
            confidence: 75,
            notes: 'Auto-verified using transport department API simulation'
          };
        
        default:
          return {
            autoVerified: false,
            confidence: 0,
            notes: 'Manual verification required'
          };
      }
    };

    switch (action) {
      case 'submit_document': {
        if (!documentType || !documentUrl) {
          throw new Error('Document type and URL are required');
        }

        const targetUserId = userId || user.id;

        // Validate document
        const validation = validateDocument(documentType, documentUrl);
        if (!validation.valid) {
          throw new Error(validation.message);
        }

        // Check if document already exists
        const { data: existingDoc } = await supabase
          .from('document_verifications')
          .select('*')
          .eq('user_id', targetUserId)
          .eq('document_type', documentType)
          .single();

        if (existingDoc && existingDoc.verification_status === 'verified') {
          throw new Error('This document type is already verified');
        }

        // Attempt auto-verification
        const autoVerification = await autoVerifyDocument(documentType, documentUrl, targetUserId);

        // Create or update document verification record
        const verificationData = {
          user_id: targetUserId,
          document_type: documentType,
          document_url: documentUrl,
          verification_status: autoVerification.autoVerified ? 'verified' : 'pending',
          verification_notes: autoVerification.notes
        };

        let documentVerification;
        if (existingDoc) {
          // Update existing document
          const { data, error } = await supabase
            .from('document_verifications')
            .update(verificationData)
            .eq('id', existingDoc.id)
            .select()
            .single();
          
          if (error) throw error;
          documentVerification = data;
        } else {
          // Create new document verification
          const { data, error } = await supabase
            .from('document_verifications')
            .insert(verificationData)
            .select()
            .single();
          
          if (error) throw error;
          documentVerification = data;
        }

        // Update user verification status if auto-verified
        if (autoVerification.autoVerified) {
          await supabase
            .from('profiles')
            .update({ verified: true })
            .eq('id', targetUserId);

          // Send notification
          await supabase
            .from('notifications')
            .insert({
              user_id: targetUserId,
              title: 'Document Verified!',
              message: `Your ${documentType.replace('_', ' ')} has been successfully verified.`,
              type: 'system'
            });
        } else {
          // Send notification for manual review
          await supabase
            .from('notifications')
            .insert({
              user_id: targetUserId,
              title: 'Document Submitted for Review',
              message: `Your ${documentType.replace('_', ' ')} has been submitted and is under review.`,
              type: 'system'
            });
        }

        return new Response(
          JSON.stringify({
            success: true,
            verificationId: documentVerification.id,
            status: documentVerification.verification_status,
            autoVerified: autoVerification.autoVerified,
            confidence: autoVerification.confidence,
            message: autoVerification.autoVerified 
              ? 'Document automatically verified!' 
              : 'Document submitted for manual review'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'verify_document': {
        // Admin/verifier action to manually verify documents
        if (!verificationId || !verificationStatus) {
          throw new Error('Verification ID and status are required');
        }

        // Check if user has admin/verifier privileges
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', user.id)
          .single();

        if (!userProfile || userProfile.user_type !== 'admin') {
          throw new Error('Insufficient privileges to verify documents');
        }

        // Update verification status
        const { data: updatedVerification, error } = await supabase
          .from('document_verifications')
          .update({
            verification_status: verificationStatus,
            verified_by: user.id,
            verification_notes: notes || '',
            updated_at: new Date().toISOString()
          })
          .eq('id', verificationId)
          .select('*, profiles(first_name, last_name)')
          .single();

        if (error) {
          throw new Error(`Failed to update verification: ${error.message}`);
        }

        // Update user's overall verification status
        if (verificationStatus === 'verified') {
          await supabase
            .from('profiles')
            .update({ verified: true })
            .eq('id', updatedVerification.user_id);
        }

        // Send notification to user
        const notificationTitle = verificationStatus === 'verified' 
          ? 'Document Verified!' 
          : 'Document Verification Failed';
        
        const notificationMessage = verificationStatus === 'verified'
          ? `Your ${updatedVerification.document_type.replace('_', ' ')} has been verified.`
          : `Your ${updatedVerification.document_type.replace('_', ' ')} verification was rejected. ${notes || 'Please resubmit with correct information.'}`;

        await supabase
          .from('notifications')
          .insert({
            user_id: updatedVerification.user_id,
            title: notificationTitle,
            message: notificationMessage,
            type: 'system'
          });

        return new Response(
          JSON.stringify({
            success: true,
            message: `Document ${verificationStatus} successfully`,
            verification: updatedVerification
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'verify_skill': {
        // Verify a user's skill (can be done by certified verifiers or through tests)
        if (!userId || !skillId) {
          throw new Error('User ID and Skill ID are required');
        }

        // Get skill information
        const { data: skill } = await supabase
          .from('skills_catalog')
          .select('*')
          .eq('id', skillId)
          .single();

        if (!skill) {
          throw new Error('Skill not found');
        }

        // Check if user has this skill
        const { data: userSkill } = await supabase
          .from('user_skills')
          .select('*')
          .eq('user_id', userId)
          .eq('skill_id', skillId)
          .single();

        if (!userSkill) {
          throw new Error('User does not have this skill registered');
        }

        // Verify the skill
        const { error: updateError } = await supabase
          .from('user_skills')
          .update({
            verified: true,
            verified_by: user.id
          })
          .eq('user_id', userId)
          .eq('skill_id', skillId);

        if (updateError) {
          throw new Error(`Failed to verify skill: ${updateError.message}`);
        }

        // Send notification
        await supabase
          .from('notifications')
          .insert({
            user_id: userId,
            title: 'Skill Verified!',
            message: `Your skill "${skill.name}" has been verified.`,
            type: 'system'
          });

        return new Response(
          JSON.stringify({
            success: true,
            message: `Skill "${skill.name}" verified successfully`
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get_verification_status': {
        const targetUserId = userId || user.id;

        // Get all document verifications for user
        const { data: documentVerifications, error: docError } = await supabase
          .from('document_verifications')
          .select('*')
          .eq('user_id', targetUserId)
          .order('created_at', { ascending: false });

        if (docError) {
          throw new Error(`Failed to fetch document verifications: ${docError.message}`);
        }

        // Get verified skills
        const { data: verifiedSkills, error: skillsError } = await supabase
          .from('user_skills')
          .select(`
            *,
            skills_catalog (
              id,
              name,
              category
            )
          `)
          .eq('user_id', targetUserId)
          .eq('verified', true);

        if (skillsError) {
          throw new Error(`Failed to fetch verified skills: ${skillsError.message}`);
        }

        // Calculate overall verification score
        const totalDocuments = documentVerifications.length;
        const verifiedDocuments = documentVerifications.filter(doc => doc.verification_status === 'verified').length;
        const pendingDocuments = documentVerifications.filter(doc => doc.verification_status === 'pending').length;
        const rejectedDocuments = documentVerifications.filter(doc => doc.verification_status === 'rejected').length;

        const verificationScore = totalDocuments > 0 ? Math.round((verifiedDocuments / totalDocuments) * 100) : 0;

        // Determine verification level
        let verificationLevel = 'unverified';
        if (verificationScore >= 80) verificationLevel = 'fully_verified';
        else if (verificationScore >= 50) verificationLevel = 'partially_verified';
        else if (verificationScore >= 25) verificationLevel = 'basic_verified';

        // Required documents based on user type
        const requiredDocuments = ['aadhar', 'pan', 'address_proof'];
        const missingDocuments = requiredDocuments.filter(docType => 
          !documentVerifications.some(doc => doc.document_type === docType && doc.verification_status === 'verified')
        );

        return new Response(
          JSON.stringify({
            success: true,
            verificationStatus: {
              level: verificationLevel,
              score: verificationScore,
              totalDocuments,
              verifiedDocuments,
              pendingDocuments,
              rejectedDocuments,
              missingDocuments,
              documentVerifications,
              verifiedSkills: verifiedSkills || [],
              nextSteps: missingDocuments.length > 0 
                ? `Please submit ${missingDocuments.join(', ')} for complete verification.`
                : 'All required documents verified!'
            }
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Verification system error:', error);
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

/* Additional SQL functions to be added to the database:

-- Function to calculate user verification score
CREATE OR REPLACE FUNCTION calculate_verification_score(user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    total_docs INTEGER;
    verified_docs INTEGER;
    score INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_docs 
    FROM document_verifications 
    WHERE user_id = $1;
    
    SELECT COUNT(*) INTO verified_docs 
    FROM document_verifications 
    WHERE user_id = $1 AND verification_status = 'verified';
    
    IF total_docs > 0 THEN
        score := ROUND((verified_docs::DECIMAL / total_docs::DECIMAL) * 100);
    ELSE
        score := 0;
    END IF;
    
    RETURN score;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user meets minimum verification requirements
CREATE OR REPLACE FUNCTION check_minimum_verification(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    has_identity BOOLEAN := FALSE;
    has_address BOOLEAN := FALSE;
BEGIN
    -- Check for identity proof (Aadhar or PAN)
    SELECT EXISTS (
        SELECT 1 FROM document_verifications 
        WHERE user_id = $1 
        AND document_type IN ('aadhar', 'pan') 
        AND verification_status = 'verified'
    ) INTO has_identity;
    
    -- Check for address proof
    SELECT EXISTS (
        SELECT 1 FROM document_verifications 
        WHERE user_id = $1 
        AND document_type = 'address_proof' 
        AND verification_status = 'verified'
    ) INTO has_address;
    
    RETURN has_identity AND has_address;
END;
$$ LANGUAGE plpgsql;

*/