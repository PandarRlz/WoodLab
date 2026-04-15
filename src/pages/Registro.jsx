import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const Registro = () => {
  const [loading, setLoading] = useState(false);
  // Estados para los campos que definiste en tu plan de proyecto
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombreCompleto: '',
    rut: '',
    telefono: '',
    direccion: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Registrar usuario en Supabase Auth
    const { data, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (authError) {
      alert("Error al registrar: " + authError.message);
    } else {
      // 2. Insertar datos adicionales en tu tabla 'perfiles'
      const { error: profileError } = await supabase.from('perfiles').insert([
        {
          id: data.user.id, // Vinculamos con el ID de Auth
          nombre_completo: formData.nombreCompleto,
          rut: formData.rut,
          telefono: formData.telefono,
          direccion_envio: formData.direccion
        }
      ]);

      if (profileError) {
        alert("Error al crear perfil: " + profileError.message);
      } else {
        alert("¡Registro exitoso! Revisa tu email para confirmar.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4">
      <form onSubmit={handleRegistro} className="bg-[#222] p-8 rounded-lg shadow-xl w-full max-w-md border border-[#333]">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Registro WoodLab</h2>
        
        <div className="space-y-4">
          <input name="nombreCompleto" type="text" placeholder="Nombre Completo" required onChange={handleChange}
            className="w-full p-2 bg-[#333] border border-[#444] rounded text-white" />
          
          <input name="rut" type="text" placeholder="RUT (ej: 12.345.678-9)" required onChange={handleChange}
            className="w-full p-2 bg-[#333] border border-[#444] rounded text-white" />
          
          <input name="email" type="email" placeholder="Correo Electrónico" required onChange={handleChange}
            className="w-full p-2 bg-[#333] border border-[#444] rounded text-white" />
          
          <input name="password" type="password" placeholder="Contraseña" required onChange={handleChange}
            className="w-full p-2 bg-[#333] border border-[#444] rounded text-white" />
          
          <input name="telefono" type="text" placeholder="Teléfono" onChange={handleChange}
            className="w-full p-2 bg-[#333] border border-[#444] rounded text-white" />
          
          <textarea name="direccion" placeholder="Dirección de Envío" onChange={handleChange}
            className="w-full p-2 bg-[#333] border border-[#444] rounded text-white h-20" />
        </div>

        <button type="submit" disabled={loading}
          className="w-full mt-6 bg-[#D2B48C] text-black font-bold py-2 rounded hover:bg-[#8B4513] transition-colors">
          {loading ? 'Registrando...' : 'Crear Cuenta'}
        </button>
      </form>
    </div>
  );
};

export default Registro;