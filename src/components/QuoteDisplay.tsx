import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, DocumentData } from 'firebase/firestore';
import { Edit3, Trash2, Plus, Loader2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface Quote {
  id?: string;
  text: string;
  author: string;
}

const initialQuotes: Quote[] = [
  { text: "Успіх – це здатність крокувати від однієї невдачі до іншої, не втрачаючи ентузіазму.", author: "Вінстон Черчилль" },
  { text: "Єдиний спосіб робити велику роботу – любити те, що ви робите.", author: "Стів Джобс" },
  { text: "Майбутнє належить тим, хто вірить у красу своїх мрій.", author: "Елеонора Рузвельт" },
  { text: "Геній – це один відсоток натхнення та дев'яносто дев'ять відсотків поту.", author: "Томас Едісон" },
  { text: "Освіта – найпотужніша зброя, яку ви можете використовувати, щоб змінити світ.", author: "Нельсон Мандела" }
];

export default function QuoteDisplay() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newQuote, setNewQuote] = useState({ text: '', author: '' });
  const { theme } = useTheme();

  useEffect(() => {
    loadQuotes();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [quotes.length]);

  const loadQuotes = async () => {
    try {
      const quotesCollection = collection(db, 'quotes');
      const quotesSnapshot = await getDocs(quotesCollection);
      
      if (quotesSnapshot.empty) {
        // Initialize with default quotes if none exist
        for (const quote of initialQuotes) {
          await addDoc(quotesCollection, quote);
        }
        setQuotes(initialQuotes);
      } else {
        const loadedQuotes = quotesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Quote[];
        setQuotes(loadedQuotes);
      }
    } catch (error) {
      console.error('Error loading quotes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addQuote = async () => {
    if (!newQuote.text || !newQuote.author) return;

    try {
      const quotesCollection = collection(db, 'quotes');
      const docRef = await addDoc(quotesCollection, newQuote);
      setQuotes([...quotes, { ...newQuote, id: docRef.id }]);
      setNewQuote({ text: '', author: '' });
    } catch (error) {
      console.error('Error adding quote:', error);
    }
  };

  const deleteQuote = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'quotes', id));
      setQuotes(quotes.filter(quote => quote.id !== id));
    } catch (error) {
      console.error('Error deleting quote:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
      </div>
    );
  }

  return (
    <div className="relative mb-16">
      <div className="max-w-3xl mx-auto px-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="px-4 bg-gray-50 dark:bg-gray-900">
              <h2 className="text-3xl font-bold font-serif dark:text-white">Цитати Дня</h2>
            </div>
          </div>
        </div>

        <div className="mt-8 relative min-h-[200px]">
          {quotes.length > 0 && (
            <div
              key={currentQuoteIndex}
              className="absolute inset-0 flex flex-col items-center justify-center text-center animate-fade-in"
            >
              <blockquote className="text-2xl font-serif italic font-medium text-gray-900 dark:text-white mb-4 leading-relaxed">
                "{quotes[currentQuoteIndex].text}"
              </blockquote>
              <cite className="text-lg font-serif text-gray-600 dark:text-gray-400 not-italic">
                — {quotes[currentQuoteIndex].author}
              </cite>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-black transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            {isEditing ? 'Закрити редактор' : 'Редагувати цитати'}
          </button>
        </div>

        {isEditing && (
          <div className="mt-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="space-y-4">
              <input
                type="text"
                value={newQuote.text}
                onChange={(e) => setNewQuote({ ...newQuote, text: e.target.value })}
                placeholder="Текст цитати"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
              <input
                type="text"
                value={newQuote.author}
                onChange={(e) => setNewQuote({ ...newQuote, author: e.target.value })}
                placeholder="Автор"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
              <button
                onClick={addQuote}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
                Додати цитату
              </button>
            </div>

            <div className="space-y-4">
              {quotes.map((quote, index) => (
                <div
                  key={quote.id || index}
                  className="flex items-start justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-900"
                >
                  <div>
                    <p className="font-serif text-lg dark:text-white">{quote.text}</p>
                    <p className="text-sm font-serif text-gray-600 dark:text-gray-400">— {quote.author}</p>
                  </div>
                  {quote.id && (
                    <button
                      onClick={() => deleteQuote(quote.id!)}
                      className="p-2 text-red-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}