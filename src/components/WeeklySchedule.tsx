import { useState } from 'react';
import { Play, Clock, CheckCircle, Loader2 } from 'lucide-react';
import Roulette from './Roulette';
import QuoteDisplay from './QuoteDisplay';
import { useProgress } from '../contexts/ProgressContext';
import ProgressMetrics from './ProgressMetrics';

interface WorkoutDay {
  day: string;
  content: string | null;
  duration?: string;
  videoId?: string;
}

interface WeekProps {
  weekNumber: number;
  schedule: WorkoutDay[];
}

function Week({ weekNumber, schedule }: WeekProps) {
  const { completedWorkouts, toggleWorkout, isLoading } = useProgress();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {schedule.map((day, index) => {
        const workoutId = day.videoId ? `${weekNumber}-${day.videoId}` : null;
        const isCompleted = workoutId ? completedWorkouts.has(workoutId) : false;

        return (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-purple-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg dark:text-white">{day.day}</h3>
                {workoutId && (
                  <button
                    onClick={() => toggleWorkout(workoutId)}
                    className={`p-1 rounded-full transition-colors ${
                      isCompleted ? 'text-green-500 hover:text-green-600' : 'text-gray-300 hover:text-gray-400'
                    }`}
                  >
                    <CheckCircle className="w-6 h-6" />
                  </button>
                )}
              </div>
              {day.content ? (
                <div className="flex items-center gap-6">
                  <div className="relative group flex-shrink-0">
                    <div className="w-72 h-40 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                      {day.videoId && (
                        <img
                          src={`https://img.youtube.com/vi/${day.videoId}/maxresdefault.jpg`}
                          alt="Workout thumbnail"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    {day.videoId && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-lg">
                        <a 
                          href={`https://youtu.be/${day.videoId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
                        >
                          <Play className="w-5 h-5" />
                          Почати
                        </a>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-lg dark:text-white">{day.content}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-2">
                      <Clock className="w-4 h-4" />
                      <span>{day.duration}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">День Відпочинку</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function WeeklySchedule() {
  const [activeWeek, setActiveWeek] = useState(1);

  const weeks = [
    {
      number: 1,
      schedule: [
        { day: 'Понеділок', content: 'HIIT + ТАБАТА Тренування', duration: '35 хв', videoId: 'EOTEkuH4gH4' },
        { day: 'Вівторок', content: null },
        { day: 'Середа', content: 'Танцювальне Кардіо', duration: '40 хв', videoId: 'kM6Pktdj1G8' },
        { day: 'Четвер', content: null },
        { day: 'П\'ятниця', content: 'Силове Тренування', duration: '35 хв', videoId: 'T_S6hYGhGZk' },
        { day: 'Субота', content: null },
        { day: 'Неділя', content: null },
      ]
    },
    {
      number: 2,
      schedule: [
        { day: 'Понеділок', content: 'HIIT Тренування', duration: '40 хв', videoId: 'PfGJmCHYnhQ' },
        { day: 'Вівторок', content: null },
        { day: 'Середа', content: 'Кардіо + Силове', duration: '35 хв', videoId: 'XIWbejvRRqE' },
        { day: 'Четвер', content: null },
        { day: 'П\'ятниця', content: 'ТАБАТА Інтенсив', duration: '40 хв', videoId: 'ygqmDDBLbW4' },
        { day: 'Субота', content: null },
        { day: 'Неділя', content: null },
      ]
    },
    {
      number: 3,
      schedule: [
        { day: 'Понеділок', content: 'Силове + HIIT', duration: '40 хв', videoId: '0sVJUdkAIuo' },
        { day: 'Вівторок', content: null },
        { day: 'Середа', content: 'Танцювальне HIIT', duration: '35 хв', videoId: 'hwaGIJVghm4' },
        { day: 'Четвер', content: null },
        { day: 'П\'ятниця', content: 'Фінальне Тренування', duration: '40 хв', videoId: 'HX7aLckrGiY' },
        { day: 'Субота', content: null },
        { day: 'Неділя', content: null },
      ]
    }
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center dark:text-white font-serif">Розклад Тренувань</h2>
        
        <ProgressMetrics />
        
        <div className="flex gap-3 mb-12 overflow-x-auto pb-2">
          {weeks.map((week) => (
            <button
              key={week.number}
              onClick={() => setActiveWeek(week.number)}
              className={`px-8 py-3 rounded-xl font-medium transition-all transform hover:scale-105 ${
                activeWeek === week.number
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Тиждень {week.number}
            </button>
          ))}
        </div>

        <Week
          weekNumber={activeWeek}
          schedule={weeks[activeWeek - 1].schedule}
        />

        <div className="mt-20">
          <QuoteDisplay />
          <Roulette />
        </div>
      </div>
    </section>
  );
}