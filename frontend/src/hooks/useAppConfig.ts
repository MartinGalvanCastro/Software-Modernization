// frontend/src/hooks/useAppConfig.ts
import { useState, useEffect } from 'react';

interface AppConfig {
  app: {
    name: string;
    description: string;
    version: string;
  };
}

const defaultConfig: AppConfig = {
  app: {
    name: 'GestiónVentas Pro',
    description: 'Sistema de gestión integral para tiendas y negocios',
    version: '1.0.0'
  }
};

export function useAppConfig() {
  const [config, setConfig] = useState<AppConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/config.json')
      .then(response => response.json())
      .then((data: AppConfig) => {
        setConfig(data);
      })
      .catch(error => {
        console.warn('Failed to load config.json, using defaults:', error);
        setConfig(defaultConfig);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { config, loading };
}
