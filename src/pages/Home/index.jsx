import { useNavigate } from '@/library/router/hooks.js';
import Button from '@/components/Button/index.jsx';
import { OAUTH_URI } from './constants.js';
import { getNewToken } from '@/services/auth.js';

const Home = () => {
  const navigate = useNavigate();

  const handleClick = async () => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken && (await getNewToken())) {
      return navigate('/lobby');
    }
    window.location.href = OAUTH_URI;
  };

  return (
    <div className='wrap'>
      <Button onClick={handleClick}>42 계정으로 로그인</Button>
    </div>
  );
};

export default Home;
