import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast'; // <--- IMPORTACIÓN

const Checkout = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    direccion: ''
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const enviarEmail = (pedidoId) => {
    const templateParams = {
      order_id: pedidoId,
      cliente_nombre: formData.nombre,
      user_email: user.email, 
      detalles_pedido: cart.map(item => `${item.nombre} (${item.color}) x${item.quantity}`).join(', '),
      total: totalPrice.toLocaleString(),
      direccion: formData.direccion
    };

    emailjs.send('service_tnzr36f', 'template_tabui7o', templateParams, 'XmODVm0pkT37NZ4WD')
      .then(() => console.log('¡Email enviado!'))
      .catch((err) => console.error('Error EmailJS:', err));
  };

  const handleFinalizarCompra = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Por favor, inicia sesión para comprar.");
    if (cart.length === 0) return toast.error("Tu carrito está vacío.");
    
    // NOTIFICACIÓN DE CARGA
    const toastId = toast.loading("Confirmando pedido y verificando stock...");
    setLoading(true);

    try {
      for (const item of cart) {
        const { data: prodCheck } = await supabase.from('productos').select('stock, nombre').eq('id', item.id).single();
        if (prodCheck && prodCheck.stock < item.quantity) {
          throw new Error(`Solo quedan ${prodCheck.stock} unidades de ${prodCheck.nombre}.`);
        }
      }

      const { data, error } = await supabase.from('pedidos').insert([{
        usuario_id: user.id,
        cliente_nombre: formData.nombre,
        telefono: formData.telefono,
        direccion: formData.direccion,
        total: totalPrice,
        items: cart,
        estado: 'pagado'
      }]).select();

      if (error) throw error;

      for (const item of cart) {
        const { data: prodData } = await supabase.from('productos').select('stock').eq('id', item.id).single();
        if (prodData) {
          await supabase.from('productos').update({ stock: prodData.stock - item.quantity }).eq('id', item.id);
        }
      }

      enviarEmail(data[0].id);

      // ÉXITO
      toast.success("¡Pedido realizado! Revisa tu correo.", { id: toastId });
      clearCart();
      navigate('/'); 

    } catch (error) {
      // ERROR ESPECÍFICO
      toast.error(error.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 text-white max-w-4xl mx-auto min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-[#D2B48C]">Finalizar Pedido en WoodLab</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <form onSubmit={handleFinalizarCompra} className="bg-[#222] p-8 rounded-2xl border border-[#333] flex flex-col gap-5 shadow-xl">
          <h3 className="text-xl font-semibold mb-2 text-white">Datos de Entrega</h3>
          <input 
            type="text" placeholder="Nombre completo" required
            className="p-3 bg-[#333] rounded-lg border border-[#444] focus:border-[#D2B48C] text-white outline-none"
            value={formData.nombre}
            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
          />
          <input 
            type="number" placeholder="Teléfono" required
            className="p-3 bg-[#333] rounded-lg border border-[#444] focus:border-[#D2B48C] text-white outline-none"
            value={formData.telefono}
            onChange={(e) => setFormData({...formData, telefono: e.target.value})}
          />
          <textarea 
            placeholder="Dirección de envío (Calle, Número, Comuna)" required
            className="p-3 bg-[#333] rounded-lg border border-[#444] focus:border-[#D2B48C] h-32 text-white outline-none"
            value={formData.direccion}
            onChange={(e) => setFormData({...formData, direccion: e.target.value})}
          />

          <button 
            type="submit"
            disabled={loading || cart.length === 0}
            className={`mt-4 py-4 rounded-xl font-bold text-lg transition-all ${loading ? 'bg-gray-700 text-gray-400' : 'bg-[#D2B48C] text-black hover:bg-[#b89b74]'}`}
          >
            {loading ? "Procesando..." : "Confirmar y Pagar"}
          </button>
        </form>

        <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-[#333] h-fit sticky top-24">
          <h3 className="text-xl font-semibold mb-6 border-b border-[#333] pb-2 text-[#D2B48C]">Resumen del Carrito</h3>
          <div className="flex flex-col gap-4">
            {cart.map((item, i) => (
              <div key={i} className="flex justify-between text-sm items-center">
                <span>
                  <span className="font-bold text-white">{item.quantity}x</span> {item.nombre} 
                  <br/> 
                  <small className="text-gray-500 uppercase text-[10px] tracking-widest">Madera: {item.color}</small>
                </span>
                <span className="font-mono text-[#D2B48C] font-bold">${(item.precio_base * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-[#444] flex justify-between items-end">
            <span className="text-gray-400">Total:</span>
            <span className="text-3xl font-bold text-[#D2B48C]">${totalPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;