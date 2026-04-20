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

/* ─── Fondo de madera SVG inline (pattern) ─── */
const WoodBackground = () => (
  <div
    aria-hidden="true"
    className="fixed inset-0 -z-10 pointer-events-none"
    style={{
      background: `
        radial-gradient(ellipse at 20% 50%, rgba(139,69,19,0.18) 0%, transparent 60%),
        radial-gradient(ellipse at 80% 20%, rgba(160,82,45,0.15) 0%, transparent 55%),
        radial-gradient(ellipse at 60% 80%, rgba(101,67,33,0.12) 0%, transparent 50%),
        linear-gradient(160deg, #0d0a07 0%, #1a1008 40%, #120e06 70%, #0f0c05 100%)
      `,
    }}
  >
    {/* Vetas de madera SVG */}
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.06]"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <pattern id="woodgrain" x="0" y="0" width="100%" height="100%" patternUnits="userSpaceOnUse">
          <rect width="100%" height="100%" filter="url(#grain)" opacity="1" fill="#8B4513" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#woodgrain)" />
    </svg>

    {/* Líneas de veta estilizadas */}
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.04]"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      {[...Array(18)].map((_, i) => (
        <path
          key={i}
          d={`M${-100 + i * 120},0 Q${i * 120 + 60},${200 + i * 30} ${i * 120},100vh`}
          stroke="#D2A679"
          strokeWidth={0.8 + (i % 3) * 0.4}
          fill="none"
        />
      ))}
    </svg>

    {/* Overlay oscuro inferior */}
    <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/40 to-transparent" />
  </div>
);

/* ─── Componente Home ─── */
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
    <main className="flex flex-col items-center pb-20">
      {/* Hero */}
      <header className="relative w-full flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden">
        {/* Halo dorado detrás del título */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(210,180,140,0.10) 0%, transparent 70%)',
          }}
        />

        {/* Badge */}
        <span className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase border border-amber-700/50 bg-amber-950/40 text-amber-400">
          🪵 Hecho a mano · Tecnología 3D
        </span>

        <h1
          className="font-black tracking-tight leading-none mb-4"
          style={{
            fontSize: 'clamp(3.5rem, 12vw, 7rem)',
            background: 'linear-gradient(135deg, #F5DEB3 0%, #D2A665 40%, #A0522D 80%, #8B4513 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: 'none',
          }}
        >
          WoodLab
        </h1>

        <p className="text-lg text-amber-200/70 max-w-xl mb-8 font-light leading-relaxed">
          Muebles artesanales personalizados con visualización 3D y realidad aumentada
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/catalogo"
            className="group relative px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #D2A665, #A0522D)',
              color: '#fff',
              boxShadow: '0 4px 24px rgba(160,82,45,0.45), inset 0 1px 0 rgba(255,255,255,0.15)',
            }}
          >
            <span className="relative z-10">Explorar Catálogo →</span>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <Link
            to="/registro"
            className="px-8 py-3.5 rounded-xl font-semibold text-sm tracking-wide border border-amber-700/40 text-amber-300 bg-amber-950/30 hover:bg-amber-900/40 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Crear cuenta
          </Link>
        </div>

        {/* Stats decorativos */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-md w-full">
          {[
            { num: '200+', label: 'Diseños' },
            { num: '100%', label: 'Artesanal' },
            { num: '3D', label: 'Visualización' },
          ].map(({ num, label }) => (
            <div key={label} className="text-center">
              <div
                className="text-2xl font-black mb-1"
                style={{
                  background: 'linear-gradient(135deg, #F5DEB3, #D2A665)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {num}
              </div>
              <div className="text-xs text-amber-200/50 uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>
      </header>

      {/* Producto Destacado */}
      {productoDestacado && (
        <section className="w-full max-w-4xl px-6 text-center">
          <div className="mb-6">
            <span className="text-xs uppercase tracking-widest text-amber-500 font-semibold">— Destacado —</span>
            <h2 className="text-2xl font-bold text-amber-100 mt-2">{productoDestacado.nombre}</h2>
          </div>

          <div
            className="w-full rounded-2xl overflow-hidden border"
            style={{
              height: '420px',
              borderColor: 'rgba(160,82,45,0.35)',
              background: 'linear-gradient(145deg, #1c1208 0%, #2a1a0a 50%, #1a1008 100%)',
              boxShadow: '0 0 60px rgba(160,82,45,0.20), 0 20px 60px rgba(0,0,0,0.6)',
            }}
          >
            <Visor3D modeloUrl={productoDestacado.modelo_url} colorActual={color} />
          </div>

          <Link
            to={`/producto/${productoDestacado.id}`}
            className="inline-flex items-center gap-2 mt-5 text-amber-400 hover:text-amber-300 transition-colors font-medium text-sm"
          >
            Ver opciones de personalización
            <span className="text-base">→</span>
          </Link>
        </section>
      )}

      {/* Sección de características */}
      <section className="w-full max-w-5xl px-6 mt-24 grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { icon: '🪵', title: 'Madera Premium', desc: 'Selección de maderas nobles y tratadas para garantizar durabilidad y belleza.' },
          { icon: '🎨', title: 'Personalización Total', desc: 'Elige colores, acabados y dimensiones. Tu mueble, a tu medida.' },
          { icon: '📱', title: 'Vista en AR', desc: 'Visualiza cómo quedará el mueble en tu espacio antes de comprarlo.' },
        ].map(({ icon, title, desc }) => (
          <div
            key={title}
            className="rounded-2xl p-6 border transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(145deg, rgba(42,26,10,0.8), rgba(26,16,8,0.9))',
              borderColor: 'rgba(160,82,45,0.25)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
            }}
          >
            <div className="text-3xl mb-3">{icon}</div>
            <h3 className="font-bold text-amber-200 mb-2">{title}</h3>
            <p className="text-sm text-amber-200/50 leading-relaxed">{desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
};

/* ─── Componente NavLink ─── */
const NavLink = ({ to, children, accent = false }) => (
  <Link
    to={to}
    className={`relative px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 group
      ${accent
        ? 'border border-amber-600/60 text-amber-400 bg-amber-950/40 hover:bg-amber-900/50 hover:border-amber-500/80'
        : 'text-amber-100/80 hover:text-amber-100 hover:bg-white/5'
      }`}
  >
    {children}
    {!accent && (
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-0 group-hover:w-4/5 bg-amber-500/60 transition-all duration-300 rounded-full" />
    )}
  </Link>
);

/* ─── App principal ─── */
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
    <div
      className="App min-h-screen font-sans"
      style={{ color: '#F5E6C8' }}
    >
      {/* Fondo de madera */}
      <WoodBackground />

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#2a1a0a',
            color: '#F5E6C8',
            border: '1px solid rgba(160,82,45,0.4)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          },
        }}
      />

      {/* ── Navbar ── */}
      <nav
        className="sticky top-0 z-50 flex flex-wrap items-center gap-2 px-6 py-3"
        style={{
          background: 'linear-gradient(90deg, rgba(15,10,4,0.97) 0%, rgba(25,15,6,0.97) 50%, rgba(15,10,4,0.97) 100%)',
          borderBottom: '1px solid rgba(160,82,45,0.30)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 4px 32px rgba(0,0,0,0.6), 0 1px 0 rgba(210,166,101,0.08) inset',
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          className="mr-4 flex items-center gap-2 group"
        >
          <span
            className="text-xl font-black tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #F5DEB3 0%, #D2A665 50%, #A0522D 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            WoodLab
          </span>
          <span className="text-amber-700/50 text-xs font-light hidden sm:inline">|</span>
        </Link>

        {/* Separador decorativo izquierda */}
        <div className="flex-1 flex items-center gap-1">
          <NavLink to="/catalogo">Catálogo</NavLink>

          {/* Carrito */}
          <Link
            to="/carrito"
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-amber-950/50"
            style={{ color: '#D2A665' }}
          >
            🛒
            <span>Carrito</span>
            {totalItems > 0 && (
              <span
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold rounded-full px-1"
                style={{
                  background: 'linear-gradient(135deg, #D2A665, #A0522D)',
                  color: '#fff',
                  boxShadow: '0 2px 8px rgba(160,82,45,0.6)',
                }}
              >
                {totalItems}
              </span>
            )}
          </Link>

          {user && (
            <NavLink to="/mis-pedidos">📦 Mis Pedidos</NavLink>
          )}
        </div>

        {/* Zona derecha: usuario / auth */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {isAdmin && (
                <NavLink to="/admin/subir" accent>
                  ⚙ Admin
                </NavLink>
              )}

              {/* Avatar + nombre */}
              <div
                className="flex items-center gap-2 pl-3 border-l"
                style={{ borderColor: 'rgba(160,82,45,0.25)' }}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold uppercase"
                  style={{
                    background: 'linear-gradient(135deg, #D2A665, #8B4513)',
                    color: '#fff',
                    boxShadow: '0 2px 8px rgba(139,69,19,0.5)',
                  }}
                >
                  {user.email[0]}
                </div>
                <span className="text-xs text-amber-200/60 hidden sm:inline">
                  {user.email.split('@')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-xs px-2.5 py-1 rounded-lg border transition-all duration-200 hover:bg-red-950/40"
                  style={{
                    borderColor: 'rgba(239,68,68,0.35)',
                    color: '#f87171',
                  }}
                >
                  Salir
                </button>
              </div>
            </>
          ) : (
            <>
              <NavLink to="/registro">Registro</NavLink>
              <Link
                to="/login"
                className="px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #D2A665, #A0522D)',
                  color: '#fff',
                  boxShadow: '0 2px 12px rgba(160,82,45,0.40)',
                }}
              >
                Entrar
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ── Rutas ── */}
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

      {/* Footer mínimo */}
      <footer
        className="text-center py-8 text-xs mt-8"
        style={{
          borderTop: '1px solid rgba(160,82,45,0.15)',
          color: 'rgba(210,166,101,0.35)',
        }}
      >
        © {new Date().getFullYear()} WoodLab · Muebles artesanales con tecnología
      </footer>
    </div>
  );
}

export default App;