import { OAUTH_URI } from '@/pages/Home/constants';

const LoginButton = ({ children }) => {
  return (
    <a href={OAUTH_URI} className='btn btn-lg btn-primary'>
      {children}
    </a>
  );
};

export default LoginButton;
