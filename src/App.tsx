import { GameProvider, useGame } from './context/GameContext';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Dashboard } from './components/Dashboard';

function AppContent() {
  const { gameStarted } = useGame();

  if (!gameStarted) {
    return <WelcomeScreen />;
  }

  return <Dashboard />;
}

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
