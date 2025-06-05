import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { ProductGrid, Product } from '../../components/ProductComponents';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import ProductsService from '../../services/products.service';

const RobesPage = () => {
  // État pour les produits et le chargement
  const [robesProducts, setRobesProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // État pour les filtres
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  
  // Chargement des produits depuis l'API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await ProductsService.getAllProducts({});
        
        // L'API renvoie un objet {count, products} au lieu d'un tableau direct
        if (result && result.products && Array.isArray(result.products)) {
          // Traiter les produits pour avoir un format cohérent
          const processedProducts = result.products
            .filter(product => product.categorieId === 1) // Filtrer uniquement les robes (catégorie 1)
            .map(product => {
              let colors = [];
              let sizes = [];
              
              try {
                if (product.colors && typeof product.colors === 'string' && product.colors.trim() !== '') {
                  colors = JSON.parse(product.colors);
                }
              } catch (error) {
                console.error('Erreur parsing colors:', error);
              }
              
              try {
                if (product.sizes && typeof product.sizes === 'string' && product.sizes.trim() !== '') {
                  sizes = JSON.parse(product.sizes);
                }
              } catch (error) {
                console.error('Erreur parsing sizes:', error);
              }
              
              return {
                ...product,
                colors,
                sizes,
                category: 'robes', // Nécessaire pour la compatibilité avec le composant
                image: product.imageUrl ? `http://localhost:4000${product.imageUrl}` : null,
                inStock: product.stock > 0,
                isNew: product.isNew === 1,
                isSale: product.isSale === 1 || product.price < product.originalPrice
              };
            });
          
          setRobesProducts(processedProducts);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des robes:', err);
        setError('Impossible de charger les produits. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Options disponibles
  const colors = ['Noir', 'Blanc', 'Bleu', 'Rouge', 'Rose', 'Beige'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  
  // Gestion des filtres
  const handleColorToggle = (color) => {
    setSelectedColors(prev =>
      prev.includes(color)
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };
  
  const handleSizeToggle = (size) => {
    setSelectedSizes(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };
  
  // Filtrage des produits
  const filteredProducts = robesProducts.filter(product => {
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    
    const matchesColor = selectedColors.length === 0 || 
      (product.colors && product.colors.some(color => selectedColors.includes(color)));
    
    const matchesSize = selectedSizes.length === 0 || 
      (product.sizes && product.sizes.some(size => selectedSizes.includes(size)));
    
    return matchesPrice && matchesColor && matchesSize;
  });
  
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
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/categories/abaya.png')" }}></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
            <h1 className="text-3xl md:text-5xl font-bold mb-2">Abayas & Robes</h1>
            <p className="text-lg md:text-xl max-w-2xl">Élégance et modestie pour chaque occasion</p>
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
              
              {/* Tailles */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-2">Tailles</h4>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(size => (
                    <label key={size} className="flex items-center gap-1 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={selectedSizes.includes(size)}
                        onChange={() => handleSizeToggle(size)}
                        className="accent-amber-700"
                      />
                      <span className="text-sm">{size}</span>
                    </label>
                  ))}
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
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Chargement des produits...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500">{error}</p>
              </div>
            ) : sortedProducts.length > 0 ? (
              <ProductGrid products={sortedProducts} />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Aucun produit ne correspond à vos critères de recherche.</p>
                <button 
                  onClick={() => {
                    setPriceRange([0, 200]);
                    setSelectedColors([]);
                    setSelectedSizes([]);
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

export default RobesPage;
