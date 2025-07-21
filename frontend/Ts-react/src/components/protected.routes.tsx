import { Navigate } from "react-router-dom";
import React from "react";
import { jwtDecode } from "jwt-decode";


interface JWTpayload {
  exp: number;
}

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  console.log("ProtectedRoute rendered, token:", token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  try {
    const { exp } = jwtDecode<JWTpayload>(token)
    const isExpired = exp < Date.now() / 1000;
    const currentTime = Date.now() / 1000;

    console.log("Token:", token);
    console.log("Decoded exp:", exp);
    console.log("Current time:", currentTime);
    console.log("Is expired?", isExpired);

    return isExpired ? <Navigate to="/login" replace /> : <>{children}</>;
  } catch {
    return <Navigate to="/login" replace />;
  }
};
