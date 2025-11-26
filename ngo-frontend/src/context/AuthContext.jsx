import { createContext, useState } from "react";
import { getUser, clearStorage } from "../utils/storage";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUser());
  const navigate = useNavigate();

  const logout = () => {
    clearStorage();
    setUser(null);
    navigate("/login");
  };

  const isAdmin = user?.role?.name === "admin";
  const isMember = user?.role?.name === "member";

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
        isAdmin,
        isMember
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
