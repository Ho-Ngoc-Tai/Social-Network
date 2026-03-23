import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure, logout } from '@/stores/reducers/auth-slice';
import { RootState } from '@/stores';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const login = (credentials: { email: string; password: string }) => {
    dispatch(loginStart(credentials));
  };

  const register = (userData: { name: string; email: string; password: string }) => {
    dispatch(loginStart(userData));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout: handleLogout,
  };
};
