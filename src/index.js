import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';
import { ExistenciasProvider } from './Context/ExistenciaContext';
import ErrorPage from './Pages/ErrorPage';
import LoginPage from './Pages/Login/LoginPage';
import Dashboard from './Components/Home/Dashboard';
import FormularioCliente from './Pages/Cliente/FormPage';
import IndexClientes from './Pages/Cliente/IndexPage';
import DetailsPage from './Pages/Cliente/DetailsPage';
import FormularioPagos from './Pages/Pago/FormPage';
import IndexPagos from './Pages/Pago/IndexPage';
import IndexProducto from './Pages/Producto/IndexPage';
import VentaFormPage from './Pages/Venta/VentaFormPage';
import VentaIndexPage from './Pages/Venta/IndexPage';
/*
import FormularioEjercicioPage from './Pages/Tipo_Ejercicio/FormularioEjercicioPage';
import IndexTipoEjerYPagoPage from './Pages/IndexTipoEjer_y_PagoPage';

import FormularioPagosPage from './Pages/Tipo_Pagos/FormularioPagosPage';

import Asistencia from './Pages/Asistencia/AsistenciaPage';
import AsistenciaListado from './Pages/Asistencia/AsistenciaListaPage';

import RegisterPage from './Pages/UserAdminLogin/RegisterPage';
import ConfigPage from './Pages/Configuraciones/ConfiguracionesPage';

import VencimientosProximos from './Components/Home/VencimientosProximos';*/

import ProtectedRoute from './Components/ProtectedRoute/PrivateRoute';

import { ThemeProvider } from './Context/ThemeContext';

// ---------------------------------------------------------------
// ROUTER CONFIGURATION
// ---------------------------------------------------------------
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <App />
    ),
    errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
      
      // USUARIOS
      { path: '/clientes', element: <ProtectedRoute><IndexClientes /></ProtectedRoute> },
      { path: '/clientes/form', element: <ProtectedRoute><FormularioCliente /></ProtectedRoute> },
      { path: '/clientes/:id/update', element: <ProtectedRoute><FormularioCliente /></ProtectedRoute> },
      { path: '/clientes/:id/details', element: <ProtectedRoute><DetailsPage /></ProtectedRoute> },

      // PAGOS - REALIZADOS
      { path: '/pagos', element: <ProtectedRoute><IndexPagos /></ProtectedRoute> },
      { path: '/pagos/form', element: <ProtectedRoute><FormularioPagos /></ProtectedRoute> },
      { path: '/pagos/:id/update', element: <ProtectedRoute><FormularioPagos /></ProtectedRoute> },

      //PRODUCTOS
      { path: '/productos', element: <ProtectedRoute><IndexProducto /></ProtectedRoute> },

      // VENTAS
      { path: '/venta', element: <ProtectedRoute><VentaIndexPage /></ProtectedRoute> },
      { path: '/venta/new', element: <ProtectedRoute><VentaFormPage /></ProtectedRoute> },
      { path: '/venta/:codigo_venta/update', element: <ProtectedRoute><VentaFormPage /></ProtectedRoute> },
/*
      // TIPOS EJERCICIOS Y PAGOS
      { path: '/IndexTipoEjer_y_Pago', element: <ProtectedRoute><IndexTipoEjerYPagoPage /></ProtectedRoute> },
      { path: '/tipoejercicio/nuevo', element: <ProtectedRoute><FormularioEjercicioPage /></ProtectedRoute> },
      { path: '/tipoejercicio/editar/:id', element: <ProtectedRoute><FormularioEjercicioPage /></ProtectedRoute> },
      
      // TIPO PAGOS
      { path: '/tipopagos/nuevo', element: <ProtectedRoute><FormularioPagosPage /></ProtectedRoute> },
      { path: '/tipopagos/editar/:id', element: <ProtectedRoute><FormularioPagosPage /></ProtectedRoute> },

      // ASISTENCIA
      { path: '/asistencia', element: <ProtectedRoute><Asistencia /></ProtectedRoute> },
      { path: '/asistencia/listado', element: <ProtectedRoute><AsistenciaListado /></ProtectedRoute> },*/

      // Publicas
      { path: '/Login', element: <LoginPage /> },
      //{ path: '/register', element: <RegisterPage /> },
      //{ path: '/configuraciones', element: <ConfigPage /> },
    ]
  }
]);

// ---------------------------------------------------------------
// RENDER
// ---------------------------------------------------------------
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <ExistenciasProvider>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </ExistenciasProvider>  
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();