import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface StatsCardProps {
  totalPapers: number;
  totalCategories: number;
  filteredCount: number;
  finalCount: number;
  midtermCount: number;
}

export default function StatsCard({ totalPapers, filteredCount, finalCount, midtermCount }: StatsCardProps) {
  const totalPapersStat = {
    label: 'TOTAL PAPERS',
    value: totalPapers,
    iconImage: '/logos/Total.png',
    bgColor: 'bg-gradient-to-br from-cyan-100 to-cyan-200',
    iconBg: 'bg-cyan-600',
    borderColor: 'border-cyan-300'
  };

  const otherStats = [
    {
      label: 'FINAL PAPERS',
      value: finalCount,
      iconImage: '/logos/Final.png',
      bgColor: 'bg-gradient-to-br from-rose-100 to-rose-200',
      iconBg: 'bg-rose-600',
      borderColor: 'border-rose-300'
    },
    {
      label: 'MID-TERM PAPERS',
      value: midtermCount,
      iconImage: '/logos/mid.png',
      bgColor: 'bg-gradient-to-br from-amber-100 to-amber-200',
      iconBg: 'bg-amber-600',
      borderColor: 'border-amber-300'
    },
    {
      label: 'AVAILABLE NOW',
      value: filteredCount,
      iconImage: '/logos/available.png',
      bgColor: 'bg-gradient-to-br from-emerald-100 to-emerald-200',
      iconBg: 'bg-emerald-600',
      borderColor: 'border-emerald-300'
    },
    {
      label: 'SEMESTERS',
      value: 6,
      iconImage: '/logos/college.png',
      bgColor: 'bg-gradient-to-br from-blue-100 to-blue-200',
      iconBg: 'bg-blue-600',
      borderColor: 'border-blue-300'
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

  const StatCard = ({ stat, shouldAnimate = false }: { stat: any; shouldAnimate?: boolean }) => (
    <motion.div
      key={shouldAnimate ? stat.value : undefined}
      variants={shouldAnimate ? item : undefined}
      initial={shouldAnimate ? "hidden" : false}
      animate={shouldAnimate ? "show" : false}
      whileHover={{ 
        scale: 1.05,
        y: -5,
        transition: { type: "spring", stiffness: 300, damping: 15 }
      }}
      whileTap={{ 
        scale: 0.95,
        scaleY: 0.92,
        transition: { duration: 0.1 }
      }}
      onClick={handleCardClick}
      className={`${stat.bgColor} rounded-2xl p-5 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${stat.borderColor} cursor-pointer relative overflow-hidden group`}
    >
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className={`w-12 h-12 md:w-14 md:h-14 ${stat.iconBg} rounded-2xl flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
          {stat.iconImage ? (
            <img 
              src={stat.iconImage} 
              alt={stat.label}
              className="w-6 h-6 md:w-7 md:h-7 object-contain"
            />
          ) : (
            <stat.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
          )}
        </div>
        
        <motion.p 
          key={shouldAnimate ? `value-${stat.value}` : undefined}
          initial={shouldAnimate ? { opacity: 0, scale: 0.5 } : false}
          animate={shouldAnimate ? { opacity: 1, scale: 1 } : false}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-2"
        >
          {stat.value}
        </motion.p>
        
        <p className="text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wide">
          {stat.label}
        </p>
      </div>
    </motion.div>
  );

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="mb-8"
    >
      {/* Mobile Layout: Total Papers full width, others in 2-column grid */}
      <div className="lg:hidden space-y-4">
        <StatCard stat={totalPapersStat} />
        <div className="grid grid-cols-2 gap-4">
          {otherStats.map((stat) => (
            <StatCard 
              key={stat.label} 
              stat={stat} 
              shouldAnimate={stat.label === 'AVAILABLE NOW'}
            />
          ))}
        </div>
      </div>

      {/* Desktop Layout: All cards in single row */}
      <div className="hidden lg:grid lg:grid-cols-5 gap-4">
        <StatCard stat={totalPapersStat} />
        {otherStats.map((stat) => (
          <StatCard 
            key={stat.label} 
            stat={stat} 
            shouldAnimate={stat.label === 'AVAILABLE NOW'}
          />
        ))}
      </div>
    </motion.div>
  );
}
