import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import PeriodTabs from './components/PeriodTabs';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionTable from './components/TransactionTable';
import TotalStats from './components/TotalStats';
import WorkspaceSelector from './components/WorkspaceSelector';
import Notepad from './components/Notepad';
import SteamProfitCalculator from './components/SteamProfitCalculator';
import './App.css';

function AppContent() {
  const { activeWorkspace } = useApp();
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isNotepadOpen, setIsNotepadOpen] = useState(false);

  useEffect(() => {
    if (activeWorkspace === 2) {
      document.body.classList.add('workspace-2');
    } else {
      document.body.classList.remove('workspace-2');
    }
  }, [activeWorkspace]);

  return (
    <div className="container">
      <WorkspaceSelector />
      <Header />
      <TotalStats />
      <PeriodTabs />
      <Dashboard />
      <TransactionForm />
      <TransactionTable />
      
      {/* Not Defteri Butonu */}
      <button 
        className="notepad-button" 
        onClick={() => setIsNotepadOpen(true)}
        title="Not Defteri"
      >
        <svg viewBox="0 0 24 24">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M15,18V16H8V18H15M15,14V12H8V14H15Z" />
        </svg>
      </button>

      {/* Steam Kâr Hesaplayıcı Butonu */}
      <button 
        className="calculator-button" 
        onClick={() => setIsCalculatorOpen(true)}
        title="Steam Kâr Hesaplayıcı"
      >
        🧠
      </button>

      {/* Not Defteri */}
      <Notepad 
        isOpen={isNotepadOpen} 
        onClose={() => setIsNotepadOpen(false)} 
      />

      {/* Steam Kâr Hesaplayıcı */}
      <SteamProfitCalculator 
        isOpen={isCalculatorOpen} 
        onClose={() => setIsCalculatorOpen(false)} 
      />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
