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

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10 animate-slide-up">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`${stat.bgColor} rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 ${stat.borderColor} animate-scale-in animate-delay-${index * 100}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${stat.iconBg} rounded-xl flex items-center justify-center shadow-lg`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1.5">{stat.value}</p>
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
