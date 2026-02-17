// components/kitchen-logo.tsx
import Link from "next/link"

interface KitchenLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  href?: string;
}

export function KitchenLogo({ 
  className = "", 
  size = 'md', 
  showText = true,
  href = "/"
}: KitchenLogoProps) {
  
  // Size mappings for scalability across the app
  const sizeClasses = {
    sm: 'w-6 h-6 border-[1.5px]',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-2',
    xl: 'w-16 h-16 border-[3px]'
  }
  
  const iconSizes = {
    sm: 'w-3.5 h-3.5 stroke-[2px]',
    md: 'w-4 h-4 stroke-[2px]',
    lg: 'w-6 h-6 stroke-[2px]',
    xl: 'w-8 h-8 stroke-[2px]'
  }
  
  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-4xl'
  }

  const LogoContent = (
    <div className={`flex items-center gap-3 hover:opacity-80 transition-opacity ${className}`}>
      {/* The Minimalist Tilted Box */}
      <div className={`flex items-center justify-center border-slate-900 dark:border-white rounded-none bg-transparent transform rotate-45 transition-transform hover:rotate-90 duration-500 ${sizeClasses[size]}`}>
        {/* The Knife Icon (counter-rotated so it stands straight) */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className={`text-slate-900 dark:text-white transform -rotate-45 ${iconSizes[size]}`}
        >
          <path d="m2 21 7.17-7.17a4.65 4.65 0 0 1 2.38-1.09l7.04-1.05a2.53 2.53 0 0 0 2.11-2.11l1.05-7.04a4.65 4.65 0 0 1 1.09-2.38l-7.17 7.17"/>
          <path d="m11.3 16.3-4.6 4.6"/>
          <path d="m16.3 11.3-4.6 4.6"/>
        </svg>
      </div>

      {/* The Text */}
      {showText && (
        <span className={`font-light tracking-[0.1em] uppercase text-slate-900 dark:text-white ${textSizes[size]}`}>
          Kernel<span className="font-black">cook</span>
        </span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="inline-block focus:outline-none">
        {LogoContent}
      </Link>
    )
  }

  return LogoContent
}