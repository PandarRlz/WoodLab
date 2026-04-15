import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data } = await supabase
          .from('perfiles')
          .select('rol')
          .eq('id', user.id)
          .single();
        
        if (data?.rol === 'admin') setIsAdmin(true);
      }
      setLoading(false);
    };
    checkRole();
  }, []);

  if (loading) return <p className="text-white text-center mt-10">Verificando permisos...</p>;
  
  // Si no es admin, lo mandamos al inicio
  return isAdmin ? children : <Navigate to="/" />;
};

export default ProtectedRoute;