import { useNavigate } from '@/library/router/hooks.js';

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className='wrap error-info'>
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p className='mb-4'>Sorry, the page you’re looking for doesn’t exist.</p>
      <button
        className='btn btn-lg btn-dark px-5'
        type='button'
        onClick={() => navigate('/', { replace: true })}
      >
        Go Home
      </button>
    </div>
  );
};

export default PageNotFound;
