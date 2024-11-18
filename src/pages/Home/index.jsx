import { useNavigate } from '@/library/router/hooks.js';
import Button from '@/components/Button/index.jsx';
import { OAUTH_URI } from './constants.js';
import { getNewToken } from '@/services/auth.js';
import { useEffect } from '@/library/hooks.js';
import { Matrix } from './animation.js';

const Home = () => {
  const navigate = useNavigate();
  const canvasId = 'matrix';

  useEffect(() => {
    const animation = new Matrix(canvasId).animate();

    return () => {
      clearInterval(animation);
    };
  }, []);

  const handleClick = async () => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken && (await getNewToken())) {
      return navigate('/lobby');
    }
    window.location.href = OAUTH_URI;
  };

  return (
    <div className='landing'>
      <canvas id={canvasId} />
      <main>
        <h1>NEXT LEVEL PONG</h1>
        <Button onClick={handleClick} color='teal' outline={true}>
          42 계정으로 로그인
        </Button>
      </main>
    </div>
  );
};

export default Home;
