import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { ProductGrid, Product } from '../../components/ProductComponents';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import api from '../../utils/api';

const AccessoiresPage = () => {
  // État pour les produits et filtres
  const [products, setProducts] = useState<Product[]>([]);
  const [accessoiresProducts, setAccessoiresProducts] = useState<Product[]>([]);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Récupérer les produits depuis l'API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/products');
        const apiProducts = response.data.products.map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          originalPrice: p.originalPrice,
          category: p.categorieId, // Adapter selon votre API
          image: p.imageUrl ? `http://localhost:3001${p.imageUrl}` : `http://localhost:3001/api/placeholder/400/400?text=${p.name}`,
          rating: 5, // Valeur par défaut si non disponible
          inStock: p.stock > 0,
          isNew: new Date(p.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Produit créé dans les 7 derniers jours
          isSale: p.originalPrice && p.originalPrice > p.price,
          colors: p.colors ? (Array.isArray(p.colors) ? p.colors.map(c => {
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
          sizes: p.sizes ? (Array.isArray(p.sizes) ? p.sizes.map(s => {
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
          description: p.description
        }));
        
        setProducts(apiProducts);
        // Filtrer uniquement les accessoires
        const accessoires = apiProducts.filter(product => {
          // Afficher dans la console pour déboguer
          console.log('Produit catégorie:', product.name, product.category);
          
          return product.category === 'Accessoires' || 
            product.category === 'accessoires' || 
            product.category === 'Accesories' || 
            product.category === 'accesories' || 
            product.category === 3 || // Si votre API utilise des IDs numériques
            (typeof product.category === 'string' && 
              (product.category.toLowerCase().includes('access') || 
               product.category.toLowerCase() === 'accessoires'));
        });
        setAccessoiresProducts(accessoires);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Options disponibles
  const colors = ['Doré', 'Argent', 'Noir', 'Blanc', 'Rose', 'Multicolore'];
  
  // Gestion des filtres
  const handleColorToggle = (color) => {
    setSelectedColors(prev =>
      prev.includes(color)
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };
  
  // Filtrage des produits
  const filteredProducts = accessoiresProducts.filter(product => {
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    
    const matchesColor = selectedColors.length === 0 || 
      (product.colors && product.colors.some(color => selectedColors.includes(color)));
    
    return matchesPrice && matchesColor;
  });
  
  // Afficher un message de chargement pendant le chargement des produits
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-8">Accessoires</h1>
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-gray-600">Chargement des produits...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Tri des produits
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return a.isNew ? -1 : b.isNew ? 1 : 0;
      default:
        return b.rating - a.rating; // populaires en premier par défaut
    }
  });

  return (
    <Layout>
      <div className="container mx-auto px-4">
        {/* Bannière de catégorie */}
        <div className="relative h-60 md:h-80 rounded-lg overflow-hidden mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40"></div>
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/categories/jewellery.png')" }}></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
            <h1 className="text-3xl md:text-5xl font-bold mb-2">Accessoires</h1>
            <p className="text-lg md:text-xl max-w-2xl">Complétez votre style avec élégance</p>
          </div>
        </div>
        
        {/* Filtres et Grille de produits */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filtres (mobile) */}
          <div className="md:hidden flex justify-between items-center mb-4">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-gray-700 hover:text-amber-700"
            >
              <Filter size={18} />
              <span>Filtres</span>
              {showFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Trier par:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="p-1 border rounded text-sm"
              >
                <option value="popular">Popularité</option>
                <option value="price-low">Prix croissant</option>
                <option value="price-high">Prix décroissant</option>
                <option value="newest">Nouveautés</option>
              </select>
            </div>
          </div>
          
          {/* Filtres (desktop et mobile expanded) */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 space-y-6`}>
            <div>
              <h3 className="text-lg font-medium mb-3">Filtres</h3>
              
              {/* Prix */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-2">Prix (DH)</h4>
                <div className="flex gap-2 items-center">
                  <input 
                    type="number" 
                    value={priceRange[0]} 
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="w-20 p-1 border rounded"
                    min="0"
                  />
                  <span>à</span>
                  <input 
                    type="number" 
                    value={priceRange[1]} 
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-20 p-1 border rounded"
                    min={priceRange[0]}
                  />
                </div>
              </div>
              
              {/* Couleurs */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-2">Couleurs</h4>
                <div className="flex flex-wrap gap-2">
                  {colors.map(color => (
                    <label key={color} className="flex items-center gap-1 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={selectedColors.includes(color)}
                        onChange={() => handleColorToggle(color)}
                        className="accent-amber-700"
                      />
                      <span className="text-sm">{color}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Types d'accessoires */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-2">Type</h4>
                <div className="flex flex-wrap gap-2">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="checkbox" className="accent-amber-700" />
                    <span className="text-sm">Bijoux</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="checkbox" className="accent-amber-700" />
                    <span className="text-sm">Sacs</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="checkbox" className="accent-amber-700" />
                    <span className="text-sm">Ceintures</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="checkbox" className="accent-amber-700" />
                    <span className="text-sm">Autres</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contenu principal */}
          <div className="flex-1">
            {/* Info résultats et tri (desktop) */}
            <div className="hidden md:flex justify-between items-center mb-6">
              <p className="text-gray-600">{sortedProducts.length} articles trouvés</p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Trier par:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="p-1 border rounded text-sm"
                >
                  <option value="popular">Popularité</option>
                  <option value="price-low">Prix croissant</option>
                  <option value="price-high">Prix décroissant</option>
                  <option value="newest">Nouveautés</option>
                </select>
              </div>
            </div>
            
            {/* Grille de produits */}
            {sortedProducts.length > 0 ? (
              <ProductGrid products={sortedProducts} />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Aucun produit ne correspond à vos critères de recherche.</p>
                <button 
                  onClick={() => {
                    setPriceRange([0, 200]);
                    setSelectedColors([]);
                  }}
                  className="mt-4 text-amber-700 hover:text-amber-800"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AccessoiresPage;
