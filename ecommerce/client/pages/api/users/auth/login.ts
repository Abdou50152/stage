import { NextApiRequest, NextApiResponse } from 'next';
import { setCookie } from 'cookies-next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  // Ici, vous devriez vérifier les credentials dans votre base de données
  // Ceci est un exemple simplifié
  if (email === 'test@example.com' && password === 'password') {
    setCookie('token', 'fake-jwt-token', { req, res, maxAge: 60 * 60 * 24 });
    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ message: 'Invalid credentials' });
}