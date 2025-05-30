import React, { useState } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import { useCart } from '../contexts/CartContext';
import { useRouter } from 'next/router';

const CheckoutPage = () => {
  const { cart, total, clearCart } = useCart();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: '',
    address: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici vous pourriez envoyer les données à votre API
    console.log('Commande passée:', { ...formData, cart, total });
    
    // Redirection vers une page de confirmation
    clearCart();
    router.push('/commande-confirmee');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Finaliser votre commande</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Formulaire */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    Ville
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse complète
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-amber-800 text-white py-3 rounded-md hover:bg-amber-700 transition-colors"
                >
                  Confirmer ma commande
                </button>
              </form>
            </div>
            
            {/* Récapitulatif du panier */}
            <div className="bg-gray-50 p-6 rounded-lg h-fit sticky top-4">
              <h2 className="font-bold text-lg mb-4">VOTRE COMMANDE</h2>
              
              <div className="space-y-4 mb-6">
                {cart.map(item => (
                  <div key={`${item.id}-${item.color}-${item.size}`} className="flex justify-between border-b pb-4">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.color}, {item.size} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">{item.price * item.quantity} MAD</p>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>TOTAL</span>
                  <span>{total} MAD</span>
                </div>
              </div>
              
              <Link href="/panier" className="block text-center text-amber-800 hover:underline mt-4">
                Modifier le panier
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;