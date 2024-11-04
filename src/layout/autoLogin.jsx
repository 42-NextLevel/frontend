import { useNavigate } from '@/library/router/hooks';
import { getNewToken } from '@/services/auth';
import { useEffect } from '@/library/hooks.js';

export const AutoLogin = ({ children }) => {
  const navigate = useNavigate();

  const fetchToken = async () => {
    await getNewToken();
    const new_access_token = localStorage.getItem('access_token');
    if (new_access_token) {
      navigate('/lobby', { replace: true });
    }
  };

  useEffect(() => {
    fetchToken();
  }, []);

  return children();
};
