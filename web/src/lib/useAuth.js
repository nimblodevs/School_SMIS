import { useAuthStore } from './authStore.js';

const selectAllAuthState = (state) => state;

export function useAuth(selector = selectAllAuthState) {
  return useAuthStore(selector);
}
