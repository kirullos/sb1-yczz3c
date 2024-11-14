import { useState, useEffect, useRef } from 'react';
import { Gift, Edit2, Save, X } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import confetti from 'canvas-confetti';
import { useTheme } from '../contexts/ThemeContext';

interface Prize {
  name: string;
  description: string;
  chance: number;
  gradient: [string, string];
}

const DEFAULT_PRIZES: Prize[] = [
  { 
    name: 'Промах',
    description: 'Воу воу. Полегше, попробуй знову свою вдачу',
    chance: 25,
    gradient: ['#F87171', '#DC2626']
  },
  { 
    name: 'Evening Spa',
    description: 'Вау, ви виграли від тренера масаж на 10 хвилин, вітаємо.',
    chance: 25,
    gradient: ['#6EE7B7', '#10B981']
  },
  { 
    name: 'Headache',
    description: 'Хмм, на когось чекають цілих три прищі в будь-якій частині тіла. Круто',
    chance: 25,
    gradient: ['#93C5FD', '#3B82F6']
  },
  { 
    name: 'Mega Prize',
    description: 'Вам книга прийшла, чудово',
    chance: 12.5,
    gradient: ['#FDE68A', '#F59E0B']
  },
  { 
    name: 'Secret Section',
    description: 'Secret Section',
    chance: 12.5,
    gradient: ['#C4B5FD', '#8B5CF6']
  }
];

const USER_ID = 'default-user';

export default function Roulette() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<Prize | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const [canSpin, setCanSpin] = useState(true);
  const requestRef = useRef<number>();
  const startTimeRef = useRef<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [prizes, setPrizes] = useState<Prize[]>(DEFAULT_PRIZES);
  const { theme } = useTheme();

  useEffect(() => {
    loadPrizes();
  }, []);

  const loadPrizes = async () => {
    try {
      const docRef = doc(db, 'wheel-config', USER_ID);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setPrizes(docSnap.data().prizes);
      }
    } catch (error) {
      console.error('Error loading prizes:', error);
    }
  };

  const savePrizes = async () => {
    try {
      await setDoc(doc(db, 'wheel-config', USER_ID), {
        prizes,
        updatedAt: new Date().toISOString()
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving prizes:', error);
    }
  };

  const updatePrize = (index: number, field: keyof Prize, value: string | number) => {
    const newPrizes = [...prizes];
    if (field === 'chance') {
      newPrizes[index] = { ...newPrizes[index], [field]: Number(value) };
    } else {
      newPrizes[index] = { ...newPrizes[index], [field]: value };
    }
    setPrizes(newPrizes);
  };

  const drawWheel = (currentRotation: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    
    const bgColor = theme === 'dark' ? '#1F2937' : '#FFFFFF';
    const textColor = theme === 'dark' ? '#FFFFFF' : '#000000';
    
    // Draw wheel shadow
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX + 5, centerY + 5, radius + 10, 0, 2 * Math.PI);
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    ctx.fillStyle = bgColor;
    ctx.fill();
    ctx.restore();
    
    // Draw wheel background
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 10, 0, 2 * Math.PI);
    ctx.fillStyle = bgColor;
    ctx.fill();
    
    // Draw sectors
    let startAngle = currentRotation;
    const total = prizes.reduce((sum, prize) => sum + prize.chance, 0);
    
    prizes.forEach((prize) => {
      const sliceAngle = (2 * Math.PI * prize.chance) / total;
      
      const gradient = ctx.createConicGradient(startAngle, centerX, centerY);
      gradient.addColorStop(0, prize.gradient[0]);
      gradient.addColorStop(1, prize.gradient[1]);
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.strokeStyle = theme === 'dark' ? '#374151' : '#E5E7EB';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Add text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = textColor;
      ctx.font = 'bold 16px Inter, system-ui, sans-serif';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 4;
      ctx.fillText(prize.name, radius - 30, 6);
      ctx.restore();
      
      startAngle += sliceAngle;
    });

    // Draw center decoration
    ctx.save();
    const centerRadius = 30;
    
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, centerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = bgColor;
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, centerRadius - 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#F59E0B';
    ctx.fill();
    ctx.restore();
    
    // Draw pointer
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    ctx.beginPath();
    ctx.moveTo(centerX + radius + 20, centerY);
    ctx.lineTo(centerX + radius - 10, centerY - 15);
    ctx.lineTo(centerX + radius - 10, centerY + 15);
    ctx.closePath();
    ctx.fillStyle = '#F59E0B';
    ctx.fill();
    ctx.strokeStyle = bgColor;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  };

  useEffect(() => {
    drawWheel(0);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [theme, prizes]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const spinWheel = () => {
    if (!canSpin || isSpinning) return;

    setIsSpinning(true);
    setCanSpin(false);
    setResult(null);
    startTimeRef.current = null;

    const random = Math.random() * 100;
    let cumulative = 0;
    let selectedPrize = prizes[prizes.length - 1];

    for (const prize of prizes) {
      cumulative += prize.chance;
      if (random <= cumulative) {
        selectedPrize = prize;
        break;
      }
    }

    const prizeIndex = prizes.findIndex(p => p.name === selectedPrize.name);
    const total = prizes.reduce((sum, prize) => sum + prize.chance, 0);
    const sectorAngle = (2 * Math.PI * selectedPrize.chance) / total;
    const targetAngle = prizes
      .slice(0, prizeIndex)
      .reduce((sum, prize) => sum + (prize.chance / total) * 2 * Math.PI, 0);
    
    const numRotations = 5;
    const targetRotation = numRotations * 2 * Math.PI + targetAngle + sectorAngle / 2;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const duration = 5000;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOutBack = (t: number) => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
      };
      
      rotationRef.current = targetRotation * easeOutBack(progress);
      drawWheel(-rotationRef.current);

      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        setResult(selectedPrize);
        setTimeout(() => setCanSpin(true), 1000);
        triggerConfetti();
      }
    };

    requestRef.current = requestAnimationFrame(animate);
  };

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <div className="flex items-center gap-4">
        <h2 className="text-3xl font-bold text-center dark:text-white">Колесо Фортуни</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Edit2 className="w-5 h-5 dark:text-white" />
        </button>
      </div>

      <div className="relative">
        <div className="relative p-4 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="max-w-full h-auto"
          />
        </div>

        {isEditing && (
          <div className="absolute inset-0 bg-white dark:bg-gray-900 bg-opacity-95 dark:bg-opacity-95 backdrop-blur-sm rounded-xl p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold dark:text-white">Налаштування секцій</h3>
              <div className="flex gap-2">
                <button
                  onClick={savePrizes}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-green-500"
                >
                  <Save className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-red-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {prizes.map((prize, index) => (
                <div key={index} className="space-y-2">
                  <input
                    type="text"
                    value={prize.name}
                    onChange={(e) => updatePrize(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 rounded border dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="Назва секції"
                  />
                  <input
                    type="text"
                    value={prize.description}
                    onChange={(e) => updatePrize(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 rounded border dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="Опис"
                  />
                  <input
                    type="number"
                    value={prize.chance}
                    onChange={(e) => updatePrize(index, 'chance', e.target.value)}
                    className="w-full px-3 py-2 rounded border dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="Шанс (%)"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={spinWheel}
        disabled={!canSpin || isSpinning || isEditing}
        className={`flex items-center gap-2 px-8 py-4 rounded-lg text-lg font-medium transition-all transform hover:scale-105 ${
          canSpin && !isSpinning && !isEditing
            ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-lg hover:shadow-xl'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
        }`}
      >
        <Gift className="w-6 h-6" />
        {isSpinning ? 'Крутиться...' : 'Крутити колесо'}
      </button>

      {result && (
        <div className="text-center animate-fade-in">
          <p className="text-xl font-medium mb-2 dark:text-white">{result.name}</p>
          <p className="text-lg text-gray-600 dark:text-gray-300">{result.description}</p>
        </div>
      )}
    </div>
  );
}