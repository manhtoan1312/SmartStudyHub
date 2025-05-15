import React, { createContext, useContext, useState} from "react";
import getRoutes from "~/routes";
import getRole from "~/services/RoleService";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const role= getRole()
  const [isLoggedIn, setIsLoggedIn] = useState(role.role? true: false);
  const [appRoutes, setAppRoutes] = useState(getRoutes(isLoggedIn));
  const login = (checked, image, token) => {
    setIsLoggedIn(true);
    localStorage.setItem("rememberme", JSON.stringify(checked));
    localStorage.setItem("token", JSON.stringify(token));
    localStorage.setItem("image", JSON.stringify(image))
    sessionStorage.setItem("isLogin", JSON.stringify(true));
    setAppRoutes(getRoutes());
  };

  const logout = () => {
    setIsLoggedIn(false);
    sessionStorage.clear();
    localStorage.clear();
    setAppRoutes(getRoutes());
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, appRoutes }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}