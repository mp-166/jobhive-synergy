import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { verificationAPI, utils } from '@/lib/api';
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Shield, 
  AlertTriangle,
  CreditCard,
  Car,
  Home,
  Award
} from 'lucide-react';

interface VerificationDashboardProps {
  userId: string;
}

export default function VerificationDashboard({ userId }: VerificationDashboardProps) {
  const { toast } = useToast();
  const [verificationStatus, setVerificationStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingDocument, setUploadingDocument] = useState<string | null>(null);

  useEffect(() => {
    loadVerificationStatus();
  }, [userId]);

  const loadVerificationStatus = async () => {
    try {
      setIsLoading(true);
      const result = await verificationAPI.getVerificationStatus();
      setVerificationStatus(result.verificationStatus);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load verification status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentUpload = async (documentType: string, file: File) => {
    try {
      setUploadingDocument(documentType);
      
      // In a real app, you'd upload to storage first
      const documentUrl = `https://storage.example.com/${file.name}`;
      
      await verificationAPI.submitDocument(documentType, documentUrl);
      
      toast({
        title: "Document Submitted",
        description: "Your document has been submitted for verification.",
      });
      
      loadVerificationStatus();
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setUploadingDocument(null);
    }
  };

  const documentTypes = [
    {
      type: 'aadhar',
      name: 'Aadhar Card',
      description: 'Government issued identity proof',
      icon: CreditCard,
      required: true,
    },
    {
      type: 'pan',
      name: 'PAN Card',
      description: 'Permanent Account Number',
      icon: FileText,
      required: true,
    },
    {
      type: 'driving_license',
      name: 'Driving License',
      description: 'Required for driving jobs',
      icon: Car,
      required: false,
    },
    {
      type: 'address_proof',
      name: 'Address Proof',
      description: 'Utility bill or bank statement',
      icon: Home,
      required: true,
    },
    {
      type: 'skill_certificate',
      name: 'Skill Certificate',
      description: 'Professional certifications',
      icon: Award,
      required: false,
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <Upload className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      verified: { variant: 'default' as const, label: 'Verified' },
      rejected: { variant: 'destructive' as const, label: 'Rejected' },
      pending: { variant: 'secondary' as const, label: 'Under Review' },
    };
    
    const config = variants[status as keyof typeof variants];
    return config ? (
      <Badge variant={config.variant}>{config.label}</Badge>
    ) : (
      <Badge variant="outline">Not Submitted</Badge>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const verificationLevel = verificationStatus ? utils.getVerificationLevel(verificationStatus.score) : { level: 'unverified', color: 'red', label: 'Unverified' };

  return (
    <div className="space-y-6">
      {/* Verification Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Verification Status
            </div>
            <Badge 
              variant={verificationLevel.color === 'green' ? 'default' : 'secondary'}
              className={`${verificationLevel.color === 'green' ? 'bg-green-600' : 
                         verificationLevel.color === 'yellow' ? 'bg-yellow-500' : 
                         verificationLevel.color === 'orange' ? 'bg-orange-500' : 'bg-red-500'} text-white`}
            >
              {verificationLevel.label}
            </Badge>
          </CardTitle>
          <CardDescription>
            Complete your verification to access all platform features
          </CardDescription>
        </CardHeader>
        <CardContent>
          {verificationStatus && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Verification Progress</span>
                  <span>{verificationStatus.score}%</span>
                </div>
                <Progress value={verificationStatus.score} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {verificationStatus.verifiedDocuments}
                  </div>
                  <div className="text-sm text-gray-600">Verified</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {verificationStatus.pendingDocuments}
                  </div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {verificationStatus.rejectedDocuments}
                  </div>
                  <div className="text-sm text-gray-600">Rejected</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-600">
                    {verificationStatus.missingDocuments.length}
                  </div>
                  <div className="text-sm text-gray-600">Missing</div>
                </div>
              </div>

              {verificationStatus.nextSteps && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Next Steps</h4>
                      <p className="text-sm text-blue-700">{verificationStatus.nextSteps}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Upload Cards */}
      <div className="grid gap-4">
        {documentTypes.map((docType) => {
          const existingDoc = verificationStatus?.documentVerifications?.find(
            (doc: any) => doc.document_type === docType.type
          );
          
          const Icon = docType.icon;
          
          return (
            <Card key={docType.type} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className="w-6 h-6 text-gray-600" />
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {docType.name}
                        {docType.required && <span className="text-red-500 text-sm">*</span>}
                      </CardTitle>
                      <CardDescription>{docType.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(existingDoc?.verification_status)}
                    {getStatusBadge(existingDoc?.verification_status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {existingDoc ? (
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      Submitted: {new Date(existingDoc.created_at).toLocaleDateString()}
                    </div>
                    
                    {existingDoc.verification_status === 'rejected' && existingDoc.verification_notes && (
                      <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                        <h5 className="font-medium text-red-900 mb-1">Rejection Reason</h5>
                        <p className="text-sm text-red-700">{existingDoc.verification_notes}</p>
                      </div>
                    )}
                    
                    {existingDoc.verification_status === 'verified' && (
                      <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <div className="flex items-center text-green-800">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          <span className="font-medium">Document Verified</span>
                        </div>
                      </div>
                    )}
                    
                    {existingDoc.verification_status === 'pending' && (
                      <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                        <div className="flex items-center text-yellow-800">
                          <Clock className="w-4 h-4 mr-2" />
                          <span className="font-medium">Under Review</span>
                        </div>
                        <p className="text-sm text-yellow-700 mt-1">
                          Your document is being reviewed. This usually takes 24-48 hours.
                        </p>
                      </div>
                    )}
                    
                    {existingDoc.verification_status === 'rejected' && (
                      <div className="flex gap-2">
                        <Input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleDocumentUpload(docType.type, file);
                            }
                          }}
                          disabled={uploadingDocument === docType.type}
                          className="flex-1"
                        />
                        <Button 
                          variant="outline"
                          disabled={uploadingDocument === docType.type}
                        >
                          {uploadingDocument === docType.type ? 'Uploading...' : 'Resubmit'}
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      Upload your {docType.name.toLowerCase()} for verification
                    </p>
                    <div className="flex gap-2">
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleDocumentUpload(docType.type, file);
                          }
                        }}
                        disabled={uploadingDocument === docType.type}
                        className="flex-1"
                      />
                      <Button 
                        disabled={uploadingDocument === docType.type}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {uploadingDocument === docType.type ? 'Uploading...' : 'Upload'}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Verification Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Benefits</CardTitle>
          <CardDescription>
            Complete verification unlocks these features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Access to verified-only jobs</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Higher priority in job matching</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Increased trust from employers</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Faster payment processing</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Access to skill verification programs</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}