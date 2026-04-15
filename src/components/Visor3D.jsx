import { useEffect, useRef } from 'react';

function Visor3D({ modeloUrl, colorActual }) {
  const modelRef = useRef();

  useEffect(() => {
    const applyColor = () => {
      const modelViewer = modelRef.current;
      // Verificamos que el modelo y sus materiales estén listos
      if (!modelViewer || !modelViewer.model || !modelViewer.model.materials) return;

      const materials = modelViewer.model.materials;
      
      materials.forEach((material) => {
        // Model-viewer espera el color en formato array [r, g, b, a] o string
        // Convertimos el hex (#D2B48C) a algo que el material entienda perfectamente
        material.pbrMetallicRoughness.setBaseColorFactor(colorActual);
      });
    };

    // Aplicar inmediatamente si el modelo ya cargó
    applyColor();

    // Y también escuchar por si el modelo termina de cargar después
    if (modelRef.current) {
      modelRef.current.addEventListener('load', applyColor);
    }

    return () => {
      if (modelRef.current) {
        modelRef.current.removeEventListener('load', applyColor);
      }
    };
  }, [colorActual, modeloUrl]); // Se dispara cada vez que cambias el color en los botones

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <model-viewer
        ref={modelRef}
        src={modeloUrl}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate
        shadow-intensity="2"
        shadow-softness="1"
        environment-image="neutral"
        exposure="1.2"
        style={{ width: '100%', height: '100%', backgroundColor: '#1a1a1a' }}
        alt="Visor WoodLab"
      >
        <button 
          slot="ar-button" 
          style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            backgroundColor: '#D2B48C',
            border: 'none',
            borderRadius: '10px',
            padding: '12px 24px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 5px 20px rgba(0,0,0,0.5)',
            zIndex: 10
          }}
        >
          🏠 VER EN MI CASA (AR)
        </button>

        <div slot="poster" style={{ display: 'flex', alignItems: 'center', justifyCenter: 'center', height: '100%', color: '#666' }}>
          <p className="animate-pulse">Preparando madera...</p>
        </div>
      </model-viewer>
    </div>
  );
}

export default Visor3D;