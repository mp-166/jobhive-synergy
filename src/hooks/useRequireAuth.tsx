
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useRequireAuth = (redirectTo = '/auth') => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to access this page",
      });
      navigate(redirectTo);
    }
  }, [user, isLoading, navigate, redirectTo, toast]);

  return { user, isLoading };
};
