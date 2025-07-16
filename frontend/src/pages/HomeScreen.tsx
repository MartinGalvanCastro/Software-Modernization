import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useAuthContext } from '@/hooks/auth/useAuthContext';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export const HomeScreen: React.FC = () => {
  const { username } = useAuthContext();
  const navigate = useNavigate();
  const appName = import.meta.env.VITE_APP_NAME || 'GestiónVentas Pro';
  const appDescription = import.meta.env.VITE_APP_DESCRIPTION || 'Sistema de gestión integral para tiendas y negocios';

  // Set dynamic page title
  useDocumentTitle('Inicio');

  const handleNavigateToVendedores = () => {
    navigate('/vendedores');
  };

  const handleNavigateToProductos = () => {
    navigate('/productos');
  };

  const handleNavigateToVentas = () => {
    navigate('/ventas');
  };

  return (
    <div className="min-h-screen bg-gray-50 shadow-2xl rounded-lg m-4 p-4 flex flex-col">
      {/* Navbar */}
      <Navbar currentPage="home" />

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Bienvenido a {appName}
              </h1>
              <h2 className="text-2xl font-medium text-gray-700 mb-2">
                {username || 'Usuario'}
              </h2>
              <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
                {appDescription}. Selecciona una sección del menú superior para comenzar a gestionar tu negocio de manera eficiente.
              </p>
            </div>

            {/* Sections */}
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <button 
                onClick={handleNavigateToVendedores}
                className="bg-white p-6 rounded-lg shadow-md border hover:shadow-xl hover:scale-105 transition-all duration-300 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">Vendedores</h2>
                  <p className="text-gray-600">
                    Gestiona tu equipo de vendedores, sus datos de contacto y rendimiento.
                  </p>
                </div>
              </button>

              <button 
                onClick={handleNavigateToProductos}
                className="bg-white p-6 rounded-lg shadow-md border hover:shadow-xl hover:scale-105 transition-all duration-300 text-left focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">Productos</h2>
                  <p className="text-gray-600">
                    Administra tu catálogo de productos, precios e inventario de manera eficiente.
                  </p>
                </div>
              </button>

              <button 
                onClick={handleNavigateToVentas}
                className="bg-white p-6 rounded-lg shadow-md border hover:shadow-xl hover:scale-105 transition-all duration-300 text-left focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">Ventas</h2>
                  <p className="text-gray-600">
                    Controla y analiza todas las transacciones y ventas de tu negocio.
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomeScreen;
