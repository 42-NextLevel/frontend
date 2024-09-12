import { useNavigate, useSearchParams } from '@/library/router/hooks.js';
import { useEffect } from '@/library/hooks.js';

const Auth = () => {
  const searchParams = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get('error')) {
      navigate('/', { replace: true });
    }
  }, []);

  return null;
};

export default Auth;
