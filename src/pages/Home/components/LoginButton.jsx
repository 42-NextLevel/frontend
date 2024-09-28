import { OAUTH_URI } from '@/pages/Home/constants';

const LoginButton = ({ children }) => {
  return (
    <a href={OAUTH_URI} className='btn btn-lg btn-primary px-5'>
      {children}
    </a>
  );
};

export default LoginButton;
