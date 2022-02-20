import React from "react";
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ Component}) => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
  return (
      isAuthenticated ? <Component /> : <Navigate to="/login" />
  )
}

export default ProtectedRoute;