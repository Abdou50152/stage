import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { ProductGrid, Product } from '../../components/ProductComponents';
import { Minus, Plus, Heart, Share, ShoppingBag, ChevronRight, Star, Truck, Package, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import AddToCartButton from '../../components/AddToCartButton';
import { useCart } from '../../contexts/CartContext';
import SizeGuideModal from '../../components/SizeGuideModal';
import api from '../../utils/api';

const ProductDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart } = useCart();

  // États pour le produit et les produits similaires
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // État pour les sélections
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  // Récupérer les données du produit depuis l'API
  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await api.get(`/products/${id}`);
        console.log('Données du produit:', response.data);
        
        if (response.data) {
          const productData = response.data;

          // Formater les données du produit
          const formattedProduct = {
            id: productData.id,
            name: productData.name,
            price: productData.price,
            originalPrice: productData.originalPrice,
            category: productData.categorieId,
            // Utiliser l'URL de l'image si elle existe, sinon utiliser un placeholder
            image: productData.imageUrl 
              ? `http://localhost:3001${productData.imageUrl}` 
              : `http://localhost:3001/api/placeholder/800/800?text=${productData.name}`,
            rating: 5, // Valeur par défaut
            inStock: productData.stock > 0,
            isNew: new Date(productData.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            isSale: productData.originalPrice && productData.originalPrice > productData.price,
            colors: productData.colors ? (Array.isArray(productData.colors) ? productData.colors.map(c => {
              if (typeof c === 'string') {
                try {
                  const parsed = JSON.parse(c);
                  return parsed.name;
                } catch (e) {
                  console.error('Erreur de parsing JSON pour la couleur:', c, e);
                  return '';
                }
              }
              return c.name || '';
            }).filter(Boolean) : []) : [],
            sizes: productData.sizes ? (Array.isArray(productData.sizes) ? productData.sizes.map(s => {
              if (typeof s === 'string') {
                try {
                  const parsed = JSON.parse(s);
                  return parsed.name;
                } catch (e) {
                  console.error('Erreur de parsing JSON pour la taille:', s, e);
                  return '';
                }
              }
              return s.name || '';
            }).filter(Boolean) : []) : [],
            description: productData.description
          };

          setProduct(formattedProduct);

          // Définir les valeurs par défaut pour la couleur et la taille
          if (formattedProduct.colors && formattedProduct.colors.length > 0) {
            setSelectedColor(formattedProduct.colors[0]);
          }

          if (formattedProduct.sizes && formattedProduct.sizes.length > 0) {
            setSelectedSize(formattedProduct.sizes[0]);
          }

          // Récupérer les produits similaires
          const productsResponse = await api.get('/products');
          if (productsResponse.data && productsResponse.data.products) {
            const allProducts = productsResponse.data.products.map(p => ({
              id: p.id,
              name: p.name,
              price: p.price,
              originalPrice: p.originalPrice,
              category: p.categorieId,
              image: p.imageUrl 
                ? `http://localhost:3001${p.imageUrl}` 
                : `http://localhost:3001/api/placeholder/400/400?text=${p.name}`,
              rating: 5,
              inStock: p.stock > 0,
              isNew: new Date(p.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              isSale: p.originalPrice && p.originalPrice > p.price
            }));

            // Filtrer les produits similaires (même catégorie)
            const similar = allProducts
              .filter(p => p.category === formattedProduct.category && p.id !== formattedProduct.id)
              .slice(0, 4);

            setSimilarProducts(similar);
          }
        } else {
          setError(true);
        }

        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération du produit:', error);
        setError(true);
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  // Afficher un message de chargement
  if (loading) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold mb-4">Chargement du produit...</h1>
          <p className="text-gray-600">Veuillez patienter pendant que nous récupérons les informations du produit.</p>
        </div>
      </Layout>
    );
  }

  // Si le produit n'est pas trouvé ou s'il y a une erreur
  if (!product || error) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold mb-4">Produit non trouvé</h1>
          <p className="text-gray-600 mb-6">Le produit que vous recherchez n'existe pas ou a été supprimé.</p>
          <Link href="/boutique" className="px-6 py-2 bg-amber-800 text-white rounded-md hover:bg-amber-700 transition-colors">
            Retour à la boutique
          </Link>
        </div>
      </Layout>
    );
  }

  // Event handlers
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        color: selectedColor,
        size: selectedSize,
        image: product.image || '/placeholder-product.jpg'
      });
    }
  };

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-pink-600 transition-colors">Accueil</Link>
        <ChevronRight size={16} className="mx-2" />
        <Link href="/boutique" className="hover:text-pink-600 transition-colors">Boutique</Link>
        <ChevronRight size={16} className="mx-2" />
        <Link href={`/categories/${product.category}`} className="hover:text-pink-600 transition-colors capitalize">{product.category}</Link>
        <ChevronRight size={16} className="mx-2" />
        <span className="text-gray-900 font-medium truncate">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product images */}
        <div>
          <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 aspect-square">
            <img 
              src={product.image || `http://localhost:3001/api/placeholder/800/800?text=${product.name}`} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-lg overflow-hidden aspect-square">
                <img 
                  src={`http://localhost:3001/api/placeholder/200/200?text=Vue ${index + 1}`} 
                  alt={`${product.name} vue ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Product details */}
        <div>
          {/* Badges */}
          <div className="flex space-x-2 mb-2">
            {product.isNew && (
              <span className="bg-green-500 text-white text-xs py-1 px-2 rounded">Nouveau</span>
            )}
            {product.isSale && (
              <span className="bg-red-500 text-white text-xs py-1 px-2 rounded">Solde</span>
            )}
          </div>
          
          {/* Title and price */}
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-4">
            {product.originalPrice ? (
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-amber-600">{product.price.toFixed(2)} DH</span>
                <span className="text-gray-500 line-through">{product.originalPrice.toFixed(2)} DH</span>
                <span className="bg-pink-100 text-amber-700 text-sm px-2 py-0.5 rounded">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                </span>
              </div>
            ) : (
              <span className="text-xl font-bold text-amber-700">{product.price.toFixed(2)} DH</span>
            )}
          </div>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < product.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">4.8 (120 avis)</span>
          </div>
          
          <hr className="my-6" />
          
          {/* Description */}
        <div className="mb-6">
            <h2 className="text-lg font-medium mb-2">Description</h2>
            <p className="text-gray-600">
              {product.description || 'Aucune description disponible pour ce produit.'}
            </p>
          </div>
          
          {/* Color options */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-2">Couleur</h2>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1 border rounded-full text-sm ${
                      selectedColor === color 
                        ? 'bg-pink-100 border-amber-800 text-amber-800' 
                        : 'border-gray-300'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Size options */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-medium">Taille</h2>
                    <SizeGuideModal /> 
                    
                {/* <button className="text-sm text-pink-600 hover:underline">Guide des tailles</button> */}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-10 h-10 flex items-center justify-center border rounded-md ${
                      selectedSize === size 
                        ? 'bg-pink-100 border-amber-800 text-amber-800' 
                        : 'border-gray-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Quantity */}
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2">Quantité</h2>
            <div className="flex items-center">
              <button 
                onClick={decreaseQuantity}
                className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l-md"
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <div className="w-14 h-10 flex items-center justify-center border-t border-b border-gray-300">
                {quantity}
              </div>
              <button 
                onClick={increaseQuantity}
                className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r-md"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`flex-grow flex items-center justify-center gap-2 px-6 py-3 rounded-md ${
                product.inStock 
                  ? 'bg-amber-800 text-white hover:bg-amber-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              } transition-colors`}
            >
              <ShoppingBag size={20} />
              {product.inStock ? 'Ajouter au panier' : 'En rupture de stock'}
            </button>
            <button className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
              <Heart size={20} />
            </button>
            <button className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
              <Share size={20} />
            </button>
          </div>
          
          {/* Additional info */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="text-gray-600">
                <Truck size={20} />
              </div>
              <div>
                <h3 className="font-medium">Livraison disponible</h3>
                <p className="text-sm text-gray-600">Paiement à la livraison disponible</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-gray-600">
                <Package size={20} />
              </div>
              <div>
                <h3 className="font-medium">Produit authentique</h3>
                <p className="text-sm text-gray-600">Qualité garantie</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-gray-600">
                <RefreshCcw size={20} />
              </div>
              <div>
                <h3 className="font-medium">Retours faciles</h3>
                <p className="text-sm text-gray-600">Retournez votre commande dans les 30 jours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Similar products */}
      {similarProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Vous pourriez aussi aimer</h2>
          <ProductGrid products={similarProducts} />
        </section>
      )}
    </Layout>
  );
};

export default ProductDetailPage;