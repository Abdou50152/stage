import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import UsersService from '../services/users.service';
import { Order } from '../types/order';
import Link from 'next/link';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Récupérer les informations de l'utilisateur et ses commandes
    async function fetchUserData() {
      try {
        setLoading(true);
        // Récupérer le profil utilisateur
        const userData = await UsersService.getUserProfile();
        setUser(userData);
        
        // Récupérer les commandes de l'utilisateur
        const ordersData = await UsersService.getUserOrders();
        setOrders(ordersData || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
        setError('Impossible de récupérer vos informations. Veuillez vous reconnecter.');
        // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
        router.push('/connexion');
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [router]);

  if (loading) {
    return <Layout><div className="text-center py-8">Chargement...</div></Layout>;
  }

  if (error) {
    return <Layout><div className="text-center py-8 text-red-500">{error}</div></Layout>;
  }

  if (!user) {
    return <Layout><div className="text-center py-8">Utilisateur non trouvé</div></Layout>;
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Mon Profil</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Informations utilisateur */}
          <div className="md:col-span-1 space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Informations personnelles</h2>
              
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium text-gray-600">Nom:</h3>
                  <p>{user.name}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-600">Email:</h3>
                  <p>{user.email}</p>
                </div>
                
                {user.phone && (
                  <div>
                    <h3 className="font-medium text-gray-600">Téléphone:</h3>
                    <p>{user.phone}</p>
                  </div>
                )}
                
                {user.address && (
                  <div>
                    <h3 className="font-medium text-gray-600">Adresse:</h3>
                    <p>{user.address}</p>
                  </div>
                )}
              </div>
              
              <button 
                className="mt-4 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
                onClick={() => {/* Ajouter la logique pour modifier le profil */}}
              >
                Modifier mon profil
              </button>
            </div>
          </div>
          
          {/* Historique des commandes */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Historique des commandes</h2>
            
            {orders.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Vous n'avez pas encore passé de commande.</p>
                <Link href="/boutique" className="mt-4 inline-block px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors">
                  Découvrir nos produits
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">Commande #{order.reference || order.id}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(order.date).toLocaleDateString('fr-FR', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status === 'completed' ? 'Livrée' : 
                         order.status === 'pending' ? 'En attente' : 
                         order.status === 'processing' ? 'En traitement' : 
                         order.status}
                      </span>
                    </div>
                    
                    <div className="mt-2">
                      <p className="font-medium">Total: {order.total.toFixed(2)} DH</p>
                      
                      {order.products && order.products.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">{order.products.length} article(s)</p>
                          <ul className="mt-1 text-sm">
                            {order.products.slice(0, 3).map((product, index) => (
                              <li key={index} className="text-gray-600">
                                {product.quantity}x {`Produit #${product.product_id}`}
                              </li>
                            ))}
                            {order.products.length > 3 && (
                              <li className="text-gray-500 italic">+ {order.products.length - 3} autres articles</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3 text-right">
                      <button className="text-sm text-amber-600 hover:text-amber-800">
                        Voir les détails
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}