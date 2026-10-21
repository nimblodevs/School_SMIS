import { useEffect } from 'react';
import { toast } from 'sonner';

export function useAuthFeedback({ error, success }) {
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (success) toast.success(success);
  }, [success]);
}
