import { createContext, useState, useEffect } from "react";
import {
  getUser,
  setUser,
  setToken,
  setRefreshToken,
  clearStorage,
} from "../utils/storage";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(getUser());
  const [loading, setLoading] = useState(true);

  const login = (data) => {
    setToken(data.access);
    setRefreshToken(data.refresh);
    setUser(data.user);
    setUserState(data.user);
  };

  const logout = () => {
    clearStorage();
    setUserState(null);
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
