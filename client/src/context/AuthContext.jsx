import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import {
  getCurrentUser,
  loginUser,
  registerUser,
  logoutUser
} from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshUser = async () => {
    try {
      const data = await getCurrentUser();

      if (data?.success && data?.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }

      return data;
    } catch (error) {
      setUser(null);
      throw error;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const data = await getCurrentUser();

        if (!isMounted) {
          return;
        }

        if (data?.success && data?.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (credentials) => {
    setError(null);

    try {
      const data = await loginUser(credentials);

      if (data?.success && data?.user) {
        setUser(data.user);
      }

      return data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Login failed";

      setError(message);

      throw error;
    }
  };

  const register = async (userData) => {
    setError(null);

    try {
      const data = await registerUser(userData);

      return data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Registration failed";

      setError(message);

      throw error;
    }
  };

  const logout = async () => {
    setError(null);

    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        refreshUser,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}

export default AuthProvider;