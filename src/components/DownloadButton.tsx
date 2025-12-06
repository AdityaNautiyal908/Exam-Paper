import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface DownloadButtonProps {
  onClick?: (e: React.MouseEvent) => void;
  href?: string;
  download?: boolean | string;
  className?: string;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'w-10 h-10',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
};

const DownloadButton: React.FC<DownloadButtonProps> = ({
  onClick,
  href,
  download,
  className = '',
  title = 'Download',
  size = 'sm',
}) => {
  const sizeClass = sizeMap[size];
  const baseClass = `${sizeClass} flex items-center justify-center transition-all hover:scale-110 ${className}`;

  const content = (
    <div className={`${sizeClass} relative overflow-hidden rounded-xl`}>
      <div className="absolute inset-0 bg-white opacity-20"></div>
      <DotLottieReact
        src="https://lottie.host/a96bf700-12b7-48e6-8234-01699667e118/tCeh1QTY7j.lottie"
        loop
        autoplay
        style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }}
      />
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        download={download}
        onClick={onClick}
        className={baseClass}
        title={title}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={baseClass}
      title={title}
    >
      {content}
    </button>
  );
};

export default DownloadButton;
