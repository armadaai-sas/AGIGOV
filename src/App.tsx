import { BrowserRouter } from 'react-router-dom';

import CitizenApp from './citizen/CitizenApp.js';

export default function App() {
  return (
    <BrowserRouter>
      <CitizenApp />
    </BrowserRouter>
  );
}
