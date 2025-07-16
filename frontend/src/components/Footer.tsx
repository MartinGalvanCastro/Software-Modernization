import React from 'react';
import { Database, Code, Shield, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const appName = import.meta.env.VITE_APP_NAME || 'GestiónVentas Pro';
  const appDescription = import.meta.env.VITE_APP_DESCRIPTION || 'Sistema de gestión integral para tiendas y negocios';
  const appVersion = import.meta.env.VITE_APP_VERSION || '1.0.0';
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-400">{appName}</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {appDescription}. Diseñado para optimizar la gestión de inventarios, 
              vendedores y ventas de manera eficiente y moderna.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Versión {appVersion}</span>
              <span>•</span>
              <span>Desarrollado por Equipo 5 Modernización</span>
            </div>
          </div>

          {/* Features Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-400">Características</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-center space-x-3">
                <Database className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span>Gestión completa de productos</span>
              </li>
              <li className="flex items-center space-x-3">
                <Code className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span>Control de vendedores y equipos</span>
              </li>
              <li className="flex items-center space-x-3">
                <Shield className="h-4 w-4 text-purple-400 flex-shrink-0" />
                <span>Seguimiento de ventas en tiempo real</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © {currentYear} {appName}. Todos los derechos reservados.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span className="hidden md:block">Seguro y confiable</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
