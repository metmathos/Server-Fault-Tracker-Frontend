import { useState, useEffect } from 'react';
import FaultForm from './components/FaultForm';
import FaultList from './components/FaultList';
import FaultEditForm from './components/FaultEditForm';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div className="app-container">
      <header>
        <h1>Server Fault Tracker</h1>
        <button onClick={toggleDarkMode}>
          {darkMode ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
        </button>
      </header>
      <FaultForm />
      <FaultList />
      <FaultEditForm />
    </div>
  );
}

export default App;
