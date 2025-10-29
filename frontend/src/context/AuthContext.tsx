import React, { createContext, useContext, useMemo, useState } from 'react';

type Role = 'viewer' | 'editor';

interface AuthState {
  isAuthenticated: boolean;
  role: Role;
}

interface AuthContextType extends AuthState {
  loginAs(role: Role): void;
  logout(): void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({ isAuthenticated: false, role: 'viewer' });

  const value = useMemo<AuthContextType>(() => ({
    ...state,
    loginAs: (role: Role) => setState({ isAuthenticated: true, role }),
    logout: () => setState({ isAuthenticated: false, role: 'viewer' })
  }), [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
