import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import PeriodTabs from './components/PeriodTabs';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionTable from './components/TransactionTable';
import TotalStats from './components/TotalStats';
import WorkspaceSelector from './components/WorkspaceSelector';
import './App.css';

function AppContent() {
  const { activeWorkspace } = useApp();

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
