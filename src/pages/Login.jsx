import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // <--- IMPORTACIÓN

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { clearCart } = useCart(); // <--- TRAER FUNCIÓN

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Error: " + error.message);
    } else {
      // LIMPIEZA PREVENTIVA
      clearCart(); 
      alert("¡Bienvenido a WoodLab!");
      navigate('/'); 
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4">
      <form onSubmit={handleLogin} className="bg-[#222] p-8 rounded-lg shadow-xl w-full max-w-md border border-[#333]">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Iniciar Sesión</h2>
        
        <div className="space-y-4">
          <input 
            type="email" 
            placeholder="Correo Electrónico" 
            className="w-full p-3 bg-[#333] border border-[#444] rounded text-white focus:border-[#D2B48C] outline-none"
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            className="w-full p-3 bg-[#333] border border-[#444] rounded text-white focus:border-[#D2B48C] outline-none"
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full mt-6 bg-[#D2B48C] text-black font-bold py-3 rounded hover:bg-[#b89b74] transition-colors disabled:bg-gray-600"
        >
          {loading ? 'Cargando...' : 'Entrar'}
        </button>

        <div className="mt-6 text-center text-sm border-t border-[#333] pt-4">
          <Link to="/registro" className="text-gray-400 hover:text-white transition-colors">¿No tienes cuenta? Regístrate aquí</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;