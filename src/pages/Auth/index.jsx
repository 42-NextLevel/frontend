import { useNavigate, useSearchParams } from '@/library/router/hooks.js';
import { useEffect } from '@/library/hooks.js';
import { post42Code } from '@/services/auth.js';

const Auth = () => {
  const searchParams = useSearchParams();
  const navigate = useNavigate();
  const handleRedirect = () => {
    if (searchParams.get('error')) {
      return navigate('/', { replace: true });
    }
    post42Code(searchParams.get('code')).then(({ registered }) => {
      if (registered) {
        return navigate('/auth/code', { replace: true });
      }
      return navigate('/auth/mail', { replace: true });
    });
  };

  useEffect(() => {
    handleRedirect();
  }, []);

  return null;
};

export default Auth;
