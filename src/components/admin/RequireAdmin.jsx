// src/components/admin/RequireAdmin.jsx
// Client-side route guard for /admin/*. The app is fully static, so this only
// hides the panel from casual visitors — it is not a security boundary.
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useProducts } from '../../contexts/ProductsContext';

export default function RequireAdmin() {
  const { isAdminAuthed } = useProducts();
  const location = useLocation();

  if (!isAdminAuthed) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
