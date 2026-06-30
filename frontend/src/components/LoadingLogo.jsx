import logoIkm from '../assets/logo-ikm.png'

export default function LoadingLogo({ message = 'Memuat...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-5">
      <div className="relative flex items-center justify-center">
        {/* Glowing pulsing outer circle */}
        <div className="absolute h-20 w-20 rounded-full bg-[#8b0000]/15 animate-ping"></div>
        {/* Inner rotating/pulsing logo */}
        <img
          src={logoIkm}
          alt="Loading IKM ITERA"
          className="h-16 w-16 object-contain rounded-full shadow-md relative z-10 animate-pulse"
        />
      </div>
      <p className="text-xs font-bold tracking-widest text-[#8b0000] uppercase animate-pulse">
        {message}
      </p>
    </div>
  )
}
