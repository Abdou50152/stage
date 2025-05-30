import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getCookie } from 'cookies-next';

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      try {
        // Vérifier d'abord si un token existe
        const token = getCookie('token');
        if (!token) {
          console.log('Aucun token d\'authentification trouvé');
          return;
        }
        
        try {
          const response = await fetch('http://localhost:3001/api/users/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            // Vérifier d'abord si la réponse est du JSON valide
            const text = await response.text();
            try {
              const data = JSON.parse(text);
              setUser(data);
            } catch (parseError) {
              console.log('Réponse non-JSON reçue:', text.substring(0, 100));
            }
          } else {
            console.log('Erreur lors de la récupération du profil:', response.status);
          }
        } catch (fetchError) {
          // Gérer les erreurs de connexion au serveur
          console.log('Erreur de connexion au serveur');
        }
      } catch (error) {
        console.error('Failed to load user', error);
      }
    }

    // Désactiver temporairement le chargement automatique de l'utilisateur
    // tant que l'API n'est pas correctement configurée
    // loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch('http://localhost:3001/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const userData = await response.json();
      setUser(userData);
      router.push('/profile');
    } else {
      throw new Error('Login failed');
    }
  };

  const logout = () => {
    fetch('http://localhost:3001/api/users/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);