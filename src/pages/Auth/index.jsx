import { useNavigate, useSearchParams } from '@/library/router/hooks.js';
import { useEffect } from '@/library/hooks.js';
import { post42Code } from '@/services/auth.js';
import PageNotFound from '@/pages/404/index.jsx';

const Auth = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  if (!code) {
    return <PageNotFound />;
  }

  const navigate = useNavigate();
  const handleRedirect = () => {
    if (searchParams.get('error')) {
      return navigate('/', { replace: true });
    }
    post42Code(code)
      .then(({ registered }) => {
        if (registered) {
          return navigate('/auth/code', { replace: true });
        }
        return navigate('/auth/mail', { replace: true });
      })
      .catch(() => {
        alert('잘못된 접근입니다.');
        navigate('/', { replace: true });
      });
  };

  useEffect(() => {
    handleRedirect();
  }, []);

  return (
    <div className='wrap'>
      <div className='spinner-border' role='status'>
        <span className='visually-hidden'>Loading...</span>
      </div>
      <div className='mt-2'>로그인중..</div>
    </div>
  );
};

export default Auth;
