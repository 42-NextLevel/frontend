import { useNavigate } from '@/library/router/hooks';
import { getNewToken } from '@/services/auth';
import { useEffect } from '@/library/hooks.js';

export const AuthCheck = ({ children }) => {
  const navigate = useNavigate();

  const fetchToken = async () => {
    const access_token = localStorage.getItem('access_token');

    if (!access_token) {
      await getNewToken();
      const new_access_token = localStorage.getItem('access_token');
      if (!new_access_token) {
        navigate('/', { replace: true });
      }
    }
  };

  useEffect(() => {
    fetchToken();
  }, []);

  return children();
};
