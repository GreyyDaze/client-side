import axios from "axios";
import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: Cookies.get("token") || "",
    user: Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null,
  });

  Cookies.set("AUTH-STATE", authState);
  useEffect(() => {
    Cookies.set("token", authState.token);
    Cookies.set("user", JSON.stringify(authState.user));
  }, [authState.token, authState.user]);

  const login = (token, user) => {
    setAuthState({ token, user });
  };

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    setAuthState({ token: null, user: null });
  };

  axios.defaults.baseURL = "http://localhost:3000/api";
  axios.defaults.headers.common["Authorization"] = `Bearer ${authState?.token}`;

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
