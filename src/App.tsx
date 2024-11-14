import Header from './components/Header';
import Hero from './components/Hero';
import Overview from './components/Overview';
import WeeklySchedule from './components/WeeklySchedule';
import { ProgressProvider } from './contexts/ProgressContext';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <ProgressProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
          <Header />
          <Hero />
          <Overview />
          <WeeklySchedule />
        </div>
      </ProgressProvider>
    </ThemeProvider>
  );
}

export default App;