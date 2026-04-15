import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Registro from './Registro'; 
import Login from './Login';      
import Catalogo from './Catalogo'; 
import ProductoDetalle from './ProductoDetalle'; 
import SubirProducto from './SubirProducto'; 
import Carrito from './Carrito'; 
import Checkout from './Checkout'; 
import MisPedidos from './MisPedidos'; 
import ProtectedRoute from '../components/ProtectedRoute'; 
import Visor3D from '../components/Visor3D'; 
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; 
import { useCart } from '../context/CartContext'; 
import { Toaster } from 'react-hot-toast';

const Home = ({ color, setColor }) => {
  const [productoDestacado, setProductoDestacado] = useState(null);

  useEffect(() => {
    const fetchDestacado = async () => {
      const { data } = await supabase.from('productos').select('*').limit(1).single();
      if (data) setProductoDestacado(data);
    };
    fetchDestacado();
  }, []);

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '50px' }}>
      <header style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(2.5rem, 10vw, 4rem)', marginBottom: '10px' }}>WoodLab</h1>
        <p style={{ fontSize: '1.1rem', color: '#D2B48C', maxWidth: '600px' }}>Muebles artesanales personalizados con tecnología 3D y AR</p>
        <Link to="/catalogo" style={{ 
          marginTop: '20px', 
          display: 'inline-block',
          backgroundColor: '#D2B48C', 
          color: 'black', 
          padding: '12px 30px', 
          borderRadius: '5px', 
          textDecoration: 'none',
          fontWeight: 'bold' 
        }}>
          Explorar Catálogo
        </Link>
      </header>

      {productoDestacado && (
        <section style={{ width: '90%', maxWidth: '900px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '20px' }}>Producto Destacado: {productoDestacado.nombre}</h2>
          <div style={{ width: '100%', height: '400px', borderRadius: '15px', overflow: 'hidden', border: '2px solid #333', background: '#222' }}>
            <Visor3D modeloUrl={productoDestacado.modelo_url} colorActual={color} />
          </div>
          <Link to={`/producto/${productoDestacado.id}`} style={{ color: '#D2B48C', marginTop: '15px', display: 'block' }}>
            Ver opciones de personalización
          </Link>
        </section>
      )}
    </main>
  );
};

function App() {
  const [color, setColor] = useState('#8B4513');
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null); 
  const { cart, clearCart } = useCart(); 
  const navigate = useNavigate();

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    clearCart();
    navigate('/login');
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setIsAdmin(user?.email === 'felipe.villalon1@icloud.com');
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      setIsAdmin(currentUser?.email === 'felipe.villalon1@icloud.com');
      
      if (event === 'SIGNED_OUT') {
        clearCart();
        setIsAdmin(false);
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, [clearCart]);

  return (
    <div className="App" style={{ backgroundColor: '#1a1a1a', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <Toaster position="bottom-right" toastOptions={{
        style: { background: '#333', color: '#fff', border: '1px solid #444' }
      }} />

      <nav style={{ 
        padding: '15px 10px', 
        borderBottom: '1px solid #333', 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '20px', 
        justifyContent: 'center',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        backgroundColor: 'rgba(26, 26, 26, 0.95)',
        zIndex: 100,
        backdropFilter: 'blur(10px)'
      }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Inicio</Link>
        <Link to="/catalogo" style={{ color: 'white', textDecoration: 'none' }}>Catálogo</Link>
        
        <Link to="/carrito" style={{ 
            color: '#D2B48C', 
            textDecoration: 'none', 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
        }}>
          🛒 Carrito 
          {totalItems > 0 && (
            <span style={{ backgroundColor: 'red', color: 'white', borderRadius: '50%', padding: '2px 8px', fontSize: '0.7rem' }}>
                {totalItems}
            </span>
          )}
        </Link>

        {user ? (
          <>
            <Link to="/mis-pedidos" style={{ color: 'white', textDecoration: 'none' }}>📦 Mis Pedidos</Link>
            {isAdmin && (
              <Link to="/admin/subir" style={{ color: '#D2B48C', textDecoration: 'none', border: '1px solid #D2B48C', padding: '5px 12px', borderRadius: '5px' }}>
                  Panel Admin
              </Link>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', borderLeft: '1px solid #333', paddingLeft: '20px' }}>
              <span style={{ fontSize: '0.85rem', color: '#aaa' }}>
                Hola, <b style={{ color: 'white' }}>{user.email.split('@')[0]}</b>
              </span>
              <button onClick={handleLogout} style={{ backgroundColor: 'transparent', border: '1px solid #ff4d4d', color: '#ff4d4d', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.8rem' }}>
                Salir
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/registro" style={{ color: 'white', textDecoration: 'none' }}>Registro</Link>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Entrar</Link>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Home color={color} setColor={setColor} />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/producto/:id" element={<ProductoDetalle color={color} setColor={setColor} />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/mis-pedidos" element={<MisPedidos />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/subir" element={<ProtectedRoute><SubirProducto /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;