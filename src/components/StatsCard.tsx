import { BookOpen, FileText, Layers, ClipboardList, FileCheck } from 'lucide-react';

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
      bgColor: 'bg-gradient-to-br from-lavender-100 to-lavender-200',
      iconBg: 'bg-lavender-500'
    },
    {
      label: 'Final Papers',
      value: finalCount,
      icon: FileCheck,
      bgColor: 'bg-gradient-to-br from-peach-100 to-peach-200',
      iconBg: 'bg-peach-400'
    },
    {
      label: 'Mid-Term Papers',
      value: midtermCount,
      icon: ClipboardList,
      bgColor: 'bg-gradient-to-br from-mint-100 to-mint-200',
      iconBg: 'bg-mint-400'
    },
    {
      label: 'Categories',
      value: totalCategories,
      icon: Layers,
      bgColor: 'bg-gradient-to-br from-sunny-100 to-sunny-200',
      iconBg: 'bg-sunny-400'
    },
    {
      label: 'Available Now',
      value: filteredCount,
      icon: BookOpen,
      bgColor: 'bg-gradient-to-br from-lavender-100 to-lavender-200',
      iconBg: 'bg-lavender-400'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8 animate-slide-up">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`${stat.bgColor} rounded-2xl p-5 shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1 animate-scale-in animate-delay-${index * 100}`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 ${stat.iconBg} rounded-xl flex items-center justify-center shadow-sm`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</p>
          <p className="text-xs text-gray-600 font-medium">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
