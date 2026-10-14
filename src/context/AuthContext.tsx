import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAdmin: boolean;
  adminToken: string | null;
  adminUser: { name: string; email: string } | null;
  adminLogin: (password: string) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => void;
  customerUser: { email: string; name: string; brandName?: string } | null;
  customerLogin: (email: string) => Promise<{ success: boolean; error?: string }>;
  customerLogout: () => void;
  getAuthHeaders: () => Record<string, string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('za_admin_token') || null;
  });
  const [adminUser, setAdminUser] = useState<{ name: string; email: string } | null>(() => {
    const raw = localStorage.getItem('za_admin_user');
    return raw ? JSON.parse(raw) : null;
  });

  const [customerUser, setCustomerUser] = useState<{ email: string; name: string; brandName?: string } | null>(() => {
    const raw = localStorage.getItem('za_customer_user');
    return raw ? JSON.parse(raw) : null;
  });

  const isAdmin = Boolean(adminToken);

  const adminLogin = async (password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'admin', password })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Invalid administrator password' };
      }
      setAdminToken(data.token);
      setAdminUser(data.user);
      localStorage.setItem('za_admin_token', data.token);
      localStorage.setItem('za_admin_user', JSON.stringify(data.user));
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Connection failed' };
    }
  };

  const adminLogout = () => {
    setAdminToken(null);
    setAdminUser(null);
    localStorage.removeItem('za_admin_token');
    localStorage.removeItem('za_admin_user');
  };

  const customerLogin = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'customer', email })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Customer not found' };
      }
      setCustomerUser(data.user);
      localStorage.setItem('za_customer_user', JSON.stringify(data.user));
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Connection failed' };
    }
  };

  const customerLogout = () => {
    setCustomerUser(null);
    localStorage.removeItem('za_customer_user');
  };

  const getAuthHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (adminToken) {
      headers['Authorization'] = `Bearer ${adminToken}`;
    }
    return headers;
  };

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        adminToken,
        adminUser,
        adminLogin,
        adminLogout,
        customerUser,
        customerLogin,
        customerLogout,
        getAuthHeaders
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
