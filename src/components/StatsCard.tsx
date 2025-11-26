import { BookOpen, FileText, Layers } from 'lucide-react';

interface StatsCardProps {
  totalPapers: number;
  totalCategories: number;
  filteredCount: number;
}

export default function StatsCard({ totalPapers, totalCategories, filteredCount }: StatsCardProps) {
  const stats = [
    {
      label: 'Total Papers',
      value: totalPapers,
      icon: FileText,
      color: 'lavender',
      bgColor: 'bg-gradient-to-br from-lavender-100 to-lavender-200',
      iconBg: 'bg-lavender-500'
    },
    {
      label: 'Categories',
      value: totalCategories,
      icon: Layers,
      color: 'mint',
      bgColor: 'bg-gradient-to-br from-mint-100 to-mint-200',
      iconBg: 'bg-mint-400'
    },
    {
      label: 'Available Now',
      value: filteredCount,
      icon: BookOpen,
      color: 'sunny',
      bgColor: 'bg-gradient-to-br from-sunny-100 to-sunny-200',
      iconBg: 'bg-sunny-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 animate-slide-up">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`${stat.bgColor} rounded-2xl p-5 shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1 animate-scale-in animate-delay-${index * 100}`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-12 h-12 ${stat.iconBg} rounded-xl flex items-center justify-center shadow-sm`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</p>
          <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
