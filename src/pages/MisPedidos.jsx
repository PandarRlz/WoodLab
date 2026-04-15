import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';

const MisPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMisPedidos = async () => {
      // 1. Obtenemos el usuario actual
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // 2. Filtramos pedidos por el ID del usuario logueado
        const { data, error } = await supabase
          .from('pedidos')
          .select('*')
          .eq('usuario_id', user.id)
          .order('fecha_creacion', { ascending: false });

        if (!error) setPedidos(data);
      }
      setLoading(false);
    };

    fetchMisPedidos();
  }, []);

  if (loading) return <div className="text-white p-20 text-center animate-pulse">Cargando tu historial...</div>;

  return (
    <div className="p-10 text-white max-w-5xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-bold text-[#D2B48C]">Mis Pedidos</h2>
        <Link to="/catalogo" className="text-sm text-gray-400 hover:text-[#D2B48C] transition-colors">
          ← Seguir comprando
        </Link>
      </div>
      
      {pedidos.length === 0 ? (
        <div className="bg-[#222] p-16 rounded-2xl border border-[#333] text-center shadow-xl">
          <p className="text-xl text-gray-400 mb-6">Aún no has realizado pedidos.</p>
          <Link to="/catalogo" className="bg-[#D2B48C] text-black px-8 py-3 rounded-lg font-bold hover:bg-[#b89b74]">
            Ver Catálogo
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {pedidos.map((ped) => (
            <div key={ped.id} className="bg-[#222] rounded-2xl border border-[#333] overflow-hidden shadow-2xl hover:border-[#444] transition-all">
              {/* Encabezado del Pedido */}
              <div className="bg-[#2a2a2a] p-5 flex flex-wrap justify-between items-center gap-4 border-b border-[#333]">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Pedido ID</p>
                  <p className="font-mono text-sm text-[#D2B48C]">#{ped.id.substring(0, 8)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Fecha</p>
                  <p className="text-sm">{new Date(ped.fecha_creacion).toLocaleDateString('es-CL')}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Estado</p>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${
                    ped.estado === 'entregado' ? 'bg-green-900 text-green-200' : 
                    ped.estado === 'enviado' ? 'bg-blue-900 text-blue-200' : 
                    'bg-[#D2B48C] text-black'
                  }`}>
                    {ped.estado}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Total</p>
                  <p className="text-xl font-bold">${ped.total?.toLocaleString()}</p>
                </div>
              </div>

              {/* Cuerpo del Pedido */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-sm font-bold text-gray-400 mb-4 flex items-center gap-2">
                    📦 Productos
                  </h4>
                  <div className="space-y-3">
                    {ped.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-[#1a1a1a] p-3 rounded-lg border border-[#333]">
                        <div className="text-sm">
                          <span className="text-[#D2B48C] font-bold">{item.quantity}x</span> {item.nombre}
                          <p className="text-[10px] text-gray-500 italic">Acabado: {item.color}</p>
                        </div>
                        <span className="text-xs font-mono text-gray-400">${(item.precio_base * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#1a1a1a] p-5 rounded-xl border border-[#333] h-fit">
                  <h4 className="text-sm font-bold text-gray-400 mb-3 flex items-center gap-2">
                    📍 Datos de Envío
                  </h4>
                  <p className="text-sm text-white mb-1 font-semibold">{ped.cliente_nombre}</p>
                  <p className="text-xs text-gray-400 leading-relaxed mb-3">{ped.direccion}</p>
                  <p className="text-xs text-[#D2B48C] font-mono">📞 {ped.telefono}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisPedidos;