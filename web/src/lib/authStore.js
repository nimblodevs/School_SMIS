import { create } from 'zustand';
import { authApi, AuthApiError } from './authApi.js';

let initializationPromise;

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: true,
  initializationError: '',

  initialize: () => {
    if (initializationPromise) return initializationPromise;
    initializationPromise = authApi.currentUser()
      .then((result) => {
        set({ user: result.data.user || result.data, initializationError: '' });
      })
      .catch((error) => {
        if (error instanceof AuthApiError && error.status === 401) {
          set({ user: null, initializationError: '' });
          return;
        }
        set({ initializationError: error.message });
      })
      .finally(() => set({ isLoading: false }));
    return initializationPromise;
  },

  login: (credentials) => authApi.login(credentials),

  completeLogin: async (credentials) => {
    const result = await authApi.verifyLoginOtp(credentials);
    set({ user: result.data.user, initializationError: '' });
    return result.data.user;
  },

  resendLoginOtp: async (challengeToken) => {
    const result = await authApi.resendLoginOtp(challengeToken);
    return result.data;
  },

  logout: async () => {
    await authApi.logout();
    set({ user: null });
  },

  refreshUser: async () => {
    try {
      const result = await authApi.currentUser();
      const user = result.data.user || result.data;
      set({ user, initializationError: '' });
      return user;
    } catch (error) {
      if (error instanceof AuthApiError && error.status === 401) {
        set({ user: null, initializationError: '' });
        return null;
      }
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  stopImpersonation: async () => {
    const result = await authApi.stopImpersonation();
    set({ user: result.data.user, initializationError: '' });
    return result.data.user;
  },

  setUser: (user) => set({ user }),
}));

if (typeof window !== 'undefined') {
  window.addEventListener('schoolSmisSessionExpired', () => {
    useAuthStore.setState({ user: null, initializationError: '' });
  });
}
