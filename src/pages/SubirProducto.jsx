import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';

const SubirProducto = () => {
  const [loading, setLoading] = useState(false);
  const [productos, setProductos] = useState([]); 
  const [pedidos, setPedidos] = useState([]); 
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [archivo3D, setArchivo3D] = useState(null);
  const [archivoImagen, setArchivoImagen] = useState(null);

  useEffect(() => {
    fetchProductos();
    fetchPedidos();
  }, []);

  const fetchProductos = async () => {
    const { data } = await supabase.from('productos').select('*').order('id', { ascending: false });
    if (data) setProductos(data);
  };

  const fetchPedidos = async () => {
    const { data, error } = await supabase
      .from('pedidos')
      .select('*')
      .order('fecha_creacion', { ascending: false }); 
    if (data) setPedidos(data);
    if (error) console.error("Error pedidos:", error);
  };

  // --- NUEVA FUNCIÓN: ACTUALIZAR STOCK MANUALMENTE ---
  const actualizarStock = async (id, nuevoStock) => {
    const { error } = await supabase
      .from('productos')
      .update({ stock: nuevoStock })
      .eq('id', id);

    if (error) {
      toast.error("Error al actualizar el stock");
    } else {
      toast.success("Stock actualizado");
      setProductos(productos.map(p => p.id === id ? { ...p, stock: nuevoStock } : p));
    }
  };

  const cambiarEstadoPedido = async (pedidoId, nuevoEstado) => {
    const { error } = await supabase
      .from('pedidos')
      .update({ estado: nuevoEstado })
      .eq('id', pedidoId);

    if (error) {
      toast.error("Error al actualizar estado");
    } else {
      toast.success("Estado actualizado");
      fetchPedidos(); 
    }
  };

  // --- LÓGICA DE ESTADÍSTICAS ---
  const stats = {
    ventasTotales: pedidos.reduce((acc, curr) => acc + (curr.total || 0), 0),
    pedidosPendientes: pedidos.filter(p => p.estado !== 'entregado' && p.estado !== 'cancelado').length,
    stockCritico: productos.filter(p => p.stock <= 3).length,
    totalClientes: [...new Set(pedidos.map(p => p.usuario_id))].length
  };

  const handleSubir = async (e) => {
    e.preventDefault();
    if (!archivo3D) return toast.error("Selecciona un archivo .glb");
    if (!archivoImagen) return toast.error("Selecciona una imagen de preview");
    setLoading(true);
    
    try {
      const fileExt3D = archivo3D.name.split('.').pop();
      const fileName3D = `${Math.random()}.${fileExt3D}`;
      const { error: uploadError3D } = await supabase.storage.from('modelos').upload(fileName3D, archivo3D);
      if (uploadError3D) throw uploadError3D;
      const { data: urlData3D } = supabase.storage.from('modelos').getPublicUrl(fileName3D);

      const fileExtImg = archivoImagen.name.split('.').pop();
      const fileNameImg = `${Math.random()}.${fileExtImg}`;
      const { error: uploadErrorImg } = await supabase.storage.from('modelos').upload(fileNameImg, archivoImagen);
      if (uploadErrorImg) throw uploadErrorImg;
      const { data: urlDataImg } = supabase.storage.from('modelos').getPublicUrl(fileNameImg);

      const { error: insertError } = await supabase.from('productos').insert([
        { 
          nombre, 
          precio_base: parseInt(precio), 
          descripcion, 
          modelo_url: urlData3D.publicUrl, 
          imagen_preview: urlDataImg.publicUrl,
          stock: 10 
        }
      ]);
      if (insertError) throw insertError;

      toast.success("¡Producto publicado!");
      setNombre(''); setPrecio(''); setDescripcion(''); setArchivo3D(null); setArchivoImagen(null);
      e.target.reset();
      fetchProductos();
    } catch (error) { 
        toast.error("Error: " + error.message); 
    } finally { 
        setLoading(false); 
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar este producto?")) return;
    await supabase.from('productos').delete().eq('id', id);
    fetchProductos();
    toast.success("Producto eliminado");
  };

  return (
    <div className="flex flex-col items-center py-10 gap-8 text-white">
      
      {/* --- DASHBOARD DE ESTADÍSTICAS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl px-4">
        <div className="bg-[#222] p-6 rounded-2xl border border-[#333] shadow-lg text-center">
          <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mb-1">Ventas Totales</p>
          <h4 className="text-2xl font-bold text-green-500">${stats.ventasTotales.toLocaleString()}</h4>
        </div>
        <div className="bg-[#222] p-6 rounded-2xl border border-[#333] shadow-lg text-center">
          <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mb-1">Pedidos Activos</p>
          <h4 className="text-2xl font-bold text-[#D2B48C]">{stats.pedidosPendientes}</h4>
        </div>
        <div className="bg-[#222] p-6 rounded-2xl border border-[#333] shadow-lg text-center">
          <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mb-1">Stock Crítico</p>
          <h4 className={`text-2xl font-bold ${stats.stockCritico > 0 ? 'text-red-500' : 'text-gray-300'}`}>{stats.stockCritico}</h4>
        </div>
        <div className="bg-[#222] p-6 rounded-2xl border border-[#333] shadow-lg text-center">
          <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mb-1">Clientes</p>
          <h4 className="text-2xl font-bold text-blue-400">{stats.totalClientes}</h4>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-10 w-full max-w-5xl px-4">
        {/* FORMULARIO */}
        <form onSubmit={handleSubir} className="bg-[#222] p-8 rounded-xl border border-[#333] w-full max-w-md flex flex-col gap-4 shadow-xl h-fit">
          <h2 className="text-xl font-bold text-[#D2B48C]">Nuevo Mueble</h2>
          <input type="text" placeholder="Nombre" value={nombre} className="p-3 bg-[#333] border border-[#444] rounded outline-none focus:border-[#D2B48C]" onChange={(e) => setNombre(e.target.value)} required />
          <input type="number" placeholder="Precio" value={precio} className="p-3 bg-[#333] border border-[#444] rounded outline-none focus:border-[#D2B48C]" onChange={(e) => setPrecio(e.target.value)} required />
          <textarea placeholder="Descripción" value={descripcion} className="p-3 bg-[#333] border border-[#444] rounded h-24 outline-none focus:border-[#D2B48C]" onChange={(e) => setDescripcion(e.target.value)} />
          <div className="text-[10px] text-gray-500 flex flex-col gap-2">
            <label>Modelo 3D (.glb)</label>
            <input type="file" accept=".glb" onChange={(e) => setArchivo3D(e.target.files[0])} required />
            <label>Imagen Catálogo</label>
            <input type="file" accept="image/*" onChange={(e) => setArchivoImagen(e.target.files[0])} required />
          </div>
          <button type="submit" disabled={loading} className="mt-2 p-4 bg-[#D2B48C] text-black font-bold rounded hover:bg-[#b89b74] transition-all">
            {loading ? 'Subiendo...' : 'Publicar Producto'}
          </button>
        </form>

        {/* INVENTARIO CON ACTUALIZACIÓN MANUAL */}
        <div className="flex-1 min-w-[300px] bg-[#222] rounded-xl border border-[#333] overflow-hidden shadow-xl">
          <div className="p-4 bg-[#1a1a1a] border-b border-[#333] font-bold text-[#D2B48C] text-sm tracking-widest uppercase">📦 Inventario</div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#333] text-gray-500 uppercase">
                    <th className="p-4">Vista</th>
                    <th className="p-4">Producto</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody>
                {productos.map(p => (
                  <tr key={p.id} className="border-b border-[#333] hover:bg-[#282828]">
                    <td className="p-4">
                        <img src={p.imagen_preview} alt="" className="w-10 h-10 object-cover rounded border border-[#444]" />
                    </td>
                    <td className="p-4 font-bold">{p.nombre}</td>
                    <td className="p-4">
                        {/* INPUT DE STOCK MANUAL */}
                        <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            defaultValue={p.stock}
                            className="w-14 bg-[#111] border border-[#444] rounded p-1 text-center text-[#D2B48C] focus:border-[#D2B48C] outline-none"
                            onBlur={(e) => {
                              const val = parseInt(e.target.value);
                              if (val !== p.stock) actualizarStock(p.id, val);
                            }}
                          />
                          <span className="text-[9px] text-gray-600">UDS</span>
                        </div>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleEliminar(p.id)} className="text-red-500 hover:text-red-400">Borrar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* VENTAS */}
      <div className="w-full max-w-5xl bg-[#222] rounded-xl border border-[#333] overflow-hidden shadow-2xl mb-10 mx-4">
        <div className="p-4 bg-[#1a1a1a] border-b border-[#333] text-[#D2B48C] font-bold uppercase text-sm tracking-widest">🛒 Ventas Recientes</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#333] text-gray-500 uppercase">
                <th className="p-4">Cliente / Fecha</th>
                <th className="p-4">Contacto / Envío</th>
                <th className="p-4">Items</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map(ped => (
                <tr key={ped.id} className="border-b border-[#333] hover:bg-[#2a2a2a]">
                  <td className="p-4 italic">
                    <div className="font-bold text-white not-italic">{ped.cliente_nombre}</div>
                    <div className="text-[9px] text-gray-500">{new Date(ped.fecha_creacion).toLocaleDateString()}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-[10px] text-gray-300">{ped.direccion}</div>
                    <div className="text-[#D2B48C] font-mono">{ped.telefono}</div>
                  </td>
                  <td className="p-4">
                    {ped.items?.map((item, idx) => (
                      <span key={idx} className="bg-[#333] rounded px-1 mr-1 text-[9px] border border-[#444]">{item.quantity}x {item.nombre}</span>
                    ))}
                  </td>
                  <td className="p-4">
                    <select 
                      value={ped.estado} 
                      onChange={(e) => cambiarEstadoPedido(ped.id, e.target.value)}
                      className={`p-1 rounded text-[9px] font-bold uppercase outline-none cursor-pointer ${
                        ped.estado === 'entregado' ? 'bg-green-600' : ped.estado === 'enviado' ? 'bg-blue-600' : 'bg-[#D2B48C] text-black'
                      }`}
                    >
                      <option value="pagado">Pagado</option>
                      <option value="fabricando">Fabricando</option>
                      <option value="enviado">Enviado</option>
                      <option value="entregado">Entregado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </td>
                  <td className="p-4 font-bold text-green-500 text-right">
                    ${ped.total?.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubirProducto;