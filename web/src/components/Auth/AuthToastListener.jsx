import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function AuthToastListener() {
  const location = useLocation();
  const navigate = useNavigate();
  const lastFeedback = useRef(null);
  const feedback = location.state?.authFeedback;

  useEffect(() => {
    if (!feedback?.message || lastFeedback.current === feedback) return;
    lastFeedback.current = feedback;

    if (feedback.type === 'error') toast.error(feedback.message);
    else if (feedback.type === 'info') toast.info(feedback.message);
    else toast.success(feedback.message);

    navigate(`${location.pathname}${location.search}${location.hash}`, {
      replace: true,
      state: { ...location.state, authFeedback: null },
    });
  }, [feedback, location, navigate]);

  return null;
}
