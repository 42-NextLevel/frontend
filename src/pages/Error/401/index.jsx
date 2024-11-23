import Error from '../layout.jsx';
import { ERROR_PAGE_MESSAGE } from '@/constants/messages.js';

const Unauthorized = () => {
  return <Error {...ERROR_PAGE_MESSAGE[401]} />;
};

export default Unauthorized;
