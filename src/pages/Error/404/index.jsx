import Error from '../layout';
import { ERROR_PAGE_MESSAGE } from '@/constants/messages.js';

const PageNotFound = () => {
  return <Error {...ERROR_PAGE_MESSAGE[404]} />;
};

export default PageNotFound;
