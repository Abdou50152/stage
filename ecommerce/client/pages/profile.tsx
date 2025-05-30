import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Récupérer les informations de l'utilisateur
    async function fetchUser() {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          router.push('/login');
        }
      } catch (error) {
        router.push('/login');
      }
    }

    fetchUser();
  }, [router]);

  if (!user) {
    return <Layout>Chargement...</Layout>;
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Mon Profil</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="font-semibold">Nom:</h2>
            <p>{user.name}</p>
          </div>
          
          <div>
            <h2 className="font-semibold">Email:</h2>
            <p>{user.email}</p>
          </div>
          
          <div>
            <h2 className="font-semibold">Historique des commandes:</h2>
            {/* Afficher l'historique des commandes ici */}
          </div>
        </div>
      </div>
    </Layout>
  );
}