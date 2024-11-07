import Error from '../layout.jsx';
import { ERROR_PAGE_MESSAGE } from '../constants.js';

const Unauthorized = () => {
  return <Error {...ERROR_PAGE_MESSAGE[401]} />;
};

export default Unauthorized;
