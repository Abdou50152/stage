import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import { ProductGrid, sampleProducts } from '../components/ProductComponents';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const HomePage = () => {
  // Filtrer les produits en vedette ou nouveaux
  const featuredProducts = sampleProducts.filter((product) => product.isNew || product.isSale).slice(0, 4);
  
  // Filtrer les produits par catégorie
  const robes = sampleProducts.filter((product) => product.category === 'robes').slice(0, 4);
  const Accesories = sampleProducts.filter((product) => product.category === 'Accesories').slice(0, 4);
  const foulards = sampleProducts.filter((product) => product.category === 'foulards').slice(0, 4);
  
  // Images du carrousel
  const carouselImages = [
    '/images/bg/bg.jpg',
    '/images/bg/bg1.jpg',
    
  ];
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () => setCurrentSlide((prevSlide) => (prevSlide === carouselImages.length - 1 ? 0 : prevSlide + 1)),
      5000 // 5 secondes par slide
    );

    return () => {
      resetTimeout();
    };
  }, [currentSlide, carouselImages.length]);

  return (
    <Layout>
      {/* Hero Section */}
      {/* <section className="relative bg-gray-100 rounded-lg overflow-hidden"> */}
        {/* <div className="absolute inset-0 bg-gradient-to-r from-pink-600/90 to-pink-600/70"></div> */}
 {/* <section className="relative bg-gray-100 rounded-lg overflow-hidden"> */}
<section className="relative h-[900px] md:h-[800px] overflow-hidden">
  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
  
  {/* Carrousel d'images */}
  <div className="relative h-full w-full overflow-hidden">
    {carouselImages.map((image, index) => (
      <div
        key={index}
        className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
          index === currentSlide ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ backgroundImage: `url('${image}')` }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
    ))}
    
    {/* Indicateurs de slide */}
    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
      {carouselImages.map((_, index) => (
        <button
          key={index}
          className={`w-3 h-3 rounded-full transition-colors ${
            index === currentSlide ? 'bg-white' : 'bg-white/50'
          }`}
          onClick={() => setCurrentSlide(index)}
          aria-label={`Voir l'image ${index + 1}`}
        />
      ))}
    </div>
  </div>

  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center w-full h-full text-center text-white px-4">
    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-wide">Élégance et Modestie</h1>
    <p className="text-lg md:text-2xl mb-8 max-w-2xl">
      Découvrez notre nouvelle collection de vêtements élégants pour femmes
    </p> 
    {/* <div className="flex gap-4">
      <Link href="/categories/robes" className="bg-white text-black px-6 py-3 rounded-full font-medium shadow-md hover:bg-gray-100 transition">
        Voir la boutique
      </Link>
      <Link href="/boutique" className="border border-white text-white px-6 py-3 rounded-full font-medium hover:bg-white/10 transition">
        Explorer tout
      </Link>
    </div> */}
  </div>
</section>

      {/* Featured Products */}
      {/* <section className="mt-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Produits en vedette</h2>
            <p className="text-gray-600 mt-2">Découvrez nos dernières arrivées et offres spéciales</p>
          </div>
          <Link href="/boutique" className="text-yellow-700 hover:text-amber-950 flex items-center gap-1 transition-colors">
            Voir tout <ArrowRight size={16} />
          </Link>
        </div>
        <ProductGrid products={featuredProducts} />
      </section> */}

      {/* Categories Showcase */}
      <section className="mt-20">
        <h2 className="text-2xl font-bold mb-8">Nos catégories</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Robes Category */}
          <div className="relative h-80 rounded-lg overflow-hidden group">
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors filter blur-sm"></div>
         <div  className="absolute inset-0 bg-cover bg-center "
        style={{ backgroundImage: "url('/images/categories/abaya.png')" }} // Remplace avec le chemin de ton image
  >
            <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-50 text-center p-6 ">
              <h3 className="text-2xl font-bold mb-2">Abaya</h3>
              {/* <p className="mb-4">Élégance pour chaque occasion</p> */}
              <Link href="/categories/robes" className="px-4 py-2 bg-white text-amber-900 rounded-md hover:bg-gray-100 transition-colors">
                Découvrir
              </Link>
            </div>
          </div>
          </div>
          {/* Hijabs Category */}
          <div className="relative h-80 rounded-lg overflow-hidden group">
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
          <div  className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/categories/jewellery.png')" }} // Remplace avec le chemin de ton image
  ></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
              <h3 className="text-2xl font-bold mb-2">Accesories</h3>
              <p className="mb-4">Ajoutez une touche d'élégance</p>
              <Link href="/categories/Accesories" className="px-4 py-2 bg-white text-amber-900 rounded-md hover:bg-gray-100 transition-colors">
                Découvrir
              </Link>
            </div>
          </div>
          
          {/* Foulards Category */}
          <div className="relative h-80 rounded-lg overflow-hidden group">
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
                   <div  className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/categories/foulard.png')" }} // Remplace avec le chemin de ton image
  ></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
              <h3 className="text-2xl font-bold mb-2">Foulards</h3>
              <p className="mb-4">Pour un style modeste et raffiné</p>
              <Link href="/categories/foulards" className="px-4 py-2 bg-white text-amber-900 rounded-md hover:bg-gray-100 transition-colors">
                Découvrir
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Best Sellers */}
      <section className="mt-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Meilleures ventes</h2>
            <p className="text-gray-600 mt-2">Nos produits les plus populaires</p>
          </div>
        </div>
        <ProductGrid products={sampleProducts.slice(0, 8)} />
      </section>
      
      {/* Newsletter */}
      {/* <section className="mt-20 bg-gray-100 rounded-lg">
        <div className="container mx-auto px-6 py-12 md:py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Abonnez-vous à notre newsletter</h2>
            <p className="text-gray-600 mb-6">
              Recevez les dernières tendances, nouveautés et offres exclusives directement dans votre boîte de réception.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Votre adresse email" 
                className="px-4 py-3 flex-grow rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent" 
              />
              <button 
                type="submit" 
                className="px-6 py-3 bg-pink-600 text-white font-medium rounded-md hover:bg-pink-700 transition-colors"
              >
                S'abonner
              </button>
            </form>
          </div>
        </div>
      </section> */}
    </Layout>
  );
};

export default HomePage;