import { Flame, Dumbbell, Calendar, Target } from 'lucide-react';

export default function Overview() {
  return (
    <section className="py-20 bg-white dark:bg-gray-800 transition-colors">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-16 text-center dark:text-white font-serif">Про Програму</h2>
        
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 p-8 rounded-2xl shadow-lg">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 dark:text-white">
                <Target className="w-6 h-6 text-purple-500" />
                Мета комплексу
              </h3>
              <ul className="space-y-3 text-lg dark:text-gray-200">
                <li>• Жироспалювання</li>
                <li>• Тонус м'язів</li>
                <li>• Тренування серцево-судинної системи</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 p-8 rounded-2xl shadow-lg">
            <p className="text-lg leading-relaxed dark:text-gray-200">
              Навантаження тренувань буде плавно збільшуватися з кожним заняттям. 
              Для виконань тренувань вам буде потрібно гантелі (зручного для вас ваги) і стілець.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Flame className="w-8 h-8 text-orange-500" />
              <h3 className="text-xl font-bold dark:text-white">Інтенсивність</h3>
            </div>
            <p className="dark:text-gray-200">Середній рівень підготовки з поступовим збільшенням навантаження.</p>
          </div>

          <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Dumbbell className="w-8 h-8 text-purple-500" />
              <h3 className="text-xl font-bold dark:text-white">Обладнання</h3>
            </div>
            <p className="dark:text-gray-200">Гантелі зручної ваги та стілець для виконання вправ.</p>
          </div>

          <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-8 h-8 text-indigo-500" />
              <h3 className="text-xl font-bold dark:text-white">Тривалість</h3>
            </div>
            <p className="dark:text-gray-200">3-тижнева програма з 9 інтенсивними тренуваннями.</p>
          </div>
        </div>
      </div>
    </section>
  );
}