const SkeletonCard = () => {
  return (
    <div className="bg-[#222] rounded-2xl overflow-hidden border border-[#333] shadow-lg animate-pulse">
      {/* Espacio de la imagen */}
      <div className="w-full h-64 bg-[#333]"></div>
      
      {/* Espacio del texto */}
      <div className="p-6 space-y-4">
        <div className="h-6 bg-[#333] rounded w-3/4"></div>
        <div className="h-4 bg-[#333] rounded w-full"></div>
        <div className="h-4 bg-[#333] rounded w-5/6"></div>
        
        <div className="flex justify-between items-center pt-4 border-t border-[#333]">
          <div className="h-8 bg-[#333] rounded w-1/3"></div>
          <div className="h-4 bg-[#333] rounded w-1/4"></div>
        </div>
        
        <div className="h-12 bg-[#333] rounded-lg w-full mt-4"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;