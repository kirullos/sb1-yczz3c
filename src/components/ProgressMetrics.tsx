import { CheckCircle2, Clock, Trophy, BookOpen, Loader2 } from 'lucide-react';
import { useProgress } from '../contexts/ProgressContext';

export default function ProgressMetrics() {
  const { moduleProgress, workoutCounter, totalTrainingTime, isLoading } = useProgress();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  const metrics = [
    {
      icon: BookOpen,
      value: moduleProgress,
      total: 3,
      label: 'Пройдених модулів',
      color: 'text-purple-500'
    },
    {
      icon: CheckCircle2,
      value: workoutCounter,
      total: 9,
      label: 'Тренувань виконано',
      color: 'text-indigo-500'
    },
    {
      icon: Clock,
      value: totalTrainingTime,
      unit: 'хв',
      label: 'Загальний час тренувань',
      color: 'text-violet-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-purple-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-purple-50 dark:bg-gray-700 ${metric.color}`}>
              <metric.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold dark:text-white">{metric.value}</span>
                {metric.total && <span className="text-gray-500 dark:text-gray-400">/ {metric.total}</span>}
                {metric.unit && <span className="text-gray-500 dark:text-gray-400">{metric.unit}</span>}
              </div>
              <p className="text-gray-600 dark:text-gray-300">{metric.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}