export default function Hero() {
  return (
    <div className="relative h-[70vh] bg-gradient-to-r from-purple-900 to-indigo-800">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80"
          alt="Fitness training"
          className="w-full h-full object-cover opacity-30"
        />
      </div>
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl text-white">
          <h1 className="text-6xl font-bold mb-6 font-serif">СТАНЬ СИЛЬНІШОЮ</h1>
          <p className="text-xl mb-8 leading-relaxed">
            Комплекс тренувань на 30–40 хвилин у форматі ТАБАТА, HIIT, Танцювальне тренування, 
            а також поділ за м'язовими групами.
          </p>
          <div className="flex gap-8 text-lg">
            <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full">
              <span className="font-bold">21</span> День
            </div>
            <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full">
              <span className="font-bold">Середній</span> Рівень
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}