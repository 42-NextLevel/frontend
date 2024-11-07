import { useNavigate } from '@/library/router/hooks.js';

const Error = ({ code, title, message }) => {
  const navigate = useNavigate();

  return (
    <div className='wrap error-info'>
      <h1>{code}</h1>
      <h2>{title}</h2>
      <p className='mb-4'>{message}</p>
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

export default Error;
