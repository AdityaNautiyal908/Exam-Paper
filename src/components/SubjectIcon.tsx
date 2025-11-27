import { IconType } from 'react-icons';
import {
  SiC,
  SiPython,
  SiGooglecloud,
  SiGoogleanalytics,
  SiMysql,
  SiHtml5,
  SiAdobexd,
  SiBookstack,
} from 'react-icons/si';
import { MdOutlineComputer, MdSecurity } from 'react-icons/md';
import { PiLaptopBold } from 'react-icons/pi';
import { FaJava } from 'react-icons/fa';
import { SubjectIconKey } from '../types';

type IconConfig = {
  Icon: IconType;
  bgClass: string;
  textClass: string;
};

const iconConfig: Record<SubjectIconKey | 'default', IconConfig> = {
  c: {
    Icon: SiC,
    bgClass: 'bg-blue-50 border-blue-100',
    textClass: 'text-blue-600',
  },
  java: {
    Icon: FaJava,
    bgClass: 'bg-orange-50 border-orange-100',
    textClass: 'text-orange-500',
  },
  python: {
    Icon: SiPython,
    bgClass: 'bg-yellow-50 border-yellow-100',
    textClass: 'text-yellow-500',
  },
  cloud: {
    Icon: SiGooglecloud,
    bgClass: 'bg-cyan-50 border-cyan-100',
    textClass: 'text-cyan-500',
  },
  analytics: {
    Icon: SiGoogleanalytics,
    bgClass: 'bg-emerald-50 border-emerald-100',
    textClass: 'text-emerald-500',
  },
  database: {
    Icon: SiMysql,
    bgClass: 'bg-indigo-50 border-indigo-100',
    textClass: 'text-indigo-600',
  },
  web: {
    Icon: SiHtml5,
    bgClass: 'bg-rose-50 border-rose-100',
    textClass: 'text-rose-500',
  },
  graphics: {
    Icon: SiAdobexd,
    bgClass: 'bg-pink-50 border-pink-100',
    textClass: 'text-pink-500',
  },
  computer: {
    Icon: MdOutlineComputer,
    bgClass: 'bg-slate-50 border-slate-100',
    textClass: 'text-slate-600',
  },
  communication: {
    Icon: SiBookstack,
    bgClass: 'bg-purple-50 border-purple-100',
    textClass: 'text-purple-500',
  },
  security: {
    Icon: MdSecurity,
    bgClass: 'bg-red-50 border-red-100',
    textClass: 'text-red-600',
  },
  default: {
    Icon: PiLaptopBold,
    bgClass: 'bg-white/70 border-white/50',
    textClass: 'text-gray-600',
  },
};

const sizeStyles = {
  lg: {
    container: 'w-14 h-14 rounded-2xl',
    icon: 'w-7 h-7',
  },
  md: {
    container: 'w-10 h-10 rounded-xl',
    icon: 'w-6 h-6',
  },
};

interface SubjectIconProps {
  iconKey: SubjectIconKey;
  size?: keyof typeof sizeStyles;
  className?: string;
}

export default function SubjectIcon({ iconKey, size = 'lg', className = '' }: SubjectIconProps) {
  const { Icon, bgClass, textClass } = iconConfig[iconKey] ?? iconConfig.default;
  const sizeClass = sizeStyles[size];

  return (
    <div
      className={`${sizeClass.container} flex items-center justify-center shadow-sm border ${bgClass} group-hover:scale-110 transition-transform duration-300 ${className}`}
    >
      <Icon className={`${sizeClass.icon} ${textClass}`} />
    </div>
  );
}

