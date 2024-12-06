import { useNavigate, useSearchParams } from '@/library/router/hooks.js';
import { useEffect, useState } from '@/library/hooks.js';
import { post42Code } from '@/services/auth.js';

import PageNotFound from '@/pages/Error/404';
import AuthCode from '@/pages/AuthCode';
import AuthMail from '@/pages/AuthMail';
import Spinner from '@/components/Spinner';

const Auth = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  if (!code) {
    return <PageNotFound />;
  }

  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const handleRedirect = () => {
    if (searchParams.get('error')) {
      return navigate('/', { replace: true });
    }
    post42Code(code)
      .then(({ registered }) => {
        if (registered) {
          setPage(2);
          return;
        }
        setPage(1);
      })
      .catch(() => {
        alert('잘못된 접근입니다.');
        navigate('/', { replace: true });
      });
  };

  useEffect(() => {
    handleRedirect();
  }, []);

  if (page === 1) {
    return <AuthMail onSuccess={() => setPage(2)} />;
  }

  if (page === 2) {
    return <AuthCode />;
  }

  return (
    <div className='wrap'>
      <Spinner message='로그인중..' />
    </div>
  );
};

export default Auth;
