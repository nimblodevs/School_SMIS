import { useCallback, useEffect, useMemo, useState } from 'react';
import { authApi, AuthApiError } from './authApi.js';
import { AuthContext } from './authContext.js';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initializationError, setInitializationError] = useState('');

  const refreshUser = useCallback(async () => {
    try {
      const result = await authApi.currentUser();
      setUser(result.data.user);
      setInitializationError('');
      return result.data.user;
    } catch (error) {
      if (error instanceof AuthApiError && error.status === 401) {
        setUser(null);
        setInitializationError('');
        return null;
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials) => {
    const result = await authApi.login(credentials);
    setUser(result.data.user);
    setInitializationError('');
    return result.data.user;
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  useEffect(() => {
    let active = true;
    authApi.currentUser()
      .then((result) => {
        if (active) setUser(result.data.user);
      })
      .catch((error) => {
        if (active && !(error instanceof AuthApiError && error.status === 401)) {
          setInitializationError(error.message);
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, initializationError, login, logout, refreshUser, setUser }),
    [user, isLoading, initializationError, login, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
