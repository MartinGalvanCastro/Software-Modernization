import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/hooks/auth/useAuthContext';

interface NavbarProps {
  currentPage?: string;
  onNavigate?: (section: string) => void;
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, className = "" }) => {
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      // Navigate to login page after logout
      navigate('/', { replace: true });
    } catch {
      // Even if logout fails, navigate to login for security
      navigate('/', { replace: true });
    }
  };

  const handleNavigation = (section: string) => {
    if (onNavigate) {
      onNavigate(section);
    } else {
      // Default navigation using router
      if (section === 'home') {
        navigate('/home');
      } else if (section === 'productos') {
        navigate('/productos');
      } else if (section === 'ventas') {
        navigate('/ventas');
      } else if (section === 'vendedores') {
        navigate('/vendedores');
      }
    }
  };

  const isActive = (section: string) => currentPage === section;

  return (
    <nav className={`bg-white shadow-lg border-b rounded-sm overflow-hidden ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and Navigation Links */}
          <div className="flex items-center space-x-8">
            {/* Logo/App Title */}
            <button
              onClick={() => handleNavigation('home')}
              className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              {import.meta.env.VITE_APP_NAME || 'GestiónVentas Pro'}
            </button>
            
            {/* Navigation Links */}
            <div className="hidden md:flex space-x-6">
              <button
                onClick={() => handleNavigation('productos')}
                className={`transition-colors font-medium ${
                  isActive('productos')
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Productos
              </button>
              <button
                onClick={() => handleNavigation('ventas')}
                className={`transition-colors font-medium ${
                  isActive('ventas')
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Ventas
              </button>
              <button
                onClick={() => handleNavigation('vendedores')}
                className={`transition-colors font-medium ${
                  isActive('vendedores')
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Vendedores
              </button>
            </div>
          </div>

          {/* Right side - Logout */}
          <div className="flex items-center">
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu - Navigation Links */}
      <div className="md:hidden border-t bg-white">
        <div className="px-4 pt-2 pb-3 space-y-1">
          <button
            onClick={() => handleNavigation('productos')}
            className={`block w-full text-left px-3 py-2 transition-colors font-medium ${
              isActive('productos')
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
            }`}
          >
            Productos
          </button>
          <button
            onClick={() => handleNavigation('ventas')}
            className={`block w-full text-left px-3 py-2 transition-colors font-medium ${
              isActive('ventas')
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
            }`}
          >
            Ventas
          </button>
          <button
            onClick={() => handleNavigation('vendedores')}
            className={`block w-full text-left px-3 py-2 transition-colors font-medium ${
              isActive('vendedores')
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
            }`}
          >
            Vendedores
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
