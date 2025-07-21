// context/LayoutContext.js
import { createContext } from 'react';

export const LayoutContext = createContext({
  setAuthKey: () => {},
  cachedPasswords: {},
  setCachedPasswords: () => {},
  cachedHealthScore: null,
  setCachedHealthScore: () => {},
});