import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { AuthContext } from './Context/AuthContext';
import { ThemeContext } from './Context/ThemeContext';

function App() {
  const { authenticated } = React.useContext(AuthContext);
  const location = useLocation();
  const { darkMode } = React.useContext(ThemeContext);

  const hideNavOnRoutes = ['/login', '/register'];
  
  useEffect(() => {
    if (darkMode) {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }
  }, [darkMode]);

  return (
    <Outlet />
  );
}
export default App;