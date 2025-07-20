import { useEffect } from 'react';
import { Toaster } from 'sonner';
import './App.css'
import { AppRouter } from './router/AppRouter'

function App() {
  // Update document title from environment variable
  useEffect(() => {
    const appName = import.meta.env.VITE_APP_NAME || 'GestiónVentas Pro';
    document.title = appName;
  }, []);

  return (
    <>
      <AppRouter />
      <Toaster 
        position="top-right"
        richColors
        closeButton
        expand
        duration={4000}
      />
    </>
  )
}

export default App
