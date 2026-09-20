
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const savedToken = localStorage.getItem('token');

    if (savedToken) {

      fetch('http://localhost:5000/api/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${savedToken}`
        }
      })
        .then(async (response) => {

          const data = await response.json();

          if (response.ok) {

            setToken(savedToken);
            setUser(data.data.user);

            localStorage.setItem(
              'user',
              JSON.stringify(data.data.user)
            );

          } else {

            localStorage.removeItem('token');
            localStorage.removeItem('user');

          }

        })
        .catch(() => {

          localStorage.removeItem('token');
          localStorage.removeItem('user');

        })
        .finally(() => {

          setLoading(false);

        });

    } else {

      setLoading(false);

    }

  }, []);

  const login = (userData, userToken) => {

    setUser(userData);
    setToken(userToken);

    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));

  };

  const logout = () => {

    setUser(null);
    setToken(null);

    localStorage.removeItem('token');
    localStorage.removeItem('user');

  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;

