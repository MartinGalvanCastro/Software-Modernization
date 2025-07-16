import { useAuthContext } from '@/hooks/auth/useAuthContext';
import LoginScreen from '@/pages/LoginScreen';
import HomeScreen from '@/pages/HomeScreen';
import ProductosScreen from '@/pages/ProductosScreen';
import VentasScreen from '@/pages/VentasScreen';
import VendedoresScreen from '@/pages/VendedoresScreen';
import { type JSX } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

export function AppRouter(): JSX.Element {
  const { isAuthenticated } = useAuthContext();

  return (
    <BrowserRouter>
      <Routes>
        {/* Login Route */}
        <Route 
          path="/" 
          element={<LoginScreen />} 
        />
        
        {/* Protected Home Route */}
        <Route 
          path="/home" 
          element={isAuthenticated ? <HomeScreen /> : <Navigate to="/" replace />} 
        />

        {/* Protected Productos Route */}
        <Route 
          path="/productos" 
          element={isAuthenticated ? <ProductosScreen /> : <Navigate to="/" replace />} 
        />

        {/* Protected Ventas Route */}
        <Route 
          path="/ventas" 
          element={isAuthenticated ? <VentasScreen /> : <Navigate to="/" replace />} 
        />

        {/* Protected Vendedores Route */}
        <Route 
          path="/vendedores" 
          element={isAuthenticated ? <VendedoresScreen /> : <Navigate to="/" replace />} 
        />

        {/* Fallback - redirect to login */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

/**
 * testuser@example.com
 * P@ssw0rd123!
 */