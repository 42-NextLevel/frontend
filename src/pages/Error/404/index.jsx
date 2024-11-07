import Error from '../layout.jsx';
import { ERROR_PAGE_MESSAGE } from '../constants.js';

const PageNotFound = () => {
  return <Error {...ERROR_PAGE_MESSAGE[404]} />;
};

export default PageNotFound;
