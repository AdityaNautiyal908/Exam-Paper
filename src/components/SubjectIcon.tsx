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
  Icon: IconType | null;
  bgClass: string;
  textClass: string;
  customImage?: string;
};

const iconConfig: Record<SubjectIconKey | 'default', IconConfig> = {
  c: {
    Icon: SiC,
    bgClass: 'bg-blue-50 border-blue-100',
    textClass: 'text-blue-600',
  },
  c_lang: {
    Icon: null as any,
    bgClass: 'bg-blue-50 border-blue-100',
    textClass: 'text-blue-600',
    customImage: '/logos/C.png',
  },
  cpp: {
    Icon: null as any,
    bgClass: 'bg-blue-50 border-blue-100',
    textClass: 'text-blue-600',
    customImage: '/logos/c++.png',
  },
  java: {
    Icon: FaJava,
    bgClass: 'bg-orange-50 border-orange-100',
    textClass: 'text-orange-500',
  },
  java_lang: {
    Icon: null as any,
    bgClass: 'bg-orange-50 border-orange-100',
    textClass: 'text-orange-500',
    customImage: '/logos/java.png',
  },
  python: {
    Icon: SiPython,
    bgClass: 'bg-yellow-50 border-yellow-100',
    textClass: 'text-yellow-500',
  },
  python_lang: {
    Icon: null as any,
    bgClass: 'bg-yellow-50 border-yellow-100',
    textClass: 'text-yellow-500',
    customImage: '/logos/python.png',
  },
  cloud: {
    Icon: SiGooglecloud,
    bgClass: 'bg-cyan-50 border-cyan-100',
    textClass: 'text-cyan-500',
  },
  cloud_custom: {
    Icon: null as any,
    bgClass: 'bg-cyan-50 border-cyan-100',
    textClass: 'text-cyan-500',
    customImage: '/logos/cloud.png',
  },
  analytics: {
    Icon: SiGoogleanalytics,
    bgClass: 'bg-emerald-50 border-emerald-100',
    textClass: 'text-emerald-500',
  },
  cbot: {
    Icon: null as any,
    bgClass: 'bg-emerald-50 border-emerald-100',
    textClass: 'text-emerald-500',
    customImage: '/logos/cbot.png',
  },
  database: {
    Icon: SiMysql,
    bgClass: 'bg-indigo-50 border-indigo-100',
    textClass: 'text-indigo-600',
  },
  sql: {
    Icon: null as any,
    bgClass: 'bg-indigo-50 border-indigo-100',
    textClass: 'text-indigo-600',
    customImage: '/logos/sql.png',
  },
  web: {
    Icon: SiHtml5,
    bgClass: 'bg-rose-50 border-rose-100',
    textClass: 'text-rose-500',
  },
  web_dev: {
    Icon: null as any,
    bgClass: 'bg-rose-50 border-rose-100',
    textClass: 'text-rose-500',
    customImage: '/logos/web.png',
  },
  dotnet: {
    Icon: null as any,
    bgClass: 'bg-purple-50 border-purple-100',
    textClass: 'text-purple-500',
    customImage: '/logos/net.png',
  },
  graphics: {
    Icon: SiAdobexd,
    bgClass: 'bg-pink-50 border-pink-100',
    textClass: 'text-pink-500',
  },
  graphics_custom: {
    Icon: null as any,
    bgClass: 'bg-pink-50 border-pink-100',
    textClass: 'text-pink-500',
    customImage: '/logos/computer graphics.png',
  },
  computer: {
    Icon: MdOutlineComputer,
    bgClass: 'bg-slate-50 border-slate-100',
    textClass: 'text-slate-600',
  },
  fco_custom: {
    Icon: null as any,
    bgClass: 'bg-slate-50 border-slate-100',
    textClass: 'text-slate-600',
    customImage: '/logos/fundamental of computer.png',
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
  cyber_security: {
    Icon: null as any,
    bgClass: 'bg-red-50 border-red-100',
    textClass: 'text-red-600',
    customImage: '/logos/cyber security.png',
  },
  maths: {
    Icon: null as any,
    bgClass: 'bg-green-50 border-green-100',
    textClass: 'text-green-600',
    customImage: '/logos/maths.png',
  },
  computer_fundamental: {
    Icon: null as any,
    bgClass: 'bg-blue-50 border-blue-100',
    textClass: 'text-blue-600',
    customImage: '/logos/computer fundamental.png',
  },
  software_engineering: {
    Icon: null as any,
    bgClass: 'bg-purple-50 border-purple-100',
    textClass: 'text-purple-600',
    customImage: '/logos/software engineering.png',
  },
  english_communication: {
    Icon: null as any,
    bgClass: 'bg-pink-50 border-pink-100',
    textClass: 'text-pink-600',
    customImage: '/logos/english communication.png',
  },
  environment: {
    Icon: null as any,
    bgClass: 'bg-green-50 border-green-100',
    textClass: 'text-green-600',
    customImage: '/logos/environment.png',
  },
  ai: {
    Icon: null as any,
    bgClass: 'bg-purple-50 border-purple-100',
    textClass: 'text-purple-600',
    customImage: '/logos/AI.png',
  },
  network: {
    Icon: null as any,
    bgClass: 'bg-cyan-50 border-cyan-100',
    textClass: 'text-cyan-600',
    customImage: '/logos/network.png',
  },
  linux: {
    Icon: null as any,
    bgClass: 'bg-yellow-50 border-yellow-100',
    textClass: 'text-yellow-600',
    customImage: '/logos/linux.png',
  },
  iot: {
    Icon: null as any,
    bgClass: 'bg-teal-50 border-teal-100',
    textClass: 'text-teal-600',
    customImage: '/logos/IOT.png',
  },
  theory_computation: {
    Icon: null as any,
    bgClass: 'bg-amber-50 border-amber-100',
    textClass: 'text-amber-600',
    customImage: '/logos/Theory of Computation.png',
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
  const config = iconConfig[iconKey] ?? iconConfig.default;
  const { Icon, bgClass, textClass, customImage } = config;
  const sizeClass = sizeStyles[size];

  return (
    <div
      className={`${sizeClass.container} flex items-center justify-center shadow-sm border ${bgClass} group-hover:scale-110 transition-transform duration-300 ${className}`}
    >
      {customImage ? (
        <img 
          src={customImage} 
          alt={iconKey}
          className={`${sizeClass.icon} object-contain`}
        />
      ) : Icon ? (
        <Icon className={`${sizeClass.icon} ${textClass}`} />
      ) : null}
    </div>
  );
}

