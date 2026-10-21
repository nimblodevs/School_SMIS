import { useEffect } from 'react';
import { useAuthStore } from './authStore.js';

export function AuthBootstrap({ children }) {
  useEffect(() => {
    void useAuthStore.getState().initialize();
  }, []);

  return children;
}
