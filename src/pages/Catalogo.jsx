import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';

// Componente de carga animado
const SkeletonCard = () => (
  <div className="bg-[#222] rounded-2xl overflow-hidden border border-[#333] shadow-lg animate-pulse">
    <div className="w-full h-64 bg-[#1a1a1a]"></div>
    <div className="p-6 space-y-4">
      <div className="h-6 bg-[#333] rounded w-3/4"></div>
      <div className="h-4 bg-[#333] rounded w-full"></div>
      <div className="flex justify-between items-center pt-4 border-t border-[#333]">
        <div className="h-8 bg-[#333] rounded w-1/3"></div>
        <div className="h-4 bg-[#333] rounded w-1/4"></div>
      </div>
      <div className="h-12 bg-[#333] rounded-lg w-full mt-4"></div>
    </div>
  </div>
);

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.error('Error cargando productos:', error);
      } else {
        setProductos(data);
      }
      setLoading(false);
    };
    fetchProductos();
  }, []);

  return (
    <div className="p-10 text-white max-w-7xl mx-auto min-h-screen">
      <header className="mb-12 text-center">
        <h2 className="text-5xl font-extrabold mb-4 text-white tracking-tighter">Nuestro Catálogo</h2>
        <p className="text-xl text-[#D2B48C]">Muebles artesanales únicos, listos para personalizar en 3D</p>
      </header>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {loading ? (
          // Mostramos 8 tarjetas de carga mientras Supabase responde
          Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
        ) : productos.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-[#222] rounded-2xl border border-[#333]">
            <p className="text-2xl text-gray-500">Aún no hay muebles en el catálogo.</p>
            <p className="text-gray-600 mt-2">Vuelve pronto para ver nuestras novedades.</p>
          </div>
        ) : (
          productos.map((prod) => (
            <div key={prod.id} className="bg-[#222] rounded-2xl overflow-hidden border border-[#333] shadow-lg group hover:border-[#D2B48C] transition-all duration-300 flex flex-col">
              
              <div className="w-full h-64 bg-[#1a1a1a] overflow-hidden border-b border-[#333]">
                {prod.imagen_preview ? (
                  <img 
                    src={prod.imagen_preview} 
                    alt={prod.nombre} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 gap-2">
                    <span className="text-6xl">🪵</span>
                    <span className="text-xs uppercase tracking-widest">Sin imagen preview</span>
                  </div>
                )}
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-[#D2B48C] transition-colors">{prod.nombre}</h3>
                
                <p className="text-xs text-gray-500 mb-4 line-clamp-2 min-h-[32px]">
                  {prod.descripcion || 'Sin descripción disponible.'}
                </p>
                
                <div className="mt-auto flex justify-between items-end gap-2 border-t border-[#333] pt-4">
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-widest">Precio Base</span>
                    <p className="text-2xl font-black text-[#D2B48C]">${prod.precio_base?.toLocaleString('es-CL')}</p>
                  </div>
                  
                  <div className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${prod.stock > 3 ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>
                    {prod.stock > 0 ? `${prod.stock} un.` : 'Agotado'}
                  </div>
                </div>

                <Link 
                  to={`/producto/${prod.id}`} 
                  className="mt-6 block w-full bg-[#1a1a1a] text-[#D2B48C] border border-[#D2B48C] text-center py-3 rounded-lg font-bold text-sm hover:bg-[#D2B48C] hover:text-black transition-all active:scale-95"
                >
                  Ver Detalles / Personalizar 3D
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Catalogo;