import { Navigate, Outlet } from 'react-router-dom'

export default function ProtectedRoute() {
	return localStorage.getItem('lli-auth-token') ? <Outlet /> : <Navigate to="/login" replace />
}
