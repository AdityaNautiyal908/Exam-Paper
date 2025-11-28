import { BookOpen, FileText, Layers, ClipboardList, FileCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface StatsCardProps {
  totalPapers: number;
  totalCategories: number;
  filteredCount: number;
  finalCount: number;
  midtermCount: number;
}

export default function StatsCard({ totalPapers, totalCategories, filteredCount, finalCount, midtermCount }: StatsCardProps) {
  const stats = [
    {
      label: 'Total Papers',
      value: totalPapers,
      icon: FileText,
      bgColor: 'bg-gradient-to-br from-indigo-50 to-indigo-100',
      iconBg: 'bg-indigo-600',
      borderColor: 'border-indigo-200'
    },
    {
      label: 'Final Papers',
      value: finalCount,
      icon: FileCheck,
      bgColor: 'bg-gradient-to-br from-rose-50 to-rose-100',
      iconBg: 'bg-rose-600',
      borderColor: 'border-rose-200'
    },
    {
      label: 'Mid-Term Papers',
      value: midtermCount,
      icon: ClipboardList,
      bgColor: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
      iconBg: 'bg-emerald-600',
      borderColor: 'border-emerald-200'
    },
    {
      label: 'Categories',
      value: totalCategories,
      icon: Layers,
      bgColor: 'bg-gradient-to-br from-amber-50 to-amber-100',
      iconBg: 'bg-amber-600',
      borderColor: 'border-amber-200'
    },
    {
      label: 'Available Now',
      value: filteredCount,
      icon: BookOpen,
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
      iconBg: 'bg-purple-600',
      borderColor: 'border-purple-200'
    }
  ];

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x, y },
      colors: ['#4F46E5', '#E11D48', '#059669', '#D97706', '#7C3AED'],
      disableForReducedMotion: true,
      zIndex: 9999,
    });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10"
    >
      {stats.map((stat) => (
        <motion.div
          key={stat.label}
          variants={item}
          whileHover={{ 
            scale: 1.05,
            y: -5,
            transition: { type: "spring", stiffness: 300 }
          }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCardClick}
          className={`${stat.bgColor} rounded-xl p-5 shadow-md hover:shadow-xl transition-colors duration-300 border-2 ${stat.borderColor} cursor-pointer relative overflow-hidden group`}
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${stat.iconBg} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
          <motion.p 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl font-bold text-gray-900 mb-1.5"
          >
            {stat.value}
          </motion.p>
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{stat.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
