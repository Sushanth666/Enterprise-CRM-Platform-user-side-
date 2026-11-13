import React, { useState } from 'react';

// Curated high-resolution professional portrait photos
export const getPortraitPhoto = (name: string, customAvatar?: string): string => {
  if (customAvatar && customAvatar.trim()) return customAvatar;
  const n = (name || '').toLowerCase();
  if (n.includes('sarah')) {
    return 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&auto=format&fit=crop&q=80';
  }
  if (n.includes('priya')) {
    return 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&auto=format&fit=crop&q=80';
  }
  if (n.includes('aarav') || n.includes('alex')) {
    return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80';
  }
  if (n.includes('rajesh') || n.includes('david')) {
    return 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&auto=format&fit=crop&q=80';
  }
  if (n.includes('ananya')) {
    return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80';
  }
  // Deterministic fallback photo
  const defaults = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&auto=format&fit=crop&q=80',
  ];
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return defaults[Math.abs(hash) % defaults.length];
};

export interface AvatarProps {
  src?: string;
  hoverSrc?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  status?: 'online' | 'busy' | 'away' | 'offline';
  showHoverPhoto?: boolean;
  isHovered?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  hoverSrc,
  name,
  size = 'md',
  className = '',
  status,
  showHoverPhoto = false,
  isHovered: externalHovered,
}) => {
  const [imageError, setImageError] = useState(false);
  const [hoverImageError, setHoverImageError] = useState(false);
  const [internalHover, setInternalHover] = useState(false);

  // Return the first letter of the user's name
  const getFirstLetter = (text: string) => {
    if (!text || !text.trim()) return '?';
    return text.trim().charAt(0).toUpperCase();
  };

  const isHoverActive = showHoverPhoto && (externalHovered !== undefined ? externalHovered : internalHover);
  const portraitUrl = getPortraitPhoto(name, hoverSrc || src);

  const sizeClasses = {
    xs: 'w-6 h-6 text-xs font-semibold',
    sm: 'w-8 h-8 text-sm font-bold',
    md: 'w-10 h-10 text-base font-bold',
    lg: 'w-12 h-12 text-lg font-bold',
    xl: 'w-16 h-16 text-2xl font-black',
    '2xl': 'w-20 h-20 text-3xl font-black',
  };

  const statusColors = {
    online: 'bg-emerald-500 ring-[#140e0c]',
    busy: 'bg-rose-500 ring-[#140e0c]',
    away: 'bg-amber-500 ring-[#140e0c]',
    offline: 'bg-slate-400 ring-[#140e0c]',
  };

  // Deterministic vibrant modern gradient background based on name
  const getBackgroundColor = (str: string) => {
    const gradients = [
      'bg-gradient-to-tr from-[#ca5e3a] to-[#e08a68] text-white',
      'bg-gradient-to-tr from-amber-600 to-orange-500 text-white',
      'bg-gradient-to-tr from-rose-600 to-pink-500 text-white',
      'bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white',
      'bg-gradient-to-tr from-blue-600 to-sky-500 text-white',
      'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white',
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return gradients[Math.abs(hash) % gradients.length];
  };

  return (
    <div
      className={`relative inline-flex shrink-0 transition-transform duration-200 ${
        isHoverActive ? 'scale-105' : ''
      } ${className}`}
      onMouseEnter={() => setInternalHover(true)}
      onMouseLeave={() => setInternalHover(false)}
    >
      {/* 1. If explicit valid image is provided */}
      {src && !imageError ? (
        <img
          src={src}
          alt={name}
          onError={() => setImageError(true)}
          className={`rounded-full object-cover ${sizeClasses[size]} border border-[#ca5e3a]/30 shadow-2xs transition-all duration-300`}
        />
      ) : isHoverActive && !hoverImageError ? (
        /* 2. When hovering and showHoverPhoto is enabled, smoothly reveal portrait image */
        <img
          src={portraitUrl}
          alt={name}
          onError={() => setHoverImageError(true)}
          className={`rounded-full object-cover ${sizeClasses[size]} border-2 border-[#ca5e3a] shadow-lg animate-in fade-in zoom-in-95 duration-200`}
        />
      ) : (
        /* 3. Default state: Vibrant initial letter */
        <div
          className={`rounded-full flex items-center justify-center shadow-2xs select-none transition-all duration-300 ${
            sizeClasses[size]
          } ${getBackgroundColor(name)}`}
        >
          {getFirstLetter(name)}
        </div>
      )}

      {status && (
        <span
          className={`absolute bottom-0 right-0 block w-2.5 h-2.5 rounded-full ring-2 ${statusColors[status]} transition-transform duration-200 ${
            isHoverActive ? 'scale-110' : ''
          }`}
        />
      )}
    </div>
  );
};
