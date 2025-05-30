import { useState } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Ici vous appellerez votre API d'authentification
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        router.push('/profile'); // Redirection après connexion
      } else {
        setError('Email ou mot de passe incorrect');
      }
    } catch (err) {
      setError('Une erreur est survenue');
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Connexion</h1>
        
        {error && <div className="mb-4 text-red-500">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2">Mot de passe</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-amber-700 text-white py-2 rounded hover:bg-amber-600"
          >
            Se connecter
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <Link href="/register" className="text-amber-700 hover:underline">
            Créer un compte
          </Link>
        </div>
      </div>
    </Layout>
  );
}