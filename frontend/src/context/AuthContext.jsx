import { createContext, useState, useEffect } from "react";
import * as jwt_decode from "jwt-decode"; // 👈 use this instead

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [freelancer, setFreelancer] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt_decode(token); // works with * import
        setFreelancer({ _id: decoded.id, email: decoded.email });
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  const login = (data) => {
    localStorage.setItem("token", data.token);
    const decoded = jwt_decode(data.token);
    setFreelancer({ _id: decoded.id, email: decoded.email });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setFreelancer(null);
  };

  return (
    <AuthContext.Provider value={{ freelancer, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
