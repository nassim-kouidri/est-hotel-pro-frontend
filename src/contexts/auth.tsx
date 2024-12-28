import { createContext, ReactNode, useContext, useState } from "react";

import { LoginResponse } from "../interfaces/Login";

type AuthType = {
  user: LoginResponse | null;
  addAuth: (user: LoginResponse) => void;
  removeAuth: () => void;
};

export const AuthContext = createContext<AuthType | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<LoginResponse | null>(() => {
    const user_from_storage = sessionStorage.getItem("ehp_user");
    try {
      return user_from_storage ? JSON.parse(user_from_storage) : null;
    } catch (error) {
      console.error("Error while parsing user from local storage", error);
      return null;
    }
  });

  const addAuth = (user: LoginResponse) => {
    sessionStorage.setItem("ehp_user", JSON.stringify(user));
    setUser(user);
  };

  const removeAuth = () => {
    sessionStorage.removeItem("ehp_user");
    setUser(null);
  };

  const User = {
    user,
    addAuth,
    removeAuth,
  };

  return <AuthContext.Provider value={User}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext) as AuthType;
};
