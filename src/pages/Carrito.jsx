import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Carrito = () => {
  const { cart, removeFromCart, totalPrice, clearCart, addToCart } = useCart();

  // Función para manejar el aumento/disminución de cantidad desde el carrito
  const handleQuantity = (item, delta) => {
    if (item.quantity + delta > 0) {
      // Reutilizamos addToCart pasando el delta (1 o -1)
      addToCart(item, delta, item.color);
    }
  };

  return (
    <div className="p-10 text-white max-w-5xl mx-auto min-h-screen">
      <h1 className="text-4xl font-bold mb-8 border-b border-[#333] pb-4">Tu Carrito</h1>
      
      {cart.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-400 mb-6">Tu carrito está vacío.</p>
          <Link to="/catalogo" className="bg-[#D2B48C] text-black px-6 py-3 rounded-lg font-bold hover:bg-[#b89b74] transition-colors">
            Volver al Catálogo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* LISTA DE PRODUCTOS (COLUMNA IZQUIERDA) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {cart.map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row justify-between items-center bg-[#222] p-6 rounded-xl border border-[#333] hover:border-[#444] transition-all shadow-md">
                
                <div className="flex items-center gap-6 w-full">
                  {/* Miniatura representativa del color */}
                  <div 
                    className="w-16 h-16 rounded-lg shadow-inner flex-shrink-0" 
                    style={{ backgroundColor: item.color, border: '2px solid #444' }}
                  ></div>
                  
                  <div className="flex flex-col">
                    <span className="font-bold text-xl">{item.nombre}</span>
                    <span className="text-sm text-gray-400 uppercase tracking-tighter">Madera: {item.color}</span>
                    <span className="text-[#D2B48C] font-semibold mt-1">${item.precio_base.toLocaleString()} c/u</span>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full md:w-auto mt-4 md:mt-0 gap-8">
                  {/* CONTROL DE CANTIDAD */}
                  <div className="flex items-center bg-[#333] rounded-lg border border-[#444]">
                    <button 
                      onClick={() => handleQuantity(item, -1)} 
                      className="px-4 py-1 hover:bg-[#444] transition-colors text-xl font-bold"
                    >
                      -
                    </button>
                    <span className="px-4 font-mono font-bold text-lg">{item.quantity}</span>
                    <button 
                      onClick={() => handleQuantity(item, 1)} 
                      className="px-4 py-1 hover:bg-[#444] transition-colors text-xl font-bold"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right min-w-[120px]">
                    <p className="text-xl font-bold text-white">${(item.precio_base * item.quantity).toLocaleString()}</p>
                    <button 
                      onClick={() => removeFromCart(item.id, item.color)}
                      className="text-red-500 text-xs hover:text-red-400 hover:underline mt-1 transition-colors"
                    >
                      Quitar producto
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button 
              onClick={() => { if(window.confirm("¿Vaciar todo el carrito?")) clearCart() }} 
              className="text-gray-500 hover:text-red-400 text-sm self-start mt-4 transition-colors"
            >
              🗑️ Vaciar todo el carrito
            </button>
          </div>

          {/* RESUMEN DE COMPRA (COLUMNA DERECHA) */}
          <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-[#333] h-fit sticky top-28 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-white">Resumen</h2>
            
            <div className="flex justify-between mb-4 text-gray-400">
              <span>Subtotal</span>
              <span className="text-white">${totalPrice.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between mb-4 text-gray-400">
              <span>Envío</span>
              <span className="text-green-500 font-bold italic underline">Gratis</span>
            </div>
            
            <hr className="border-[#333] my-6" />
            
            <div className="flex justify-between items-end mb-8">
              <span className="text-lg text-gray-300">Total</span>
              <span className="text-4xl font-bold text-[#D2B48C]">${totalPrice.toLocaleString()}</span>
            </div>
            
            {/* CAMBIO CLAVE: Ahora es un Link que lleva a Checkout */}
            <Link 
              to="/checkout" 
              className="block w-full bg-[#D2B48C] text-black py-5 rounded-xl font-black text-center text-lg hover:bg-[#b89b74] shadow-lg transition-all active:scale-95 uppercase tracking-wider"
            >
              Proceder al Pago
            </Link>
            
            <p className="text-[10px] text-gray-500 text-center mt-6 uppercase tracking-[3px] opacity-50">
              WoodLab Secure Checkout
            </p>
          </div>

        </div>
      )}
    </div>
  );
};

export default Carrito;