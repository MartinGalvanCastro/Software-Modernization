import { useEffect } from 'react';

/**
 * Custom hook to dynamically update the document title
 * @param title - The page title to set
 * @param appName - Optional app name (defaults to environment variable)
 */
export const useDocumentTitle = (title: string, appName?: string) => {
  useEffect(() => {
    const defaultAppName = import.meta.env.VITE_APP_NAME || 'GestiónVentas Pro';
    const finalAppName = appName || defaultAppName;
    
    // Set the document title in format: "Page Title | App Name"
    const fullTitle = title ? `${title} | ${finalAppName}` : finalAppName;
    document.title = fullTitle;
    
    // Cleanup: Reset to default title when component unmounts
    return () => {
      document.title = finalAppName;
    };
  }, [title, appName]);
};

export default useDocumentTitle;