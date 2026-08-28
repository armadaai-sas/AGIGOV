import { BrowserRouter, HashRouter } from 'react-router-dom';

import CitizenApp from './citizen/CitizenApp.js';
import { isDesktopRuntime } from './citizen/platform/desktopRuntime.js';

const Router = isDesktopRuntime() ? HashRouter : BrowserRouter;

export default function App() {
  return (
    <Router>
      <CitizenApp />
    </Router>
  );
}
