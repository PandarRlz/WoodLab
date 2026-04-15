import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Visor3D from '../components/Visor3D';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const ProductoDetalle = ({ color, setColor }) => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducto = async () => {
      const { data } = await supabase.from('productos').select('*').eq('id', id).single();
      setProducto(data);
    };
    fetchProducto();
  }, [id]);

  // VISTA DE CARGA (SKELETON) RESPONSIVO
  if (!producto) return (
    <div className="p-6 md:p-10 text-white grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
      <div className="bg-[#222] rounded-xl h-[350px] md:h-[500px] border-2 border-[#333]"></div>
      <div className="flex flex-col gap-6">
        <div className="h-12 bg-[#222] rounded w-3/4"></div>
        <div className="h-24 bg-[#222] rounded w-full"></div>
        <div className="h-10 bg-[#222] rounded w-1/4"></div>
        <div className="mt-10 space-y-4">
          <div className="h-4 bg-[#222] rounded w-1/3"></div>
          <div className="flex gap-3">
             <div className="w-12 h-12 bg-[#222] rounded-lg"></div>
             <div className="w-12 h-12 bg-[#222] rounded-lg"></div>
             <div className="w-12 h-12 bg-[#222] rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const handleAgregar = () => {
    addToCart(producto, cantidad, color);
    toast.success(`¡${cantidad} ${producto.nombre} añadido(s) al carrito!`, {
      icon: '🛒',
      style: { borderRadius: '10px', background: '#333', color: '#D2B48C' }
    });
  };

  return (
    <div className="p-6 md:p-10 text-white grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
      {/* Contenedor del Visor 3D: Altura adaptada para móvil */}
      <div className="bg-[#222] rounded-xl overflow-hidden h-[400px] md:h-[550px] border-2 border-[#333] shadow-2xl relative">
        <Visor3D modeloUrl={producto.modelo_url} colorActual={color} />
      </div>
      
      <div className="flex flex-col gap-5">
        <h1 className="text-3xl md:text-5xl font-bold">{producto.nombre}</h1>
        <p className="text-gray-400 text-base md:text-xl leading-relaxed">{producto.descripcion}</p>
        <p className="text-3xl md:text-4xl text-[#D2B48C] font-bold">${producto.precio_base.toLocaleString()}</p>
        
        <div className="mt-4">
          <p className="mb-3 font-bold uppercase text-xs tracking-widest text-gray-500">Tipo de Madera:</p>
          <div className="flex gap-4">
            <button onClick={() => setColor('#8B4513')} className={`w-12 h-12 rounded-full transition-all hover:scale-110 ${color === '#8B4513' ? 'ring-4 ring-white scale-110' : 'opacity-60'}`} style={{backgroundColor: '#8B4513'}}></button>
            <button onClick={() => setColor('#4A2C2A')} className={`w-12 h-12 rounded-full transition-all hover:scale-110 ${color === '#4A2C2A' ? 'ring-4 ring-white scale-110' : 'opacity-60'}`} style={{backgroundColor: '#4A2C2A'}}></button>
            <button onClick={() => setColor('#D2B48C')} className={`w-12 h-12 rounded-full transition-all hover:scale-110 ${color === '#D2B48C' ? 'ring-4 ring-white scale-110' : 'opacity-60'}`} style={{backgroundColor: '#D2B48C'}}></button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-6">
          <div className="flex items-center bg-[#333] rounded-xl border border-[#444] p-1">
            <button onClick={() => setCantidad(Math.max(1, cantidad - 1))} className="px-5 py-2 text-xl hover:text-[#D2B48C] transition-colors">-</button>
            <span className="px-6 font-bold font-mono text-xl">{cantidad}</span>
            <button onClick={() => setCantidad(cantidad + 1)} className="px-5 py-2 text-xl hover:text-[#D2B48C] transition-colors">+</button>
          </div>
          
          <button 
            onClick={handleAgregar}
            className="flex-1 min-w-[200px] bg-[#D2B48C] hover:bg-[#b89b74] text-black py-4 rounded-xl font-bold text-xl transition-all shadow-lg active:scale-95">
            🛒 Agregar al Carrito
          </button>
        </div>
        
        <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-4">
          * Hecho a mano con maderas certificadas
        </p>
      </div>
    </div>
  );
};

export default ProductoDetalle;