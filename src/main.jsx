import '@/styles/global.css';
import { virtualDOM } from '@/library/dom/VirtualDOM.js';
import Home from '@/pages/Home';

virtualDOM.createRoot(document.getElementById('root')).render(<Home />);
