import React, { useState, useEffect, createContext, useMemo } from 'react';
import axios from 'axios';
import { AuthContextType, IAxiosErrorRestApi } from '../../@types/AuthContext';
import { toast } from '../ui/use-toast';
import { useAuthStore } from '@/stores/AuthStore';
export const authContext = createContext<AuthContextType | null>(null);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState<boolean>(true);
  const { user_id, setUserId, username, setUsername, email, setEmail, role, setRole } =
    useAuthStore();
  // isAuthenticated checks If user has a working token - If he has, he is authenticated so this function will return his data as a response.json().
  const isAuthenticated = async () => {
    return axios.get(`/api/auth/isAuthenticated`).then(async response => response.data);
  };
  // loadData loads data from api and sets it to the authState.
  const loadData = async () => {
    setLoading(true);
    isAuthenticated()
      .then(response_data => {
        if (response_data.isUserLoggedIn === false) {
          return [];
        }
        if (response_data.error) {
          toast({
            variant: 'destructive',
            title: response_data.error,
            description: response_data.message,
          });
          return [];
        }
        // If user is logged in(there is a cookie with token), set authState to user data
        setUserId(response_data.user._id);
        setUsername(response_data.user.username);
        setEmail(response_data.user.email);
        setRole(response_data.user.role);
        return response_data;
      })
      .catch(err => axiosErrorHandler(err))
      .then(() => {
        setLoading(false);
      });
  };

  const axiosErrorHandler = (err: IAxiosErrorRestApi) => {
    // If the request was made and the server responded.
    if (err.response?.data?.message) {
      return toast({
        title: 'Error',
        description: err.response?.data.message,
        variant: 'destructive',
      });
    }
    return toast({ title: 'Error', description: err.message, variant: 'destructive' });
  };

  // login logs user in and sets his data to the authState.
  const login = async (email: string, password: string) => {
    axios
      .post('/api/auth/login/', {
        email,
        password,
      })
      .then(response => response.data)
      .then(response_data => {
        if (response_data.isUserLoggedIn === true) {
          loadData();
        }
      })
      .catch((err: IAxiosErrorRestApi) => axiosErrorHandler(err));
  };

  const register = async (username: string, email: string, password: string) => {
    axios
      .post('/api/auth/register/', {
        username,
        email,
        password,
      })
      .then(response => response.data)
      .then(response_data => {
        if (response_data.status === 'ok') {
          login(email, password);
        }
      });
  };

  // logout logs user out and sets authState to null.
  const logout = async () => {
    const response = await fetch('/api/auth/logout/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 200) {
      setUserId(null);
      setUsername(null);
      setEmail(null);
      setRole(null);
      //TODO navigate('/Login');
    }
  };
  useEffect(() => {
    loadData();
  }, []);

  const values = useMemo(() => ({ login, logout, register, loading, loadData }), [loading]);
  return <authContext.Provider value={values}>{children}</authContext.Provider>;
}

export default AuthProvider;
